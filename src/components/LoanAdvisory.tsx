/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { LoanRecommendation } from "../types";
import { Award, ShieldAlert, CheckCircle, Percent, Calendar, Heart, Shield, Landmark, ChevronRight, X, Sparkles, Clock, Check, FileText } from "lucide-react";

interface LoanAdvisoryProps {
  loanRec: LoanRecommendation;
  overallScore: number;
}

export default function LoanAdvisory({ loanRec, overallScore }: LoanAdvisoryProps) {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [applyStep, setApplyStep] = useState<"idle" | "processing" | "success">("idle");
  const [currentLog, setCurrentLog] = useState<string>("");
  const [completedLogs, setCompletedLogs] = useState<string[]>([]);

  const startApplicationWorkflow = () => {
    if (!selectedProduct) return;
    setApplyStep("processing");
    setCompletedLogs([]);
    setCurrentLog("Initiating zero-knowledge credit verification sequence...");

    const steps = [
      { log: "Accessing secure Account Aggregator consent token...", delay: 600 },
      { log: "Verifying dynamic GSTIN filing compliance history (GSTR-3B)...", delay: 1300 },
      { log: "Analyzing UPI inward settlement velocity & daily balance consistency...", delay: 2000 },
      { log: "Encrypting MSME Digital Twin pre-vetted payload (AES-256)...", delay: 2700 },
      { log: "Dispatched direct API dispatch package to IDBI Central Credit Hub...", delay: 3400 }
    ];

    steps.forEach((s, idx) => {
      setTimeout(() => {
        setCompletedLogs(prev => [...prev, s.log]);
        if (idx === steps.length - 1) {
          setTimeout(() => {
            setApplyStep("success");
            setCurrentLog("");
          }, 600);
        } else {
          setCurrentLog(steps[idx + 1].log);
        }
      }, s.delay);
    });
  };

  const getProbabilityColor = (prob: number) => {
    if (prob >= 85) return "text-emerald-400";
    if (prob >= 60) return "text-amber-400";
    return "text-rose-400";
  };

  const getProbabilityBg = (prob: number) => {
    if (prob >= 85) return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
    if (prob >= 60) return "bg-amber-500/10 border-amber-500/20 text-amber-400";
    return "bg-rose-500/10 border-rose-500/20 text-rose-400";
  };

  const formatRupees = (val: number) => {
    return `₹${(val / 100000).toFixed(1)} Lakh`;
  };

  const formatRupeesFull = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Crore`;
    }
    return `₹${val.toLocaleString("en-IN")}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
      {/* 1. Main Recommended Borrowing Card (7 columns) */}
      <div className="lg:col-span-7 bg-neutral-950 border border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
        <div className="border-b border-neutral-900 pb-3 mb-4 flex items-center justify-between relative z-10">
          <div>
            <h3 className="font-sans font-bold text-sm text-neutral-100 flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-cyan-400" />
              IDBI Predictive MSME Loan Recommendation
            </h3>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Pre-approved credit limits computed dynamically using continuous behavioral twin data.
            </p>
          </div>
        </div>

        {/* Big recommended amount display */}
        <div className="my-3 py-4 bg-neutral-900/40 border border-neutral-900 rounded-2xl text-center px-4 relative z-10">
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">Safe Lending Limit</span>
          <h2 className="text-2xl md:text-3xl font-extrabold font-sans text-cyan-400 tracking-tight mt-1">
            {formatRupeesFull(loanRec.safeLoanAmount)}
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-neutral-400 mt-3 border-t border-neutral-800/60 pt-2.5 font-mono">
            <div>
              <span className="text-neutral-500">Interest:</span>{" "}
              <span className="text-neutral-200 font-bold">{loanRec.interestRateRange}</span>
            </div>
            <div className="text-neutral-700">|</div>
            <div>
              <span className="text-neutral-500">Estimated EMI:</span>{" "}
              <span className="text-neutral-200 font-bold">₹{loanRec.expectedEMI.toLocaleString("en-IN")}/mo</span>
            </div>
            <div className="text-neutral-700">|</div>
            <div>
              <span className="text-neutral-500">Tenor:</span>{" "}
              <span className="text-neutral-200 font-bold">{loanRec.recommendedTenorMonths} Mo</span>
            </div>
          </div>
        </div>

        {/* Matrix indicators: Approval % & Collateral */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {/* Approval Rate */}
          <div className="bg-neutral-900/20 p-4 rounded-xl border border-neutral-900 flex flex-col justify-between relative z-10">
            <div>
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">Approval Probability</span>
              <span className={`text-xl font-extrabold font-mono mt-1.5 block ${getProbabilityColor(loanRec.approvalProbability)}`}>
                {loanRec.approvalProbability}%
              </span>
            </div>
            <span className={`text-[10px] px-2.5 py-1 rounded-full mt-3 inline-block font-sans text-center font-semibold border ${getProbabilityBg(loanRec.approvalProbability)}`}>
              {loanRec.approvalProbability >= 85 ? "High Approval Probability" : loanRec.approvalProbability >= 50 ? "Moderate Approval" : "High Risk of Rejection"}
            </span>
          </div>

          {/* Collateral structure */}
          <div className="bg-neutral-900/20 p-4 rounded-xl border border-neutral-900 relative z-10">
            <span className="text-[10px] font-mono text-neutral-500 uppercase block">Collateral Guidelines</span>
            <div className="space-y-1.5 mt-2 max-h-[110px] overflow-y-auto pr-1 no-scrollbar">
              {loanRec.collateralSuggestions.map((col, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-[11px] text-neutral-400 leading-relaxed">
                  <div className="h-1 w-1 rounded-full bg-indigo-400 mt-1.5 shrink-0"></div>
                  <span>{col}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Custom Score Improvement Advisories (5 columns) */}
      <div className="lg:col-span-5 bg-neutral-950 border border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <div className="border-b border-neutral-900 pb-3 mb-4">
              <h3 className="font-sans font-bold text-sm text-neutral-100 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-purple-400 animate-pulse" />
                Pre-Application Improvement Roadmaps
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Actionable credit hygiene tasks to enhance approval probabilities and unlock cheaper interest tiers.
              </p>
            </div>

            <div className="space-y-2.5">
              {loanRec.preApplicationImprovements.map((imp, idx) => (
                <div
                  key={idx}
                  className="bg-neutral-900/40 hover:bg-neutral-900/80 border border-neutral-900 p-3 rounded-xl flex items-start gap-2.5 transition-all"
                >
                  <div className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 h-5 w-5 rounded-full flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">{imp}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual incentive tag */}
          <div className="bg-purple-500/5 p-3 rounded-xl border border-purple-500/10 text-[11px] text-purple-300 mt-4 leading-relaxed flex items-start gap-2 relative z-10">
            <Shield className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span>Completing the listed tasks can boost score up to <span className="font-bold">+12 points</span>, cutting ROI rate by up to <span className="font-bold">0.75%</span>.</span>
          </div>
        </div>
      </div>

      {/* 3. Alternative Banking Products (12 columns) */}
      <div className="lg:col-span-12 bg-neutral-950 border border-neutral-800 rounded-2xl p-5 shadow-xl relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <h4 className="font-sans font-bold text-xs text-neutral-100 mb-3 uppercase tracking-wider font-mono">
            Alternate IDBI Bank FinTech Products
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loanRec.alternativeProducts.map((prod, idx) => (
              <div
                key={idx}
                className="bg-neutral-900/35 border border-neutral-900 hover:border-neutral-800 p-4 rounded-xl flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-200">{prod.name}</span>
                    <span className="bg-neutral-800 text-[10px] text-neutral-400 px-2 py-0.5 rounded-full font-mono border border-neutral-700">
                      {prod.type}
                    </span>
                  </div>
                  <div className="text-sm font-mono font-bold text-cyan-400 mt-2">
                    Up to {formatRupeesFull(prod.maxAmount)} @ {prod.rate} ROI
                  </div>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                    <span className="text-neutral-500 font-sans block">Highlight Advantage:</span> {prod.pros}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center justify-between text-xs">
                  <span className="text-neutral-500">Processing: ~24 Hours</span>
                  <button
                    onClick={() => {
                      setSelectedProduct(prod);
                      setApplyStep("idle");
                      setCompletedLogs([]);
                      setCurrentLog("");
                    }}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 font-bold cursor-pointer bg-transparent border-none outline-none"
                  >
                    Learn More <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl max-w-lg w-full shadow-2xl relative overflow-hidden bg-gradient-to-b from-neutral-900 to-neutral-950 text-neutral-100 p-6 space-y-5">
            <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-neutral-900 pb-4 relative z-10">
              <div className="space-y-1">
                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase">
                  {selectedProduct.type}
                </span>
                <h3 className="font-sans font-bold text-base text-neutral-100 mt-1">{selectedProduct.name}</h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-neutral-500 hover:text-neutral-300 p-1.5 bg-neutral-900/60 border border-neutral-800/60 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 relative z-10">
              <div className="grid grid-cols-2 gap-4 bg-neutral-900/40 p-3.5 rounded-xl border border-neutral-900">
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">Max Pre-Approved Limit</span>
                  <span className="text-sm font-sans font-bold text-cyan-400 block mt-0.5">
                    {formatRupeesFull(selectedProduct.maxAmount)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">Interest Rate (ROI)</span>
                  <span className="text-sm font-sans font-bold text-cyan-400 block mt-0.5">
                    {selectedProduct.rate}
                  </span>
                </div>
              </div>

              {/* Advantage */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-neutral-500 uppercase block">Prime FinTech Advantage</span>
                <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-900/20 p-3 rounded-xl border border-neutral-900/60">
                  {selectedProduct.pros}
                </p>
              </div>

              {/* Product Specifications */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-neutral-500 uppercase block">Product Parameters & Requirements</span>
                <div className="space-y-2 text-xs text-neutral-400">
                  {selectedProduct.type === "Working Capital" && (
                    <>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>Dynamic overdraft limits synced with monthly Account Aggregator banking logs.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>Interest calculated daily, billed monthly solely on utilized funds.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>Zero commitment charges on the unutilized limit.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>Renewable annually without physical documentation through digital twin re-scoring.</span>
                      </div>
                    </>
                  )}
                  {selectedProduct.type === "MSME Term Loan" && (
                    <>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>Long repayment tenure of up to 60 months with flexible balloon payment options.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>Collateral-free CGTMSE coverage up to ₹5 Crore, premium integrated into ROI.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>Interest rate pegged to IDBI Repo Linked Lending Rate (RLLR).</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>Ideal for high-value machine procurement and capacity expansion.</span>
                      </div>
                    </>
                  )}
                  {selectedProduct.type === "Invoice Discounting" && (
                    <>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>Discount bills instantly with premier blue-chip corporate buyers.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>Settle receivables in &lt; 24 hours, boosting liquidity and cash flow velocity.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>Bypasses cash balance and traditional collateral constraints.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>Direct integration with major TReDS platforms (RXIL, M1xchange).</span>
                      </div>
                    </>
                  )}
                  {selectedProduct.type === "MSME Term Loan" === false && selectedProduct.type === "Working Capital" === false && selectedProduct.type === "Invoice Discounting" === false && (
                    <>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>Fast-tracked approval cycles leveraging alternative data digital footprints.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>Direct-to-bank settlement to optimize cashflow schedules.</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Workflow Area */}
            <div className="border-t border-neutral-900 pt-4 relative z-10 space-y-3">
              {applyStep === "idle" && (
                <button
                  onClick={startApplicationWorkflow}
                  className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-cyan-400/20 shadow-md font-sans"
                >
                  <Sparkles className="w-4 h-4" />
                  Apply Instantly via Twin Consent
                </button>
              )}

              {applyStep === "processing" && (
                <div className="space-y-3 bg-neutral-950/60 border border-neutral-900 p-3.5 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
                    <Clock className="w-4 h-4 animate-spin shrink-0" />
                    <span>Processing Application...</span>
                  </div>
                  <div className="space-y-1 text-[10px] font-mono text-neutral-400">
                    {completedLogs.map((log, lIdx) => (
                      <div key={lIdx} className="flex items-center gap-1 text-neutral-300">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{log}</span>
                      </div>
                    ))}
                    {currentLog && (
                      <div className="flex items-center gap-1 text-cyan-400/80 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block mr-1"></span>
                        <span>{currentLog}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {applyStep === "success" && (
                <div className="space-y-3 bg-cyan-500/5 border border-cyan-500/20 p-4 rounded-xl text-center">
                  <div className="inline-flex bg-cyan-500/10 p-2 rounded-full border border-cyan-500/30 text-cyan-400 mx-auto">
                    <CheckCircle className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-xs text-neutral-100">Application Received!</h4>
                    <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                      IDBI digital twin pre-approved consent successfully generated! The application payload has been routed securely to our MSME processing queue (Ref ID: <span className="font-mono font-bold text-cyan-400">TWIN-WC-{Math.floor(Math.random() * 900000) + 100000}</span>).
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-[11px] font-bold rounded-lg transition-all cursor-pointer font-sans"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
