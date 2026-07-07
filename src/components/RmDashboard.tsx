/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { PortfolioInsight } from "../types";
import { PORTFOLIO_INSIGHTS } from "../data";
import {
  Users,
  ShieldAlert,
  TrendingUp,
  Percent,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Send,
  Zap,
  Clock,
  Landmark
} from "lucide-react";

export default function RmDashboard() {
  const [insights, setInsights] = useState<PortfolioInsight>(PORTFOLIO_INSIGHTS);
  const [deployedOffers, setDeployedOffers] = useState<string[]>([]);
  const [notifiedAdvisories, setNotifiedAdvisories] = useState<string[]>([]);
  const [notification, setNotification] = useState<{
    title: string;
    message: string;
    type: "success" | "warning";
  } | null>(null);

  const handleDeployOffer = (businessId: string, name: string, amount: number) => {
    setDeployedOffers((prev) => [...prev, businessId]);
    setNotification({
      title: "IDBI Proactive Credit Deployment",
      type: "success",
      message: `Successfully dispatched pre-approved loan invitation!\n\nRecipient: ${name}\nOffered Limit: ₹${(amount / 100000).toFixed(1)} Lakhs\nPegged Interest: IDBI Prime MSME Rate (~9.4%)\n\nAn automated SMS, Email, and WhatsApp notification with the secure consent link has been dispatched to the business promoter's digital twin channel.`,
    });
  };

  const handleSendAdvisory = (businessId: string, name: string, reason: string) => {
    setNotifiedAdvisories((prev) => [...prev, businessId]);
    setNotification({
      title: "IDBI Early Credit Advisory Alert",
      type: "warning",
      message: `Dispatched preventive credit health mitigation advisory!\n\nRecipient: ${name}\nTrigger Exception: ${reason}\n\nActionable steps to resolve pending return cycles, optimize EPFO filing timeliness, and clear current liabilities have been safely delivered to the MSME dashboard.`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* 1. Master Portfolio KPIs Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-neutral-950 border border-neutral-800 p-5 rounded-2xl shadow-lg hover:border-neutral-700 transition-all relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <span className="text-neutral-500 text-[10px] uppercase font-mono tracking-wider block">
              Portfolio AUM Monitored
            </span>
            <div className="text-2xl font-black text-neutral-100 font-sans tracking-tight mt-1.5">
              ₹24.85 <span className="text-sm font-normal text-neutral-500">Crore</span>
            </div>
            <div className="text-xs text-cyan-400 mt-2 flex items-center gap-1 font-mono">
              <TrendingUp className="w-3.5 h-3.5" />
              +18.4% YoY Growth
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-neutral-950 border border-neutral-800 p-5 rounded-2xl shadow-lg hover:border-neutral-700 transition-all relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <span className="text-neutral-500 text-[10px] uppercase font-mono tracking-wider block">
              Active Financial Twins
            </span>
            <div className="text-2xl font-black text-neutral-100 font-sans tracking-tight mt-1.5">
              {insights.activeDigitalTwins}{" "}
              <span className="text-xs font-normal text-neutral-500">MSMEs connected</span>
            </div>
            <div className="text-xs text-neutral-400 mt-2 flex items-center gap-1 font-mono">
              <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
              100% consent linked
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-neutral-950 border border-neutral-800 p-5 rounded-2xl shadow-lg hover:border-neutral-700 transition-all relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <span className="text-neutral-500 text-[10px] uppercase font-mono tracking-wider block">
              Avg Portfolio Health
            </span>
            <div className="text-2xl font-black text-cyan-400 font-sans tracking-tight mt-1.5">
              {insights.avgHealthScore}{" "}
              <span className="text-xs font-normal text-neutral-500">/100 (A Rating)</span>
            </div>
            <div className="text-xs text-neutral-400 mt-2 flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-cyan-500/70" />
              Real-time average
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-neutral-950 border border-neutral-800 p-5 rounded-2xl shadow-lg hover:border-neutral-700 transition-all relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-rose-500/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <span className="text-neutral-500 text-[10px] uppercase font-mono tracking-wider block">
              Portfolio at Risk Watch
            </span>
            <div className="text-2xl font-black text-rose-400 font-sans tracking-tight mt-1.5">
              {insights.highRiskPercentage}%{" "}
              <span className="text-xs font-normal text-neutral-500">watchlist limit</span>
            </div>
            <div className="text-xs text-rose-400 mt-2 flex items-center gap-1 font-mono animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5" />
              6 Critical accounts flagged
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 2. Top Lending Opportunities Table (7 columns) */}
        <div className="lg:col-span-7 bg-neutral-950 border border-neutral-800 rounded-2xl p-5 shadow-xl relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-4">
              <div>
                <h3 className="font-sans font-bold text-sm text-neutral-100 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
                  Top Opportunities (Pre-Qualified Credits)
                </h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Highly eligible MSME digital twins displaying robust transaction vectors, matching prime credit bands.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-900 text-neutral-500 font-mono text-[10px] uppercase">
                    <th className="py-2.5">Business Name</th>
                    <th className="py-2.5">Twin Score</th>
                    <th className="py-2.5 text-right">Offer Recommended</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900/40">
                  {insights.topOpportunities.map((opp) => {
                    const deployed = deployedOffers.includes(opp.id);
                    return (
                      <tr key={opp.id} className="hover:bg-neutral-900/30 transition-all">
                        <td className="py-3">
                          <div className="font-bold text-neutral-200">{opp.businessName}</div>
                          <div className="text-[10px] text-neutral-500">{opp.industry} • {opp.growthTrend}</div>
                        </td>
                        <td className="py-3">
                          <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded font-mono font-bold">
                            {opp.healthScore}
                          </span>
                        </td>
                        <td className="py-3 text-right font-mono font-bold text-cyan-400">
                          ₹{(opp.amountRecommended / 100000).toFixed(0)}L
                        </td>
                        <td className="py-3 text-right">
                          {deployed ? (
                            <span className="bg-cyan-500/10 text-cyan-400 px-2.5 py-1 rounded-lg text-[10px] font-sans border border-cyan-500/20">
                              Offer Sent
                            </span>
                          ) : (
                            <button
                              onClick={() => handleDeployOffer(opp.id, opp.businessName, opp.amountRecommended)}
                              className="bg-cyan-500 hover:bg-cyan-400 text-neutral-950 px-2.5 py-1 rounded-lg text-[10px] font-bold font-sans transition-all cursor-pointer flex items-center gap-0.5 ml-auto border border-cyan-400/20 shadow-md"
                            >
                              Deploy <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3. Portfolio Risk Watchlist (5 columns) */}
        <div className="lg:col-span-5 bg-neutral-950 border border-neutral-800 rounded-2xl p-5 shadow-xl relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-rose-500/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-4">
              <div>
                <h3 className="font-sans font-bold text-sm text-neutral-100 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                  Credit Risk Watchlist
                </h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Digital twins displaying transactional anomalies (bounces, unfiled GSTR, cash leaks).
                </p>
              </div>
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto no-scrollbar pr-1">
              {insights.highRiskWatchlist.map((risk) => {
                const notified = notifiedAdvisories.includes(risk.id);
                return (
                  <div
                    key={risk.id}
                    className="bg-neutral-900/35 border border-neutral-900 hover:border-neutral-800 p-3 rounded-xl flex items-start justify-between gap-3 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-200 text-xs">{risk.businessName}</span>
                        <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9px] font-mono px-1.5 py-0.2 rounded font-bold">
                          {risk.healthScore}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 leading-relaxed font-sans">{risk.riskReason}</p>
                      <div className="text-[9px] font-mono text-neutral-500 flex items-center gap-3">
                        <span>Inward cashflow: <span className="text-rose-400 font-bold">{risk.cashflowDrop}%</span></span>
                        <span>DSCR: <span className="font-bold">{risk.dscr}x</span></span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {notified ? (
                        <span className="bg-neutral-800 text-neutral-500 text-[9px] font-sans px-2 py-0.5 rounded border border-neutral-700">
                          Advisory Sent
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSendAdvisory(risk.id, risk.businessName, risk.riskReason)}
                          className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-2 py-1 rounded-lg text-[9px] font-bold font-sans transition-all cursor-pointer"
                        >
                          Advise
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. Strategic Sector Portfolio (12 columns) */}
        <div className="lg:col-span-12 bg-neutral-950 border border-neutral-800 rounded-2xl p-5 shadow-xl relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h4 className="font-sans font-bold text-xs text-neutral-100 mb-3 uppercase tracking-wider font-mono">
              Sector Exposure Exposure Mapping (AUM weighted %)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
              {insights.sectorDistribution.map((sec, idx) => (
                <div key={idx} className="bg-neutral-900/40 border border-neutral-900 p-3 rounded-xl">
                  <span className="text-neutral-500 text-[10px] font-mono block uppercase">{sec.sector}</span>
                  <span className="text-base font-black text-neutral-200 mt-1 block font-mono">{sec.value}% exposure</span>
                  <div className="w-full bg-neutral-800 h-1 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-cyan-500 h-1 rounded-full"
                      style={{ width: `${sec.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Premium Custom Popup Notification Modal */}
      {notification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden bg-gradient-to-b from-neutral-900 to-neutral-950">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2.5 text-cyan-400">
                <Zap className="w-5 h-5 animate-bounce" />
                <h4 className="font-sans font-bold text-sm text-neutral-100 uppercase tracking-wider font-mono">
                  {notification.title}
                </h4>
              </div>
              <p className="text-xs text-neutral-300 whitespace-pre-wrap leading-relaxed bg-neutral-950/40 p-3.5 rounded-xl border border-neutral-900 font-sans">
                {notification.message}
              </p>
              <button
                onClick={() => setNotification(null)}
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold rounded-xl transition-all cursor-pointer border border-cyan-400/20 shadow-md font-sans"
              >
                Acknowledge Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
