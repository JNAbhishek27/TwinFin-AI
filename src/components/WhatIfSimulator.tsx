/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sliders, RefreshCw, Sparkles, AlertTriangle, Play, HelpCircle, CheckCircle2 } from "lucide-react";

interface WhatIfSimulatorProps {
  twinId: string;
  onSimulationRun: (result: {
    simulatedHealthCard: any;
    simulatedForecasts: any;
    simulatedLoanRecommendation: any;
    report: any;
  }) => void;
  onReset: () => void;
  isSimulating: boolean;
}

export default function WhatIfSimulator({ twinId, onSimulationRun, onReset, isSimulating }: WhatIfSimulatorProps) {
  const [revenueDrop, setRevenueDrop] = useState(0);
  const [newEmployees, setNewEmployees] = useState(0);
  const [loanRequested, setLoanRequested] = useState(0);
  const [gstIncrease, setGstIncrease] = useState(0);
  const [loading, setLoading] = useState(false);
  const [simulationReport, setSimulationReport] = useState<any | null>(null);

  const formatLakhs = (value: number) => {
    if (value === 0) return "₹0";
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
    return `₹${(value / 100000).toFixed(1)} Lakh`;
  };

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          twinId,
          revenueDropPercent: revenueDrop,
          newEmployees,
          newLoanAmount: loanRequested,
          gstRateIncreasePercent: gstIncrease,
        }),
      });

      if (!response.ok) {
        throw new Error("Simulation endpoint failed");
      }

      const result = await response.json();
      setSimulationReport(result.report);
      onSimulationRun(result);
    } catch (error) {
      console.error("Simulation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetLocal = () => {
    setRevenueDrop(0);
    setNewEmployees(0);
    setLoanRequested(0);
    setGstIncrease(0);
    setSimulationReport(null);
    onReset();
  };

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950">
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-5 relative z-10">
        <h3 className="font-sans font-bold text-sm text-neutral-100 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-cyan-400" />
          Predictive "What-If" Credit Simulator
        </h3>
        <button
          onClick={handleResetLocal}
          className="text-neutral-500 hover:text-neutral-300 transition-all"
          title="Reset sliders"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Sliders Control Panel (5 columns) */}
        <div className="xl:col-span-5 space-y-4">
          {/* Revenue Sliders */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400 font-sans">Simulate Sales Contraction</span>
              <span className="font-mono text-rose-400 font-bold">-{revenueDrop}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={revenueDrop}
              onChange={(e) => setRevenueDrop(Number(e.target.value))}
              className="w-full accent-cyan-400 h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-[10px] text-neutral-500 font-sans">Adjusts active monthly bank inflows and GST turnover.</p>
          </div>

          {/* Hiring Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400 font-sans">Hire New Full-Time Staff</span>
              <span className="font-mono text-cyan-400 font-bold">+{newEmployees} employees</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={newEmployees}
              onChange={(e) => setNewEmployees(Number(e.target.value))}
              className="w-full accent-cyan-400 h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-[10px] text-neutral-500 font-sans">Increases EPFO payroll outflow liability by ₹30k/mo each.</p>
          </div>

          {/* New Debt slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400 font-sans">Simulate Additional Debt Loan</span>
              <span className="font-mono text-indigo-400 font-bold">{formatLakhs(loanRequested)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10000000"
              step="500000"
              value={loanRequested}
              onChange={(e) => setLoanRequested(Number(e.target.value))}
              className="w-full accent-indigo-400 h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-[10px] text-neutral-500 font-sans">Computes monthly debt services EMI, reducing balance coverage.</p>
          </div>

          {/* GST tax rate change */}
          <div className="space-y-1.5">
            <span className="text-neutral-400 text-xs font-sans block">GST Tax Rate Revision</span>
            <div className="flex gap-2">
              {[0, 3, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => setGstIncrease(val)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium font-mono border transition-all ${
                    gstIncrease === val
                      ? "bg-neutral-800 text-cyan-400 border-neutral-700 shadow-sm"
                      : "bg-neutral-900/40 text-neutral-500 border-neutral-900 hover:text-neutral-300"
                  }`}
                >
                  +{val}%
                </button>
              ))}
            </div>
          </div>

          {/* Action Trigger */}
          <button
            onClick={handleSimulate}
            disabled={loading}
            className={`w-full py-2.5 rounded-xl text-xs font-bold font-sans flex items-center justify-center gap-2 border transition-all cursor-pointer ${
              loading
                ? "bg-neutral-900 border-neutral-800 text-neutral-600 cursor-not-allowed"
                : "bg-cyan-500 text-neutral-950 hover:bg-cyan-400 border-cyan-400/20 font-bold shadow-[0_0_15px_rgba(6,182,212,0.15)]"
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Simulating twin state...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate Twin Projections</span>
              </>
            )}
          </button>
        </div>

        {/* Explainable AI Simulation Report Output (7 columns) */}
        <div className="xl:col-span-7 bg-neutral-900/30 border border-neutral-900 rounded-xl p-4 flex flex-col justify-between min-h-[220px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-3 py-6">
              <div className="w-8 h-8 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin"></div>
              <p className="text-xs text-neutral-400 font-sans text-center">
                Consulting Explainable AI Decision Models...
                <span className="block text-[10px] text-neutral-500 font-mono mt-1">Evaluating cashflows, EPFO & bank limits</span>
              </p>
            </div>
          ) : simulationReport ? (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-200">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>AI Credit Officer Simulation Report</span>
              </div>

              {/* Executive Summary */}
              <p className="text-xs text-neutral-300 leading-relaxed font-sans bg-neutral-950/40 p-3 rounded-lg border border-neutral-900">
                {simulationReport.summary}
              </p>

              {/* Vector Explanations */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Score Vector Shifts</span>
                {simulationReport.bulletPoints.map((point: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-neutral-400 leading-relaxed">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0"></div>
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {/* Recommended Mitigation Actions */}
              {simulationReport.mitigationActions && (
                <div className="space-y-2 pt-2 border-t border-neutral-900/60">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Recommended RM Mitigation Guidance</span>
                  {simulationReport.mitigationActions.map((act: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300 leading-relaxed bg-cyan-500/5 border border-cyan-500/10 p-2.5 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-6 px-4">
              <Sparkles className="w-8 h-8 text-neutral-700 mb-2" />
              <h4 className="text-xs font-bold text-neutral-400">Simulation Engine Idle</h4>
              <p className="text-[11px] text-neutral-500 mt-1 max-w-[280px]">
                Drag the parameters on the left to simulate operational contractions, hires, or debt injections. The digital twin will rebuild dynamically.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
