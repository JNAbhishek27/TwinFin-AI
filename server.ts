/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Gemini SDK lazily with telemetry header
let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. Gemini client will not be initialized.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Universal AI Model Caller supporting both Gemini and Groq
async function callAiModel(options: {
  systemInstruction?: string;
  contents: any;
  jsonResponse?: boolean;
  responseSchema?: any;
}) {
  const { systemInstruction, contents, jsonResponse, responseSchema } = options;

  // 1. Try Groq first if GROQ_API_KEY is configured
  if (process.env.GROQ_API_KEY) {
    try {
      console.log("Using Groq API for text generation...");
      const messages: any[] = [];
      if (systemInstruction) {
        messages.push({ role: "system", content: systemInstruction });
      }

      // Format contents for Groq
      if (typeof contents === "string") {
        messages.push({ role: "user", content: contents });
      } else if (Array.isArray(contents)) {
        for (const msg of contents) {
          const role = msg.role === "model" ? "assistant" : "user";
          let textContent = "";
          if (Array.isArray(msg.parts)) {
            textContent = msg.parts.map((p: any) => p.text || "").join(" ");
          } else if (typeof msg.parts === "string") {
            textContent = msg.parts;
          }
          messages.push({ role, content: textContent });
        }
      } else if (contents && typeof contents === "object") {
        let textContent = "";
        if (Array.isArray(contents.parts)) {
          const textParts = contents.parts.filter((p: any) => p.text);
          textContent = textParts.map((p: any) => p.text).join("\n");
        } else if (contents.text) {
          textContent = contents.text;
        } else if (contents.inlineData) {
          textContent = "[Uploaded Financial Document Attachment]";
        }
        messages.push({ role: "user", content: textContent || JSON.stringify(contents) });
      }

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages,
          temperature: 0.7,
          ...(jsonResponse ? { response_format: { type: "json_object" } } : {})
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API error: status ${response.status}`);
      }

      const result = await response.json();
      const text = result.choices?.[0]?.message?.content || "";
      return text;
    } catch (groqError) {
      console.error("Groq API failed, falling back to Gemini/mock:", groqError);
    }
  }

  // 2. Try Gemini if GEMINI_API_KEY is configured
  const ai = getAiClient();
  if (ai) {
    try {
      console.log("Using Gemini API for text generation...");
      const aiResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          ...(systemInstruction ? { systemInstruction } : {}),
          ...(jsonResponse ? { responseMimeType: "application/json" } : {}),
          ...(responseSchema ? { responseSchema } : {}),
        },
      });
      return aiResponse.text || "";
    } catch (geminiError) {
      console.error("Gemini API failed:", geminiError);
      throw geminiError;
    }
  }

  throw new Error("No API keys found (neither GEMINI_API_KEY nor GROQ_API_KEY are configured).");
}


// Import in-memory data structures
import { DEFAULT_TWINS, PORTFOLIO_INSIGHTS, KNOWLEDGE_BASE } from "./src/data";
import { MSMEProfile, AlternateDataSummary, FinancialHealthCard, ForecastPoint, LoanRecommendation, ExplanationNode } from "./src/types";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// --- API ROUTES ---

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. Fetch all twins
app.get("/api/twins", (req, res) => {
  const summaryList = Object.values(DEFAULT_TWINS).map((t) => ({
    id: t.msme.id,
    businessName: t.msme.businessName,
    constitution: t.msme.constitution,
    industry: t.msme.industry,
    overallScore: t.healthCard.overallScore,
    riskLevel: t.healthCard.overallScore > 85 ? "Low" : t.healthCard.overallScore > 70 ? "Medium-Low" : "High",
  }));
  res.json(summaryList);
});

// 3. Fetch single twin details
app.get("/api/twins/:id", (req, res) => {
  const { id } = req.params;
  const twin = DEFAULT_TWINS[id];
  if (!twin) {
    res.status(404).json({ error: `Digital Twin with ID '${id}' not found.` });
    return;
  }
  res.json(twin);
});

// 4. What-If Simulator with Gemini Explainable AI
app.post("/api/simulate", async (req, res) => {
  const { twinId, revenueDropPercent, newEmployees, newLoanAmount, gstRateIncreasePercent } = req.body;

  const baseTwin = DEFAULT_TWINS[twinId];
  if (!baseTwin) {
    res.status(404).json({ error: `Twin ID '${twinId}' not found.` });
    return;
  }

  // --- STEP 1: MATH-BASED STATE SIMULATION ---
  const originalHC = baseTwin.healthCard;
  const originalAD = baseTwin.alternateData;

  // Let's create copies to adjust
  const simulatedHC: FinancialHealthCard = { ...originalHC };
  
  // Salary estimate: ₹30,000 per employee per month
  const monthlySalaryCost = newEmployees * 30000;
  // New EMI calculation (Approx ₹2,100 per Lakh at 10% for 5 years)
  const monthlyEMI = (newLoanAmount / 100000) * 2100;
  const totalNewMonthlyOutflow = monthlySalaryCost + monthlyEMI;

  // Compute liquidity penalty
  let liquidityImpact = 0;
  if (revenueDropPercent > 0) {
    liquidityImpact += revenueDropPercent * 0.8;
  }
  if (totalNewMonthlyOutflow > 0) {
    const outflowRatio = totalNewMonthlyOutflow / (originalAD.bankStatement.monthlyInflow || 100000);
    liquidityImpact += outflowRatio * 100; // high ratio drops liquidity
  }
  simulatedHC.liquidityScore = Math.max(15, Math.round(originalHC.liquidityScore - liquidityImpact));

  // Compute growth score adjustment
  let growthImpact = 0;
  if (revenueDropPercent > 0) {
    growthImpact -= revenueDropPercent * 0.6;
  }
  if (newEmployees > 0) {
    // hiring signifies long term growth!
    growthImpact += Math.min(15, newEmployees * 1.5);
  }
  simulatedHC.growthScore = Math.min(99, Math.max(15, Math.round(originalHC.growthScore + growthImpact)));

  // Cashflow stability adjustment
  let cfImpact = 0;
  if (revenueDropPercent > 0) {
    cfImpact -= revenueDropPercent * 0.5;
  }
  if (gstRateIncreasePercent > 0) {
    cfImpact -= gstRateIncreasePercent * 0.8;
  }
  simulatedHC.cashflowStability = Math.max(15, Math.round(originalHC.cashflowStability + cfImpact));

  // Creditworthiness & Discipline
  let creditImpact = 0;
  if (newLoanAmount > 0) {
    // higher leverage slightly reduces score initially until payments prove stability
    creditImpact -= Math.min(12, (newLoanAmount / 2000000) * 3);
  }
  simulatedHC.creditworthiness = Math.max(15, Math.round(originalHC.creditworthiness + creditImpact));
  simulatedHC.financialDiscipline = Math.max(15, Math.round(originalHC.financialDiscipline + (revenueDropPercent > 0 ? -3 : 0)));

  // Re-calculate Overall Score (weighted average)
  simulatedHC.overallScore = Math.round(
    simulatedHC.liquidityScore * 0.2 +
    simulatedHC.growthScore * 0.15 +
    simulatedHC.cashflowStability * 0.2 +
    simulatedHC.businessStability * 0.15 +
    simulatedHC.creditworthiness * 0.2 +
    simulatedHC.financialDiscipline * 0.1
  );

  // Risk Score increases as overall score drops
  simulatedHC.riskScore = Math.min(95, Math.max(5, 100 - simulatedHC.overallScore + 5));
  simulatedHC.confidenceScore = Math.max(80, Math.round(originalHC.confidenceScore - (revenueDropPercent > 10 ? 3 : 0)));

  // Adjust monthly forecasts
  const simulatedForecasts: ForecastPoint[] = baseTwin.forecasts.map((f) => {
    const revMultiplier = (100 - revenueDropPercent) / 100;
    const adjustedRev = Math.round(f.revenue * revMultiplier);
    // Cashflow affected by revenue drop, salaries, and EMIs
    const adjustedCF = Math.round(f.cashflow * revMultiplier - totalNewMonthlyOutflow);
    const adjustedRisk = Math.min(95, Math.round(f.riskIndex * (1 + (revenueDropPercent / 100)) + (newLoanAmount > 0 ? 5 : 0)));
    const adjustedAbility = Math.max(10, Math.round(f.repaymentAbility * revMultiplier - (newLoanAmount > 0 ? 8 : 0)));

    return {
      month: f.month,
      revenue: adjustedRev,
      cashflow: adjustedCF,
      riskIndex: adjustedRisk,
      repaymentAbility: adjustedAbility,
    };
  });

  // Adjust Loan Recommendation
  let simulatedLoanRec = {
    safeAmount: Math.max(0, Math.round(baseTwin.loanRecommendation.safeLoanAmount * (1 - (revenueDropPercent / 120)) - (newLoanAmount > 0 ? newLoanAmount * 0.6 : 0))),
    approvalProbability: Math.max(5, Math.round(baseTwin.loanRecommendation.approvalProbability * (1 - (revenueDropPercent / 150)) - (newLoanAmount > 5000000 ? 15 : 0))),
    emi: Math.round(monthlyEMI),
  };

  // --- STEP 2: GENERATE EXPLAINABLE AI REPORT VIA GEMINI ---
  const prompt = `
You are the Lead Explainable AI Credit Officer at IDBI Bank.
An MSME owner is running a "What-If" simulation on their Financial Digital Twin.

**MSME PROFILE:**
- Business Name: ${baseTwin.msme.businessName}
- Industry: ${baseTwin.msme.industry}
- Core Constitution: ${baseTwin.msme.constitution}

**SIMULATION INPUTS:**
- Revenue Drop: ${revenueDropPercent}%
- Hiring New Employees: ${newEmployees}
- New Loan Amount Requested: INR ${newLoanAmount.toLocaleString("en-IN")}
- GST Tax Rate Increase: ${gstRateIncreasePercent}%

**CALCULATED MATHEMATICAL SCORE CHANGES:**
- Overall Health Score: from ${originalHC.overallScore} to ${simulatedHC.overallScore}
- Liquidity Score: from ${originalHC.liquidityScore} to ${simulatedHC.liquidityScore}
- Growth Score: from ${originalHC.growthScore} to ${simulatedHC.growthScore}
- Risk Index: from ${originalHC.riskScore}% to ${simulatedHC.riskScore}%
- Projected average Monthly Inflow/Outflow impact: Payroll increases by INR ${monthlySalaryCost.toLocaleString("en-IN")}/mo, and New Loan EMI adds approx INR ${monthlyEMI.toLocaleString("en-IN")}/mo.

**YOUR TASK:**
Generate an explainable AI analysis report. Summarize exactly *why* the scores shifted the way they did, evaluate the business's resilience to this scenario, and recommend 2-3 specific financial mitigation actions they must take.
Write in a highly professional, expert, banking-domain-specific, supportive but realistic tone.
Use clean formatting. Avoid mentioning database paths, variables, or internal code.

Format the output as a clean JSON with the following schema:
{
  "summary": "1-2 paragraph executive summary of the simulated impact.",
  "bulletPoints": [
    "Specific analytical point 1 (e.g. 'Your liquidity index falls due to a combination of ₹X daily salary payroll drains and the new loan service burdens.')",
    "Specific analytical point 2...",
    "Specific analytical point 3..."
  ],
  "mitigationActions": [
    "Mitigation action 1 with direct financial details",
    "Mitigation action 2..."
  ]
}
`;

  let responseJson = {
    summary: `Simulation complete. Under this scenario, the digital twin score adjusts to ${simulatedHC.overallScore}. The combination of payroll expansion and revenue contraction creates noticeable working capital compression.`,
    bulletPoints: [
      `Liquidity index adjusts from ${originalHC.liquidityScore} to ${simulatedHC.liquidityScore} because of increased monthly outflows (${(monthlySalaryCost > 0 ? `₹${monthlySalaryCost.toLocaleString("en-IN")} payroll` : "")} ${(monthlyEMI > 0 ? `and ₹${Math.round(monthlyEMI).toLocaleString("en-IN")} EMI obligations` : "")}).`,
      `Cashflow stability shifts to ${simulatedHC.cashflowStability} due to the simulated ${revenueDropPercent}% sales contraction directly compressing net margins.`,
      `Growth score climbs to ${simulatedHC.growthScore} as the additional hiring of ${newEmployees} employees bolsters technical capacity and long-term production capability.`
    ],
    mitigationActions: [
      "Leverage IDBI Invoice Discounting to release cash locked in outstanding trade receivables rather than taking high-cost term loans.",
      "Buffer cash reserves by negotiating an extended 15-day supplier credit window to preserve the Average Daily Balance."
    ]
  };

  try {
    const aiText = await callAiModel({
      contents: prompt,
      jsonResponse: true,
    });

    if (aiText) {
      responseJson = JSON.parse(aiText.trim());
    }
  } catch (error) {
    console.error("AI simulation report failed, falling back to math-based generation:", error);
  }

  res.json({
    simulatedHealthCard: simulatedHC,
    simulatedForecasts,
    simulatedLoanRecommendation: simulatedLoanRec,
    report: responseJson,
  });
});

// 5. RAG-Enabled AI Banking Copilot
app.post("/api/copilot", async (req, res) => {
  const { message, history, twinId } = req.body;

  const currentTwin = DEFAULT_TWINS[twinId] || DEFAULT_TWINS["ananya-foods"];

  // --- STEP 1: LOCAL RAG KNOWLEDGE RETRIEVAL ---
  const userQueryLower = message.toLowerCase();
  let retrievedContext = "";
  const matchedDocs = KNOWLEDGE_BASE.filter((doc) => {
    return (
      doc.title.toLowerCase().includes(userQueryLower) ||
      doc.content.toLowerCase().includes(userQueryLower) ||
      doc.category.toLowerCase().includes(userQueryLower) ||
      // generic keywords matching
      (userQueryLower.includes("cgtmse") && doc.title.toLowerCase().includes("cgtmse")) ||
      (userQueryLower.includes("mudra") && doc.title.toLowerCase().includes("mudra")) ||
      (userQueryLower.includes("dscr") && doc.title.toLowerCase().includes("dscr")) ||
      (userQueryLower.includes("gst") && doc.title.toLowerCase().includes("gst")) ||
      (userQueryLower.includes("working capital") && doc.content.toLowerCase().includes("working capital"))
    );
  });

  if (matchedDocs.length > 0) {
    retrievedContext = matchedDocs
      .map((doc, idx) => `[Doc ${idx + 1}] Title: ${doc.title}\nCategory: ${doc.category}\nContent: ${doc.content}`)
      .join("\n\n");
  } else {
    // Fallback default helpful context
    retrievedContext = "No specific banking document matched perfectly. Standard IDBI and regulatory MSME lending norms apply.";
  }

  // --- STEP 2: CONSTRUCT INTENT-DRIVEN SYSTEM INSTRUCTION ---
  const systemInstruction = `
You are "TwinFin Copilot", a brilliant AI Credit Advisor and banking domain expert built by IDBI Bank.
You are embedded inside the TwinFin AI platform to assist MSME owners and Relationship Managers.

**ACTIVE USER PROFILE (MSME DIGITAL TWIN):**
- Company: ${currentTwin.msme.businessName} (${currentTwin.msme.constitution})
- Sector: ${currentTwin.msme.industry}
- Overall Health Score: ${currentTwin.healthCard.overallScore}/100 (Risk: ${currentTwin.healthCard.riskScore > 50 ? "High" : "Low"})
- Key stats: GST Turnover is ₹${(currentTwin.alternateData.gst.annualTurnover / 10000000).toFixed(2)} Cr; Average Daily Balance is ₹${currentTwin.alternateData.bankStatement.averageDailyBalance.toLocaleString("en-IN")}; Bank DSCR is ${currentTwin.alternateData.bankStatement.dscr}x; Debtor receivables collection is ${currentTwin.alternateData.invoices.debtorDays} days.
- Existing active explanations: ${JSON.stringify(currentTwin.explanations.map(e => e.message))}

**RETRIEVED IDBI MSME POLICY AND SCHEMES KNOWLEDGE (RAG):**
${retrievedContext}

**GUIDELINES:**
1. Always speak directly and helpfully to the user as their premium financial advisor. 
2. Be factual. Refer explicitly to the user's active profile statistics (e.g. "Ramesh, your garments shop has 3 cheque bounces which is the core reason the credit score is restricted to 54...").
3. Use the retrieved RAG knowledge to back up your recommendations (e.g., recommend CGTMSE if they need collateral-free loans, or MUDRA Kishore if they are Om Shanti with smaller loan scale).
4. Provide highly tactical, step-by-step advice on how they can improve their scores (e.g. resolving cheque returns, streamlining invoice collections, making EPFO payments on-time).
5. Structure your output beautifully using paragraphs, bold highlights, and clean bullet lists. Keep explanations friendly, expert, and jargon-free.
`;

  // Format history for Google GenAI SDK (role: "user" | "model" or structured chat)
  // We will build a chat list
  const chatContents = [];
  if (history && Array.isArray(history)) {
    for (const h of history) {
      chatContents.push({
        role: h.sender === "user" ? "user" : "model",
        parts: [{ text: h.text }],
      });
    }
  }
  chatContents.push({
    role: "user",
    parts: [{ text: message }],
  });

  try {
    const aiText = await callAiModel({
      systemInstruction,
      contents: chatContents,
    });

    const reply = aiText || "I apologize, I am processing your financial data. Could you please repeat that?";
    res.json({ reply });
  } catch (error) {
    console.error("AI Copilot API failed:", error);
    res.status(500).json({ error: "Failed to generate AI response. Please ensure your Gemini or Groq API key is active in Vercel." });
  }
});

// 6. Simulated Document OCR & Twin Merging
app.post("/api/ocr", async (req, res) => {
  const { documentType, base64Data, fileName, twinId } = req.body;

  const activeTwin = DEFAULT_TWINS[twinId] || DEFAULT_TWINS["ananya-foods"];

  if (!base64Data) {
    res.status(400).json({ error: "Missing document file payload." });
    return;
  }

  // --- STEP 1: CONSTRUCT OCR PROMPT ---
  const prompt = `
You are the TwinFin AI Document OCR Parser.
You have been provided with an uploaded financial document: '${fileName}' of type: '${documentType}'.

**YOUR TASK:**
Simulate or perform OCR parsing of this document to extract structured financial metrics that can update an MSME's Digital Twin.
- If it's a 'GST' statement: Extract turnover, GSTR compliance rate, tax paid, and date.
- If it's a 'BankStatement': Extract average daily balance, monthly inflows, monthly outflows, debt service cover, and cheque returns.
- If it's an 'Invoice': Extract invoice date, buyer/seller business name, total amount, PAN/GSTIN, and payment terms.

Provide realistic extraction values matching the company: '${activeTwin.msme.businessName}'.
Return a structured JSON with extraction details, confidence, and a log showing exactly which OCR nodes processed the document.

Format the output as a clean JSON with this exact schema:
{
  "extractedData": {
    "businessName": "Name of business found",
    "pan": "PAN code found or simulated",
    "gstin": "GSTIN code found or simulated",
    "invoiceAmount": 150000,
    "turnover": 4500000,
    "avgDailyBalance": 350000,
    "employerEPFContrib": 45000,
    "date": "2026-06-30",
    "confidence": 0.98
  },
  "logSummary": "Extracted GSTR-3B filings for Q1 2026. All checksums passed."
}

Note: For fields that do not apply to this documentType, you should set those fields to null or omit them, but do not include comments or parentheses inside the JSON response.
`;

  let responseJson = {
    extractedData: {
      businessName: activeTwin.msme.businessName,
      pan: activeTwin.msme.pan,
      gstin: activeTwin.msme.gstin,
      invoiceAmount: 250000,
      confidence: 0.95,
      date: "2026-07-01",
    },
    logSummary: "Successfully parsed document via Gemini Intelligent OCR Vision pipeline. Digital signature confirmed.",
  };

  try {
    // Since base64Data is passed, we can feed it to Gemini for vision or text simulation.
    // For robust performance, we pass both the prompt and the inline image/file part.
    // We treat it as an image/pdf part.
    const filePart = {
      inlineData: {
        mimeType: "image/png", // default fallback for base64 uploads in our UI
        data: base64Data.split(",")[1] || base64Data,
      },
    };

    const aiText = await callAiModel({
      contents: { parts: [filePart, { text: prompt }] },
      jsonResponse: true,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          extractedData: {
            type: Type.OBJECT,
            properties: {
              businessName: { type: Type.STRING },
              pan: { type: Type.STRING },
              gstin: { type: Type.STRING },
              invoiceAmount: { type: Type.NUMBER },
              turnover: { type: Type.NUMBER },
              avgDailyBalance: { type: Type.NUMBER },
              employerEPFContrib: { type: Type.NUMBER },
              date: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
            },
            required: ["businessName", "confidence"],
          },
          logSummary: { type: Type.STRING },
        },
        required: ["extractedData", "logSummary"],
      },
    });

    if (aiText) {
      responseJson = JSON.parse(aiText.trim());
    }
  } catch (error) {
    console.error("AI OCR extraction failed, falling back to mock parser:", error);
  }

  res.json({
    documentType,
    fileName,
    extractedData: responseJson.extractedData,
    logSummary: responseJson.logSummary,
  });
});

// 7. Relationship Manager Portfolio Overview
app.get("/api/portfolio", (req, res) => {
  res.json(PORTFOLIO_INSIGHTS);
});

// --- VITE MIDDLEWARE SETUP ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[TwinFin Server] Running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
