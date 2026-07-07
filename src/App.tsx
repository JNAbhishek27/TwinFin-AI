/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { DigitalTwinState } from "./types";
import Header from "./components/Header";
import HealthCardOverview from "./components/HealthCardOverview";
import ForecastCharts from "./components/ForecastCharts";
import WhatIfSimulator from "./components/WhatIfSimulator";
import LoanAdvisory from "./components/LoanAdvisory";
import DigitalTwinAlternateData from "./components/DigitalTwinAlternateData";
import OcrWidget from "./components/OcrWidget";
import CopilotChat from "./components/CopilotChat";
import RmDashboard from "./components/RmDashboard";
import { Sparkles, Landmark, Users, ArrowUpRight, Activity, HelpCircle, ShieldCheck } from "lucide-react";

export default function App() {
  const [activeTwinId, setActiveTwinId] = useState("ananya-foods");
  const [activeTwin, setActiveTwin] = useState<DigitalTwinState | null>(null);
  const [portalMode, setPortalMode] = useState<"msme" | "rm">("msme");
  const [twinsSummary, setTwinsSummary] = useState<{ id: string; businessName: string; constitution: string; industry: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedReport, setSimulatedReport] = useState<any | null>(null);

  // Load twins summaries and initial active twin on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const summaryRes = await fetch("/api/twins");
        if (summaryRes.ok) {
          const summaries = await summaryRes.json();
          setTwinsSummary(summaries);
        }
        await fetchTwinData(activeTwinId);
      } catch (err) {
        console.error("Failed to load initial MSME data:", err);
      }
    }
    loadInitialData();
  }, []);

  // Fetch twin data when active twin changes
  const fetchTwinData = async (id: string) => {
    setLoading(true);
    setIsSimulating(false);
    setSimulatedReport(null);
    try {
      const res = await fetch(`/api/twins/${id}`);
      if (res.ok) {
        const data = await res.json();
        setActiveTwin(data);
      }
    } catch (err) {
      console.error("Failed to fetch single twin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTwinChange = async (id: string) => {
    setActiveTwinId(id);
    await fetchTwinData(id);
  };

  const handleSimulationRun = (simResult: {
    simulatedHealthCard: any;
    simulatedForecasts: any;
    simulatedLoanRecommendation: any;
    report: any;
  }) => {
    if (!activeTwin) return;

    // Update active twin state with simulated values
    setActiveTwin((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        healthCard: simResult.simulatedHealthCard,
        forecasts: simResult.simulatedForecasts,
        loanRecommendation: {
          ...prev.loanRecommendation,
          safeLoanAmount: simResult.simulatedLoanRecommendation.safeAmount,
          approvalProbability: simResult.simulatedLoanRecommendation.approvalProbability,
          expectedEMI: simResult.simulatedLoanRecommendation.emi || prev.loanRecommendation.expectedEMI,
        },
      };
    });
    setSimulatedReport(simResult.report);
    setIsSimulating(true);
  };

  const handleReset = async () => {
    await fetchTwinData(activeTwinId);
  };

  // High-fidelity dynamic OCR integration: adds score improvement & log entry
  const handleOcrMerge = (ocrResult: any) => {
    if (!activeTwin) return;

    setActiveTwin((prev) => {
      if (!prev) return null;

      // Create a new explanation attribution node
      const ocrNode: any = {
        id: `ocr-${Date.now()}`,
        metric: ocrResult.documentType === "Invoice" ? "Trade Invoice Liquidity" : "Ancillary Statement",
        impact: "positive",
        scoreChange: 2,
        message: `OCR verification of "${ocrResult.fileName}" confirmed liquid business margins, lifting credit worthiness index.`,
        source: ocrResult.documentType,
      };

      // Add points to overall score & creditworthiness
      const updatedHC = {
        ...prev.healthCard,
        overallScore: Math.min(99, prev.healthCard.overallScore + 2),
        creditworthiness: Math.min(99, prev.healthCard.creditworthiness + 2),
        liquidityScore: Math.min(99, prev.healthCard.liquidityScore + (ocrResult.documentType === "Invoice" ? 3 : 1)),
      };

      return {
        ...prev,
        healthCard: updatedHC,
        explanations: [ocrNode, ...prev.explanations],
      };
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-400">
      {/* 1. Header Navigation */}
      <Header
        twins={twinsSummary}
        activeTwinId={activeTwinId}
        onTwinChange={handleTwinChange}
        portalMode={portalMode}
        onPortalModeChange={setPortalMode}
        activeProfile={activeTwin ? activeTwin.msme : null}
        onReset={handleReset}
        isSimulating={isSimulating}
      />

      {/* 2. Main Content Canvas */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
            <p className="text-sm text-neutral-400 font-mono tracking-wide">
              Fetching MSME Financial Digital Twin nodes...
            </p>
          </div>
        ) : portalMode === "rm" ? (
          /* Relationship Manager Dashboard View */
          <RmDashboard />
        ) : activeTwin ? (
          /* MSME Owner View (Financial Operating System Panels) */
          <div className="space-y-6">
            {/* Simulation Active Banner warning */}
            {isSimulating && (
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-amber-400 text-xs font-sans leading-relaxed flex items-center justify-between flex-wrap gap-2 animate-fade-in">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 animate-pulse" />
                  <span>
                    <strong>Scenario Sandbox Active:</strong> You are viewing a simulated state of your business credit vectors. Projections, recommendations, and ratings have adjusted accordingly. Click "Reset Simulation" in the header to return to real-time synchronized feeds.
                  </span>
                </div>
                <button
                  onClick={handleReset}
                  className="bg-amber-500 text-neutral-950 hover:bg-amber-400 px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer"
                >
                  Reset Feed
                </button>
              </div>
            )}

            {/* Panel Row 1: Health Card & Scores (Explainable AI inside) */}
            <HealthCardOverview healthCard={activeTwin.healthCard} explanations={activeTwin.explanations} />

            {/* Panel Row 2: ML Financial Forecasting Charts */}
            <ForecastCharts forecasts={activeTwin.forecasts} isSimulated={isSimulating} />

            {/* Panel Row 3: Slider Simulator (left 7 cols) & Copilot (right 5 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <WhatIfSimulator
                  twinId={activeTwinId}
                  onSimulationRun={handleSimulationRun}
                  onReset={handleReset}
                  isSimulating={isSimulating}
                />
              </div>
              <div className="lg:col-span-5">
                <CopilotChat twinId={activeTwinId} businessName={activeTwin.msme.businessName} />
              </div>
            </div>

            {/* Panel Row 4: Predictive Lending Recommendation & Pre-qualification tasks */}
            <LoanAdvisory loanRec={activeTwin.loanRecommendation} overallScore={activeTwin.healthCard.overallScore} />

            {/* Panel Row 5: Detailed Alternate Data Grid (GST/UPI/EPF tabs) */}
            <DigitalTwinAlternateData alternateData={activeTwin.alternateData} />

            {/* Panel Row 6: OCR upload ledger integration */}
            <OcrWidget twinId={activeTwinId} onOcrMerge={handleOcrMerge} />
          </div>
        ) : (
          <div className="text-center py-16 bg-neutral-900/50 rounded-2xl border border-neutral-800">
            <h3 className="text-base font-bold text-neutral-300">Financial Twin Error</h3>
            <p className="text-xs text-neutral-500 mt-1">A problem occurred loading the financial profile data blocks.</p>
          </div>
        )}
      </main>

      {/* 3. Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-6 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-neutral-500 gap-4">
          <p>© 2026 IDBI TwinFin AI Platform. All rights reserved. IDBI Innovate Hackathon MVP.</p>
          <div className="flex gap-4 font-mono text-[10px]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              AES-256 Encrypted
            </span>
            <span className="flex items-center gap-1">
              <Landmark className="w-3.5 h-3.5 text-cyan-400" />
              UPI & Account Aggregator Verified
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
