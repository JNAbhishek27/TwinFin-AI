/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DigitalTwinState, PortfolioInsight } from "./types.ts";

export const DEFAULT_TWINS: Record<string, DigitalTwinState> = {
  "ananya-foods": {
    msme: {
      id: "ananya-foods",
      businessName: "Ananya Food Processing Pvt Ltd",
      constitution: "Pvt Ltd",
      industry: "Agro & Food Processing",
      registrationDate: "2019-03-12",
      pan: "AAACA1294K",
      gstin: "27AAACA1294K1Z0",
      ownerName: "Ananya Deshmukh",
      employeeCount: 42,
    },
    alternateData: {
      gst: {
        filingCompliance: 100,
        annualTurnover: 48000000, // ₹4.8 Crore
        growthRate: 24, // 24% YoY
        gstPaid6M: 1800000,
        metrics: [
          { label: "GSTR-1 & 3B Filing Timeliness", value: "100% (On Time)", status: "excellent", trend: "stable", description: "Zero delay in filings over the last 18 months, indicating exemplary corporate governance." },
          { label: "Quarterly Sales Trend", value: "₹1.25 Cr (Avg)", status: "excellent", trend: "up", description: "Steady expansion in wholesale orders with a 15% upward trajectory." },
          { label: "Tax Liability to Turnover", value: "18.2%", status: "good", trend: "stable", description: "Consistently aligned with industry average tax brackets for agricultural processing." }
        ]
      },
      upi: {
        monthlyVolume: 1250000, // ₹12.5 Lakhs
        transactionCount: 2800,
        successRate: 99.4,
        peakHoursInflow: 450000,
        metrics: [
          { label: "UPI Inward Settlement Velocity", value: "₹12.5L / mo", status: "excellent", trend: "up", description: "High volume of quick retail settle receipts, lowering overall working capital gaps." },
          { label: "Transaction Success Rate", value: "99.4%", status: "excellent", trend: "stable", description: "Negligible settlement failures or customer disputes, indicating clear cash checkout hygiene." },
          { label: "Dispute / Chargeback Ratio", value: "0.02%", status: "excellent", trend: "stable", description: "Extremely low claim rates from merchant customers." }
        ]
      },
      bankStatement: {
        averageDailyBalance: 850000, // ₹8.5 Lakhs
        monthlyInflow: 4200000, // ₹42 Lakhs
        monthlyOutflow: 3850000, // ₹38.5 Lakhs
        dscr: 2.1,
        metrics: [
          { label: "Average Daily Balance (ADB)", value: "₹8,50,000", status: "excellent", trend: "up", description: "Strong buffer liquidity maintaining 1.5x minimum weekly payroll obligations." },
          { label: "Inflow-to-Outflow Ratio", value: "1.09x", status: "excellent", trend: "up", description: "Positive net operating cash accumulation month-over-month." },
          { label: "Debt Service Coverage (DSCR)", value: "2.10x", status: "excellent", trend: "stable", description: "Ample room to accommodate new EMI liabilities without squeezing operational funds." },
          { label: "Inward Cheque Bounces", value: "0 (Last 12M)", status: "excellent", trend: "stable", description: "Perfect counterparty credit behavior with zero returned cheques." }
        ]
      },
      accountAggregator: {
        consentStatus: "Active",
        linkedAccountsCount: 3,
        totalSavingsBalance: 3200000, // ₹32 Lakhs
        otherCurrentObligations: 120000, // Active monthly EMI
        metrics: [
          { label: "Linked Accounts Status", value: "3 Bank Accounts Verified", status: "excellent", trend: "stable", description: "Fully consolidated view from IDBI, HDFC, and SBI." },
          { label: "Total Auxiliary Balance", value: "₹32,00,000", status: "excellent", trend: "up", description: "Substantial cash reserves in current/savings representing solid net worth." },
          { label: "Leverage Ratio (Obligation/Inflow)", value: "2.8%", status: "excellent", trend: "down", description: "Current EMI commitments account for less than 3% of gross monthly inflows." }
        ]
      },
      epfo: {
        activeEmployees: 38,
        employerContributionMonthly: 114000, // ₹1.14 Lakh
        complianceStatus: "Compliant",
        metrics: [
          { label: "EPF Contribution Consistency", value: "100% On-Time", status: "excellent", trend: "stable", description: "Regular monthly payroll deposits verify a highly stable, non-contractual workforce." },
          { label: "Staff Retention Rate", value: "92% (12M)", status: "excellent", trend: "stable", description: "Very low churn rate reflecting operational stability and growth." }
        ]
      },
      invoices: {
        totalReceivables: 3500000, // ₹35 Lakh
        totalPayables: 1800000, // ₹18 Lakh
        debtorDays: 28, // Excellent
        creditorDays: 45, // Healthy
        collectionEfficiency: 96.5,
        metrics: [
          { label: "Debtor Days (Collection Period)", value: "28 Days", status: "excellent", trend: "down", description: "Invoices settled in under a month. High buyer quality and tight collection loops." },
          { label: "Invoice Collection Efficiency", value: "96.5%", status: "excellent", trend: "stable", description: "Very low delinquent invoices, minimizing bad-debt write-off risks." },
          { label: "Vendor Credit Terms", value: "45 Days Avg", status: "good", trend: "stable", description: "Sufficient vendor goodwill allows holding cash longer for working capital." }
        ]
      },
    },
    healthCard: {
      overallScore: 92,
      liquidityScore: 89,
      growthScore: 94,
      cashflowStability: 95,
      businessStability: 91,
      creditworthiness: 93,
      financialDiscipline: 96,
      riskScore: 8, // Out of 100, lower is better
      confidenceScore: 98,
    },
    explanations: [
      { id: "e1", metric: "GST Compliance", impact: "positive", scoreChange: 8, message: "Perfect 100% timely GST filing over the last 18 months significantly boosts credit score.", source: "GST" },
      { id: "e2", metric: "Cashflow DSCR", impact: "positive", scoreChange: 7, message: "Debt Service Coverage Ratio (DSCR) of 2.10x ensures the business can comfortably service double its current debt.", source: "Bank" },
      { id: "e3", metric: "Invoice Days", impact: "positive", scoreChange: 6, message: "Debtor days reduced from 34 to 28 days, releasing ₹6.2 Lakhs of stuck liquidity.", source: "Invoices" },
      { id: "e4", metric: "Workforce EPF", impact: "positive", scoreChange: 4, message: "100% compliant EPF deposits with zero delays verify highly sustainable employee retention.", source: "EPFO" }
    ],
    forecasts: [
      { month: "Jul 26", revenue: 4000000, cashflow: 350000, riskIndex: 10, repaymentAbility: 95 },
      { month: "Aug 26", revenue: 4150000, cashflow: 380000, riskIndex: 9, repaymentAbility: 96 },
      { month: "Sep 26", revenue: 4300000, cashflow: 410000, riskIndex: 8, repaymentAbility: 97 },
      { month: "Oct 26", revenue: 4400000, cashflow: 400000, riskIndex: 8, repaymentAbility: 97 },
      { month: "Nov 26", revenue: 4600000, cashflow: 490000, riskIndex: 7, repaymentAbility: 98 },
      { month: "Dec 26", revenue: 4850000, cashflow: 550000, riskIndex: 6, repaymentAbility: 99 },
    ],
    loanRecommendation: {
      safeLoanAmount: 6500000, // ₹65 Lakhs
      expectedEMI: 138000, // ₹1.38 Lakh
      interestRateRange: "8.75% - 9.50% p.a.",
      approvalProbability: 97,
      collateralSuggestions: [
        "Unsecured / CGTMSE Covered (No hard collateral required)",
        "Hypothecation of food processing plants and cold-chain inventory",
        "Personal Guarantee of promoter directors"
      ],
      recommendedTenorMonths: 60,
      preApplicationImprovements: [
        "Consolidate current account activities entirely into IDBI Bank to gain immediate premium relationship pricing (-0.25% ROI benefit)",
        "Register for the TReDS platform to further reduce buyer credit days on institutional invoices"
      ],
      alternativeProducts: [
        { name: "IDBI MSME Easy Working Capital", type: "Working Capital", maxAmount: 5000000, rate: "8.90%", pros: "Immediate overdraft facility, monthly interest on utilized funds only" },
        { name: "IDBI CGTMSE Term Loan", type: "MSME Term Loan", maxAmount: 20000000, rate: "9.25%", pros: "Fully collateral-free with credit guarantee support up to ₹5 Crore" }
      ]
    }
  },
  "om-shanti": {
    msme: {
      id: "om-shanti",
      businessName: "Om Shanti Garments & Textiles",
      constitution: "Proprietorship",
      industry: "Apparel & Fashion Retail",
      registrationDate: "2015-11-20",
      pan: "APSPS8821M",
      gstin: "27APSPS8821M1Z5",
      ownerName: "Ramesh Sharma",
      employeeCount: 12,
    },
    alternateData: {
      gst: {
        filingCompliance: 78,
        annualTurnover: 14000000, // ₹1.4 Crore
        growthRate: -6, // Dropping YoY
        gstPaid6M: 420000,
        metrics: [
          { label: "GST Filing Compliance", value: "78% (Delayed Filings)", status: "critical", trend: "down", description: "Frequent delays in filing GSTR-3B (average 18 days delay). Incurs late fines and blocks input tax credit for buyers." },
          { label: "Quarterly Sales Trend", value: "₹31 Lakh (Avg)", status: "fair", trend: "down", description: "Sales contracted by 8% due to slow regional consumer spend and competition." }
        ]
      },
      upi: {
        monthlyVolume: 350000, // ₹3.5 Lakh
        transactionCount: 950,
        successRate: 94.2,
        peakHoursInflow: 80000,
        metrics: [
          { label: "UPI Monthly Volume", value: "₹3,50,000", status: "fair", trend: "down", description: "Inward QR settlements decreased by 18% in the last 90 days." },
          { label: "Failed/Unsettled Ratio", value: "5.8% Fail Rate", status: "critical", trend: "up", description: "High settlement failure rate due to local ISP glitches and unverified device setups." }
        ]
      },
      bankStatement: {
        averageDailyBalance: 42000, // ₹42k - very low!
        monthlyInflow: 1100000, // ₹11 Lakh
        monthlyOutflow: 1120000, // ₹11.2 Lakh (Deficit)
        dscr: 0.85, // Alarmingly low
        metrics: [
          { label: "Average Daily Balance (ADB)", value: "₹42,000", status: "critical", trend: "down", description: "Extremely thin liquidity cushion. Vulnerable to sudden unpaid supplier bills." },
          { label: "Inflow-to-Outflow Ratio", value: "0.98x", status: "critical", trend: "down", description: "Spending exceeds earnings, eating into cash reserves." },
          { label: "Inward Cheque Bounces", value: "3 Bounces (Last 6M)", status: "critical", trend: "up", description: "3 cheque bounces due to insufficient funds, raising significant credit alarms." },
          { label: "Debt Service Coverage (DSCR)", value: "0.85x", status: "critical", trend: "down", description: "Operating earnings are insufficient to cover current monthly EMIs." }
        ]
      },
      accountAggregator: {
        consentStatus: "Active",
        linkedAccountsCount: 2,
        totalSavingsBalance: 150000,
        otherCurrentObligations: 85000, // high compared to revenue
        metrics: [
          { label: "Active External EMIs", value: "₹85,000 / mo", status: "critical", trend: "stable", description: "Heavy short-term NBFC loans eating up retail margins." },
          { label: "Auxiliary Reserve Balance", value: "₹1,50,000", status: "fair", trend: "stable", description: "Modest reserves in co-owner savings account." }
        ]
      },
      epfo: {
        activeEmployees: 5, // Rest are contract/cash
        employerContributionMonthly: 15000,
        complianceStatus: "Delayed",
        metrics: [
          { label: "EPFO Payment Timeliness", value: "2 Delayed Payments", status: "fair", trend: "down", description: "Two delays of 10+ days in the last 6 months, matching cash shortage timings." }
        ]
      },
      invoices: {
        totalReceivables: 2800000, // ₹28 Lakh locked up!
        totalPayables: 2400000, // ₹24 Lakh owed
        debtorDays: 74, // Terrible
        creditorDays: 90, // Forced extension
        collectionEfficiency: 68.0,
        metrics: [
          { label: "Debtor Days (Collection Period)", value: "74 Days", status: "critical", trend: "up", description: "Capital locked in long credit loops with multi-brand retail buyers." },
          { label: "Collection Efficiency", value: "68.0%", status: "critical", trend: "down", description: "High concentration of overdue invoices above 60 days, raising working capital crunch." }
        ]
      }
    },
    healthCard: {
      overallScore: 54,
      liquidityScore: 38,
      growthScore: 45,
      cashflowStability: 42,
      businessStability: 56,
      creditworthiness: 48,
      financialDiscipline: 51,
      riskScore: 72, // High Risk
      confidenceScore: 92,
    },
    explanations: [
      { id: "e5", metric: "Cheque Bounces", impact: "negative", scoreChange: -18, message: "3 inward cheque returns in the last 180 days indicate extreme short-term liquidity distress and severely damage credit history.", source: "Bank" },
      { id: "e6", metric: "GST Delay", impact: "negative", scoreChange: -10, message: "Delayed filing of GST returns (average 18 days delayed GSTR-3B) indicates operational indiscipline and poor governance.", source: "GST" },
      { id: "e7", metric: "Receivables Squeeze", impact: "negative", scoreChange: -9, message: "Debtor days stretched to 74 days. Massive working capital locked in uncollected invoices.", source: "Invoices" },
      { id: "e8", metric: "Inflow Reduction", impact: "negative", scoreChange: -7, message: "UPI and cash inward settle volumes fell by 18% in the last quarter.", source: "UPI" }
    ],
    forecasts: [
      { month: "Jul 26", revenue: 1050000, cashflow: -20000, riskIndex: 75, repaymentAbility: 40 },
      { month: "Aug 26", revenue: 1000000, cashflow: -10000, riskIndex: 78, repaymentAbility: 38 },
      { month: "Sep 26", revenue: 1100000, cashflow: 15000, riskIndex: 74, repaymentAbility: 42 },
      { month: "Oct 26", revenue: 1250000, cashflow: 80000, riskIndex: 68, repaymentAbility: 48 },
      { month: "Nov 26", revenue: 1400000, cashflow: 180000, riskIndex: 58, repaymentAbility: 55 },
      { month: "Dec 26", revenue: 1550000, cashflow: 250000, riskIndex: 48, repaymentAbility: 64 },
    ],
    loanRecommendation: {
      safeLoanAmount: 800000, // ₹8 Lakhs max
      expectedEMI: 24000,
      interestRateRange: "11.5% - 13.5% p.a.",
      approvalProbability: 35, // High failure probability
      collateralSuggestions: [
        "Residential property collateral or liquid security required",
        "Credit Guarantee Fund coverage NOT viable until cheque bounces are explained and cleared"
      ],
      recommendedTenorMonths: 36,
      preApplicationImprovements: [
        "Explain and resolve the 3 cheque bounces. Maintain zero returns for the next 90 days to reset credit worthiness metrics (+25% approval boost)",
        "Implement e-Invoicing to track and collect outstanding retail payments, reducing debtor days below 45",
        "File the next three GST returns exactly on or before the due date to restore regulatory compliance score"
      ],
      alternativeProducts: [
        { name: "IDBI Bill Discounting Scheme", type: "Invoice Discounting", maxAmount: 1500000, rate: "11.0%", pros: "Immediate cash advance against confirmed retail buyer invoices, bypasses cash balance constraints" },
        { name: "MUDRA Kishore Loan", type: "Working Capital", maxAmount: 500000, rate: "11.5%", pros: "Government sponsored, lower documentation burden, easier eligibility for small traders" }
      ]
    }
  },
  "siddhi-vinayak": {
    msme: {
      id: "siddhi-vinayak",
      businessName: "Siddhi Vinayak Precision Engineering LLP",
      constitution: "LLP",
      industry: "Capital Goods & Manufacturing",
      registrationDate: "2017-08-05",
      pan: "AALFS3491G",
      gstin: "27AALFS3491G1Z1",
      ownerName: "Vijay Gokhale",
      employeeCount: 24,
    },
    alternateData: {
      gst: {
        filingCompliance: 94,
        annualTurnover: 28000000, // ₹2.8 Crore
        growthRate: 15,
        gstPaid6M: 950000,
        metrics: [
          { label: "GST Filing Status", value: "94% Compliance (Good)", status: "good", trend: "stable", description: "Steady filing consistency. Only 1 filing delayed by 4 days in the past year." },
          { label: "Sales Expansion", value: "+15% Growth Rate", status: "good", trend: "up", description: "Solid order pipeline from major auto component suppliers." }
        ]
      },
      upi: {
        monthlyVolume: 450000,
        transactionCount: 210, // low count, large commercial values
        successRate: 98.1,
        peakHoursInflow: 120000,
        metrics: [
          { label: "B2B UPI Settlement", value: "₹4.5 Lakh / mo", status: "good", trend: "up", description: "Occasional large-ticket vendor UPI payments." }
        ]
      },
      bankStatement: {
        averageDailyBalance: 310000, // ₹3.1 Lakhs
        monthlyInflow: 2200000, // ₹22 Lakhs
        monthlyOutflow: 2050000,
        dscr: 1.45,
        metrics: [
          { label: "Average Daily Balance (ADB)", value: "₹3,10,000", status: "good", trend: "stable", description: "Maintains a safe operating buffer equivalent to 10 days of steel procurement." },
          { label: "Inflow-to-Outflow Ratio", value: "1.07x", status: "good", trend: "stable", description: "Profitable core manufacturing unit generating steady internal accruals." },
          { label: "Debt Service Coverage (DSCR)", value: "1.45x", status: "good", trend: "stable", description: "Comfortably exceeds the minimum banking standard of 1.25x for manufacturing firms." }
        ]
      },
      accountAggregator: {
        consentStatus: "Active",
        linkedAccountsCount: 2,
        totalSavingsBalance: 1100000,
        otherCurrentObligations: 75000,
        metrics: [
          { label: "Total Auxiliary Funds", value: "₹11,00,000", status: "good", trend: "stable", description: "Co-partner current accounts verified, showing external reserves." },
          { label: "Leverage Ratio", value: "3.4%", status: "good", trend: "stable", description: "Healthy leverage. No excessive unhedged credit exposures." }
        ]
      },
      epfo: {
        activeEmployees: 22,
        employerContributionMonthly: 66000,
        complianceStatus: "Compliant",
        metrics: [
          { label: "EPF Payroll Compliance", value: "100% Timely Payments", status: "excellent", trend: "stable", description: "Consistently paid on the 10th of every month, confirming stable employment metrics." }
        ]
      },
      invoices: {
        totalReceivables: 4500000, // ₹45 Lakhs - heavy manufacturing capital lock
        totalPayables: 2900000,
        debtorDays: 48, // Industry typical is 45-60
        creditorDays: 52,
        collectionEfficiency: 88.5,
        metrics: [
          { label: "Debtor Days", value: "48 Days", status: "good", trend: "down", description: "Aligned with automotive sector payment cycles." },
          { label: "Invoice Delinquency Rate", value: "3.1%", status: "good", trend: "stable", description: "Low overdue bills. Stable automotive buyers ensure high realization." }
        ]
      }
    },
    healthCard: {
      overallScore: 81,
      liquidityScore: 76,
      growthScore: 85,
      cashflowStability: 82,
      businessStability: 79,
      creditworthiness: 80,
      financialDiscipline: 84,
      riskScore: 22, // Medium-Low Risk
      confidenceScore: 95,
    },
    explanations: [
      { id: "e9", metric: "Stable Order Flow", impact: "positive", scoreChange: 6, message: "15% YoY sales growth driven by verified automotive contracts provides high business stability.", source: "GST" },
      { id: "e10", metric: "EPF Validation", impact: "positive", scoreChange: 5, message: "Regular salary payments and EPFO registration of 22 technicians verify robust operational presence.", source: "EPFO" },
      { id: "e11", metric: "DSCR Buffer", impact: "positive", scoreChange: 4, message: "DSCR of 1.45x indicates comfortable capacity to take on machinery loans up to ₹30 Lakhs.", source: "Bank" },
      { id: "e12", metric: "Capital Lockup", impact: "negative", scoreChange: -3, message: "Receivables lockup of 48 debtor days limits immediate liquidity index.", source: "Invoices" }
    ],
    forecasts: [
      { month: "Jul 26", revenue: 2300000, cashflow: 180000, riskIndex: 24, repaymentAbility: 82 },
      { month: "Aug 26", revenue: 2400000, cashflow: 195000, riskIndex: 23, repaymentAbility: 84 },
      { month: "Sep 26", revenue: 2450000, cashflow: 190000, riskIndex: 23, repaymentAbility: 84 },
      { month: "Oct 26", revenue: 2600000, cashflow: 230000, riskIndex: 20, repaymentAbility: 87 },
      { month: "Nov 26", revenue: 2750000, cashflow: 260000, riskIndex: 18, repaymentAbility: 90 },
      { month: "Dec 26", revenue: 2900000, cashflow: 310000, riskIndex: 16, repaymentAbility: 93 },
    ],
    loanRecommendation: {
      safeLoanAmount: 3200000, // ₹32 Lakhs
      expectedEMI: 71000,
      interestRateRange: "9.25% - 10.25% p.a.",
      approvalProbability: 86,
      collateralSuggestions: [
        "First hypothecation charge over the specific CNC machining unit being purchased",
        "Unsecured coverage through CGTMSE is highly recommended"
      ],
      recommendedTenorMonths: 48,
      preApplicationImprovements: [
        "Reduce invoice debtor days from 48 to 40 days by leveraging immediate payment discounts with auto tier-1 buyers",
        "Set up an ESCROW current account linked to the core buyer payments to automatically trigger direct debt sweeps, potentially cutting ROI by 0.50%"
      ],
      alternativeProducts: [
        { name: "IDBI Standby Line of Credit for MSMEs", type: "Working Capital", maxAmount: 2000000, rate: "9.50%", pros: "Immediate seasonal liquidity release, easy drawdowns" },
        { name: "IDBI Equipment & Machinery Finance", type: "Machinery Loan", maxAmount: 10000000, rate: "9.25%", pros: "Specifically tailored for capital manufacturing expansion, up to 7-year tenure" }
      ]
    }
  }
};

export const PORTFOLIO_INSIGHTS: PortfolioInsight = {
  totalAUM: 248500000, // ₹24.8 Crore
  activeDigitalTwins: 124,
  avgHealthScore: 78.4,
  highRiskPercentage: 14.5,
  topOpportunities: [
    { id: "ananya-foods", businessName: "Ananya Food Processing Pvt Ltd", industry: "Agro & Food Processing", healthScore: 92, recommendedProduct: "MSME Expansion Loan", amountRecommended: 6500000, growthTrend: "+24% YoY" },
    { id: "siddhi-vinayak", businessName: "Siddhi Vinayak Precision Engineering LLP", industry: "Capital Goods & Manufacturing", healthScore: 81, recommendedProduct: "Equipment & Machinery Finance", amountRecommended: 3200000, growthTrend: "+15% YoY" },
    { id: "radha-agro", businessName: "Radha Dairy & Farm Products", industry: "Dairy & Livestock", healthScore: 86, recommendedProduct: "Working Capital CC Limit", amountRecommended: 4500000, growthTrend: "+18% YoY" },
    { id: "galaxy-labs", businessName: "Galaxy Pharmaceutical Labs", industry: "Healthcare & Pharma", healthScore: 88, recommendedProduct: "IDBI Export Line of Credit", amountRecommended: 8000000, growthTrend: "+21% YoY" }
  ],
  highRiskWatchlist: [
    { id: "om-shanti", businessName: "Om Shanti Garments & Textiles", industry: "Apparel & Fashion Retail", healthScore: 54, riskReason: "3 Cheque Returns in last 180 Days, declining UPI settlements", cashflowDrop: -18, dscr: 0.85 },
    { id: "laxmi-cement", businessName: "Laxmi Brick & Cement Trading", industry: "Construction Materials", healthScore: 58, riskReason: "EPF payments delayed 3 consecutive months, steep debtor days escalation", cashflowDrop: -12, dscr: 1.02 },
    { id: "kartik-logistics", businessName: "Kartik Transport & Roadlines", industry: "Logistics & Transport", healthScore: 61, riskReason: "Unfiled GSTR-1 for 2 consecutive cycles, severe operating cash deficit", cashflowDrop: -22, dscr: 1.11 }
  ],
  sectorDistribution: [
    { sector: "Agro & Food Processing", value: 32 },
    { sector: "Capital Goods", value: 25 },
    { sector: "Retail & Apparel", value: 18 },
    { sector: "Services & Logistics", value: 15 },
    { sector: "Pharma & Chemical", value: 10 }
  ]
};

// High-quality MSME Knowledge base to drive robust, accurate local RAG responses
export const KNOWLEDGE_BASE = [
  {
    title: "CGTMSE Scheme (Credit Guarantee Fund Trust for Micro and Small Enterprises)",
    category: "Government Schemes",
    content: "The Credit Guarantee Scheme (CGS) was launched to make collateral-free credit available to Micro and Small Enterprises (MSEs). Both manufacturing and service enterprises are eligible. The maximum credit facility covered is ₹500 Lakhs (₹5 Crore). Guarantee coverage ranges from 75% to 85% of the loan amount depending on the loan category. For micro enterprises up to ₹5 Lakh, guarantee coverage is up to 85%. For women-owned enterprises or those located in NER, the guarantee coverage is up to 85%. No third-party guarantee or collateral is required."
  },
  {
    title: "MUDRA Loan Scheme (Pradhan Mantri MUDRA Yojana)",
    category: "Government Schemes",
    content: "MUDRA scheme offers loans up to ₹10 Lakhs to non-corporate, non-farm small/micro enterprises. Divided into three categories: Shishu (loans up to ₹50,000), Kishore (loans above ₹50,000 and up to ₹5 Lakhs), and Tarun (loans above ₹5 Lakhs and up to ₹10 Lakhs). No collateral is required. Interest rates depend on the banking guidelines, typically ranging between 9% and 12%. Suitable for retail stores, repair shops, small manufacturing units, and service operators."
  },
  {
    title: "IDBI Bank MSME Easy Working Capital (EWC)",
    category: "Banking Products",
    content: "Tailored working capital product from IDBI Bank to meet short-term funding gaps for manufacturing and service MSMEs. Offers cash credit or overdraft limits based on the turnover model or inventory evaluation. Minimum limit of ₹10 Lakhs, maximum limit of ₹500 Lakhs (₹5 Crore). Eligibility: Business must have at least 3 years of audited financials or 2 years of consistent GST returns. Interest rate is pegged to the Bank's Repo Linked Lending Rate (RLLR), typically ranging from 8.50% to 11.00% depending on the TwinFin Digital Twin Health Score."
  },
  {
    title: "GST Compliance & Credit Rating Impact",
    category: "Compliance & Regulations",
    content: "GST compliance is a critical parameter in alternate credit assessment. Filing GSTR-1 (monthly details of outward supplies) and GSTR-3B (monthly summary return and tax payment) on or before the 20th of the following month is crucial. Delayed filing incurs a late fee of ₹50/day (₹20/day for Nil returns) and triggers score reduction. Banks view regular filing as a proxy for operational stability. A compliance score below 85% usually triggers a 0.5% to 1.5% interest premium or requires additional hard collateral."
  },
  {
    title: "Debt Service Coverage Ratio (DSCR) Standards",
    category: "Credit Decisions",
    content: "The Debt Service Coverage Ratio (DSCR) is a key metric evaluated by credit officers. DSCR = (Net Operating Income) / (Total Debt Service obligations like EMIs and Interest). Banking standards require a minimum DSCR of 1.25x for secured manufacturing loans and 1.50x for unsecured service MSME loans. A DSCR below 1.00x indicates that the business is not generating enough cash to cover its debt commitments, resulting in immediate loan rejection unless strong alternate inflows (e.g., highly stable UPI daily settlement) are verified."
  },
  {
    title: "Standby Line of Credit (SLC) for MSMEs",
    category: "Banking Products",
    content: "A standby line of credit provides a pre-approved liquidity buffer for MSMEs to handle sudden purchase orders, tax liabilities, or seasonal stock accumulation. Maximum limit is 10% of the existing regular working capital limit or ₹50 Lakhs, whichever is lower. Easy, prompt drawdowns with minimal documentation. Typically priced at 0.5% lower than standard cash credit accounts to support immediate cash flow requirements."
  }
];
