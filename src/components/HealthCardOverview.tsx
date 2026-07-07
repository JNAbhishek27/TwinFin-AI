/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { FinancialHealthCard, ExplanationNode } from "../types";
import { ShieldCheck, TrendingUp, HelpCircle, Eye, ChevronRight, Activity, AlertTriangle, AlertCircle, FileText, CheckCircle2 } from "lucide-react";

interface HealthCardOverviewProps {
  healthCard: FinancialHealthCard;
  explanations: ExplanationNode[];
}

export default function HealthCardOverview({ healthCard, explanations }: HealthCardOverviewProps) {
  // Determine score color classes
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-400";
    if (score >= 70) return "text-teal-400";
    if (score >= 50) return "text-amber-400";
    return "text-rose-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return "Excellent (A+)";
    if (score >= 70) return "Good (A)";
    if (score >= 50) return "Fair (B)";
    return "Critical / Alert (C)";
  };

  // Circular gauge calculations
  const radius = 55;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (healthCard.overallScore / 100) * circumference;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 1. Main Overall Score Gauge Card (5 columns) */}
      <div className="lg:col-span-5 bg-neutral-950 border border-neutral-800 rounded-2xl p-6 flex flex-col items-center justify-between shadow-xl relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
        <div className="w-full flex items-center justify-between border-b border-neutral-900 pb-3 relative z-10">
          <h3 className="font-sans font-bold text-sm text-neutral-100 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Credit Decision health
          </h3>
          <span className="bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-400 font-mono px-2 py-0.5 rounded-full">
            REAL-TIME
          </span>
        </div>

        {/* Circular SVG Gauge */}
        <div className="relative flex items-center justify-center my-6">
          <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
            {/* Background Track */}
            <circle
              stroke="#262626"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Foreground Fill with Glow */}
            <circle
              stroke={healthCard.overallScore >= 80 ? "#10b981" : healthCard.overallScore >= 60 ? "#d97706" : "#f43f5e"}
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + " " + circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center text-center">
            <span className="text-3xl md:text-4xl font-extrabold font-mono text-neutral-500 tracking-tighter">
              <span className="text-neutral-100">{healthCard.overallScore}</span>
              <span className="text-xs font-normal text-neutral-500">/100</span>
            </span>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mt-1">
              Health Score
            </span>
          </div>
        </div>

        {/* Rating description */}
        <div className="text-center w-full px-4 py-2.5 bg-neutral-900/50 rounded-xl border border-neutral-900">
          <span className="text-xs text-neutral-400 font-sans block">Decision Intelligence Rating</span>
          <span className={`text-sm font-bold tracking-tight mt-0.5 block ${getScoreColor(healthCard.overallScore)}`}>
            {getScoreLabel(healthCard.overallScore)}
          </span>
        </div>

        {/* Key Indicators Matrix (Liquidity vs Risk) */}
        <div className="grid grid-cols-2 gap-3 w-full mt-4 pt-3 border-t border-neutral-900 text-xs">
          <div className="bg-neutral-900/30 p-2.5 rounded-xl border border-neutral-900">
            <span className="text-neutral-500 text-[10px] uppercase font-mono block">AI Confidence</span>
            <span className="text-sm font-bold text-neutral-200 mt-1 block font-mono">{healthCard.confidenceScore}%</span>
          </div>
          <div className="bg-neutral-900/30 p-2.5 rounded-xl border border-neutral-900">
            <span className="text-neutral-500 text-[10px] uppercase font-mono block">Portfolio Risk</span>
            <span className={`text-sm font-bold mt-1 block font-mono ${healthCard.riskScore > 50 ? "text-rose-400" : "text-emerald-400"}`}>
              {healthCard.riskScore}% ({healthCard.riskScore > 50 ? "High" : "Low"})
            </span>
          </div>
        </div>
      </div>

      {/* 2. Detailed Credit Vectors Sub-scores Grid (7 columns) */}
      <div className="lg:col-span-7 flex flex-col justify-between gap-4">
        {/* Sub-scores Grid */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 shadow-xl flex-1 relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
          <h4 className="font-sans font-bold text-sm text-neutral-100 mb-4 border-b border-neutral-900 pb-2 relative z-10 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-cyan-400" />
            Alternate Decision Vectors
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {/* Liquidity */}
            <div className="bg-neutral-900/40 border border-neutral-900 p-3 rounded-xl hover:border-neutral-800 transition-all">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">Liquidity Index</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-base font-bold text-neutral-200 font-mono">{healthCard.liquidityScore}</span>
                <span className="text-[10px] text-neutral-500">/100</span>
              </div>
              <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-sky-400 h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: `${healthCard.liquidityScore}%` }}
                ></div>
              </div>
            </div>

            {/* Growth */}
            <div className="bg-neutral-900/40 border border-neutral-900 p-3 rounded-xl hover:border-neutral-800 transition-all">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">Growth Vector</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-base font-bold text-neutral-200 font-mono">{healthCard.growthScore}</span>
                <span className="text-[10px] text-neutral-500">/100</span>
              </div>
              <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-emerald-400 h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: `${healthCard.growthScore}%` }}
                ></div>
              </div>
            </div>

            {/* Cashflow Stability */}
            <div className="bg-neutral-900/40 border border-neutral-900 p-3 rounded-xl hover:border-neutral-800 transition-all">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">CF Stability</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-base font-bold text-neutral-200 font-mono">{healthCard.cashflowStability}</span>
                <span className="text-[10px] text-neutral-500">/100</span>
              </div>
              <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-purple-400 h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: `${healthCard.cashflowStability}%` }}
                ></div>
              </div>
            </div>

            {/* Business Stability */}
            <div className="bg-neutral-900/40 border border-neutral-900 p-3 rounded-xl hover:border-neutral-800 transition-all">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">Biz Resilience</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-base font-bold text-neutral-200 font-mono">{healthCard.businessStability}</span>
                <span className="text-[10px] text-neutral-500">/100</span>
              </div>
              <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-teal-400 h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: `${healthCard.businessStability}%` }}
                ></div>
              </div>
            </div>

            {/* Creditworthiness */}
            <div className="bg-neutral-900/40 border border-neutral-900 p-3 rounded-xl hover:border-neutral-800 transition-all">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">Credit Standing</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-base font-bold text-neutral-200 font-mono">{healthCard.creditworthiness}</span>
                <span className="text-[10px] text-neutral-500">/100</span>
              </div>
              <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-indigo-400 h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: `${healthCard.creditworthiness}%` }}
                ></div>
              </div>
            </div>

            {/* Financial Discipline */}
            <div className="bg-neutral-900/40 border border-neutral-900 p-3 rounded-xl hover:border-neutral-800 transition-all">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">Fin Discipline</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-base font-bold text-neutral-200 font-mono">{healthCard.financialDiscipline}</span>
                <span className="text-[10px] text-neutral-500">/100</span>
              </div>
              <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-amber-400 h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: `${healthCard.financialDiscipline}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Explainable AI Attribution List */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 shadow-xl flex-1 mt-2 relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between border-b border-neutral-900 pb-2 mb-3 relative z-10">
            <h4 className="font-sans font-bold text-sm text-neutral-100 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-cyan-400" />
              Explainable AI Attribution Model
            </h4>
            <span className="text-[10px] text-neutral-500 font-mono uppercase">Decision Nodes</span>
          </div>

          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 no-scrollbar">
            {explanations.map((exp) => (
              <div
                key={exp.id}
                className="bg-neutral-900/45 hover:bg-neutral-900/85 border border-neutral-900 hover:border-neutral-800 p-3 rounded-xl flex items-start justify-between gap-3 transition-all"
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">
                    {exp.impact === "positive" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400 animate-pulse" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-200">{exp.metric}</span>
                      <span className="bg-neutral-800 text-[9px] font-mono text-neutral-400 px-1.5 py-0.2 rounded border border-neutral-700">
                        {exp.source}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">{exp.message}</p>
                  </div>
                </div>
                <div className={`text-xs font-mono font-bold shrink-0 ${exp.impact === "positive" ? "text-emerald-400" : "text-rose-400"}`}>
                  {exp.scoreChange > 0 ? `+${exp.scoreChange}` : exp.scoreChange} pts
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
