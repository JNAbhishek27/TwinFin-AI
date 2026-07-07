/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MSMEProfile {
  id: string;
  businessName: string;
  constitution: "Proprietorship" | "Partnership" | "Pvt Ltd" | "LLP";
  industry: string;
  registrationDate: string;
  pan: string;
  gstin: string;
  ownerName: string;
  employeeCount: number;
}

export interface AlternateDataMetric {
  label: string;
  value: string | number;
  status: "excellent" | "good" | "fair" | "critical";
  trend: "up" | "down" | "stable";
  description: string;
}

export interface AlternateDataSummary {
  gst: {
    filingCompliance: number; // % of on-time filings (e.g. 96)
    annualTurnover: number; // in INR
    growthRate: number; // % YoY
    gstPaid6M: number; // in INR
    metrics: AlternateDataMetric[];
  };
  upi: {
    monthlyVolume: number; // in INR
    transactionCount: number;
    successRate: number; // %
    peakHoursInflow: number; // in INR
    metrics: AlternateDataMetric[];
  };
  bankStatement: {
    averageDailyBalance: number; // in INR
    monthlyInflow: number; // in INR
    monthlyOutflow: number; // in INR
    dscr: number; // Debt Service Coverage Ratio (e.g. 1.8)
    metrics: AlternateDataMetric[];
  };
  accountAggregator: {
    consentStatus: string;
    linkedAccountsCount: number;
    totalSavingsBalance: number; // in INR
    otherCurrentObligations: number; // in INR (total active EMIs)
    metrics: AlternateDataMetric[];
  };
  epfo: {
    activeEmployees: number;
    employerContributionMonthly: number; // in INR
    complianceStatus: "Compliant" | "Delayed" | "Non-compliant";
    metrics: AlternateDataMetric[];
  };
  invoices: {
    totalReceivables: number; // in INR
    totalPayables: number; // in INR
    debtorDays: number; // Days to collect cash
    creditorDays: number; // Days to pay vendors
    collectionEfficiency: number; // %
    metrics: AlternateDataMetric[];
  };
}

export interface FinancialHealthCard {
  overallScore: number; // 0-100
  liquidityScore: number; // 0-100
  growthScore: number; // 0-100
  cashflowStability: number; // 0-100
  businessStability: number; // 0-100
  creditworthiness: number; // 0-100
  financialDiscipline: number; // 0-100
  riskScore: number; // 0-100 (lower is better, or represented as high/medium/low)
  confidenceScore: number; // 0-100 (AI data confidence)
}

export interface ExplanationNode {
  id: string;
  metric: string;
  impact: "positive" | "negative" | "neutral";
  scoreChange: number; // e.g. -5 or +8
  message: string;
  source: "GST" | "UPI" | "Bank" | "EPFO" | "Invoices" | "Credit";
}

export interface ForecastPoint {
  month: string; // e.g. "Jul 26"
  revenue: number;
  cashflow: number;
  riskIndex: number; // 0-100
  repaymentAbility: number; // 0-100
}

export interface LoanRecommendation {
  safeLoanAmount: number; // in INR
  expectedEMI: number; // in INR
  interestRateRange: string; // e.g. "9.5% - 11.2%"
  approvalProbability: number; // % (0-100)
  collateralSuggestions: string[];
  recommendedTenorMonths: number;
  preApplicationImprovements: string[];
  alternativeProducts: {
    name: string;
    type: "Working Capital" | "Machinery Loan" | "Invoice Discounting" | "MSME Term Loan";
    maxAmount: number;
    rate: string;
    pros: string;
  }[];
}

export interface DigitalTwinState {
  msme: MSMEProfile;
  alternateData: AlternateDataSummary;
  healthCard: FinancialHealthCard;
  explanations: ExplanationNode[];
  forecasts: ForecastPoint[];
  loanRecommendation: LoanRecommendation;
}

export interface WhatIfInput {
  revenueDropPercent: number; // 0 to 100
  newEmployees: number; // 0+
  newLoanAmount: number; // in INR
  gstRateIncreasePercent: number; // e.g. 0, 3, 5
}

export interface SimulationResult {
  simulatedHealthCard: FinancialHealthCard;
  simulatedExplanations: string[];
  simulatedForecasts: ForecastPoint[];
  simulatedLoanRecommendation: {
    safeAmount: number;
    approvalProbability: number;
    emi: number;
  };
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  suggestedPrompts?: string[];
}

export interface OCRResult {
  documentType: "GST" | "BankStatement" | "Invoice";
  fileName: string;
  extractedData: {
    businessName?: string;
    pan?: string;
    gstin?: string;
    invoiceAmount?: number;
    turnover?: number;
    avgDailyBalance?: number;
    employerEPFContrib?: number;
    date?: string;
    confidence: number;
  };
  logSummary: string;
}

export interface PortfolioInsight {
  totalAUM: number;
  activeDigitalTwins: number;
  avgHealthScore: number;
  highRiskPercentage: number;
  topOpportunities: {
    id: string;
    businessName: string;
    industry: string;
    healthScore: number;
    recommendedProduct: string;
    amountRecommended: number;
    growthTrend: string;
  }[];
  highRiskWatchlist: {
    id: string;
    businessName: string;
    industry: string;
    healthScore: number;
    riskReason: string;
    cashflowDrop: number;
    dscr: number;
  }[];
  sectorDistribution: { sector: string; value: number }[];
}
