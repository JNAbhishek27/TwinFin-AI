/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AlternateDataSummary } from "../types";
import {
  FileSpreadsheet,
  QrCode,
  TrendingUp,
  TrendingDown,
  Activity,
  UserCheck,
  Building,
  CheckCircle,
  AlertTriangle,
  Receipt,
  Share2
} from "lucide-react";

interface DigitalTwinAlternateDataProps {
  alternateData: AlternateDataSummary;
}

type TabType = "gst" | "upi" | "bank" | "aggregator" | "epfo" | "invoices";

export default function DigitalTwinAlternateData({ alternateData }: DigitalTwinAlternateDataProps) {
  const [activeTab, setActiveTab] = useState<TabType>("bank");

  const tabList = [
    { id: "bank", label: "Bank Statement", icon: Building, color: "text-blue-400" },
    { id: "gst", label: "GST Filings", icon: FileSpreadsheet, color: "text-emerald-400" },
    { id: "upi", label: "UPI QR Inflows", icon: QrCode, color: "text-purple-400" },
    { id: "aggregator", label: "Account Aggregator", icon: Share2, color: "text-indigo-400" },
    { id: "invoices", label: "Trade Invoices", icon: Receipt, color: "text-amber-400" },
    { id: "epfo", label: "EPFO Payroll", icon: UserCheck, color: "text-rose-400" },
  ];

  const getStatusColor = (status: "excellent" | "good" | "fair" | "critical") => {
    switch (status) {
      case "excellent":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "good":
        return "bg-teal-500/10 text-teal-400 border-teal-500/20";
      case "fair":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "critical":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse";
    }
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-rose-400" />;
      case "stable":
        return <Activity className="w-4 h-4 text-neutral-400" />;
    }
  };

  const renderActiveContent = () => {
    let data;
    let title = "";
    let desc = "";

    switch (activeTab) {
      case "bank":
        data = alternateData.bankStatement.metrics;
        title = "Consolidated Live Bank Feed";
        desc = "Aggregated current account indicators processed in real-time from IDBI and auxiliary banking relationships.";
        break;
      case "gst":
        data = alternateData.gst.metrics;
        title = "GSTR-1 & GSTR-3B Tax Filings";
        desc = "Official GST filings verify sales turnover, growth vectors, tax discipline, and compliance consistency.";
        break;
      case "upi":
        data = alternateData.upi.metrics;
        title = "UPI Instant Merchant Settlement";
        desc = "High-frequency dynamic QR settlements from retail store locations used as proxy for daily working capital flows.";
        break;
      case "aggregator":
        data = alternateData.accountAggregator.metrics;
        title = "Consent Account Aggregator Framework";
        desc = "Consolidated non-primary bank reserves, fixed deposits, and direct debit commitments tracked securely.";
        break;
      case "invoices":
        data = alternateData.invoices.metrics;
        title = "B2B Trade Invoice Ledger";
        desc = "Aging analysis of trade receivables and vendor payables verifying customer collection speed and vendor trust.";
        break;
      case "epfo":
        data = alternateData.epfo.metrics;
        title = "EPFO Employee Payroll Validation";
        desc = "Social security compliance verifying the active full-time staff count and core workforce stability.";
        break;
    }

    return (
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-neutral-200">{title}</h4>
          <p className="text-xs text-neutral-400 mt-1">{desc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((metric, idx) => (
            <div
              key={idx}
              className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex flex-col justify-between hover:border-neutral-700 hover:shadow-lg hover:shadow-emerald-950/5 transition-all duration-300"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                    {metric.label}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {getTrendIcon(metric.trend)}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusColor(metric.status)}`}>
                      {metric.status}
                    </span>
                  </div>
                </div>
                <div className="text-lg md:text-xl font-bold text-neutral-100 mt-2 font-mono tracking-tight">
                  {metric.value}
                </div>
              </div>
              <p className="text-xs text-neutral-400 mt-3 border-t border-neutral-800/60 pt-2.5 leading-relaxed">
                {metric.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div id="alternate-data-panel" className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xl shadow-black/40 relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950">
      <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
      <div className="relative z-10">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between border-b border-neutral-800 pb-4 gap-4">
          <div>
            <h3 className="font-sans font-bold text-base md:text-lg text-neutral-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
              Alternate Data Digital Twin Feed
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Visualizing the continuously synced credit data pipes representing real-time MSME behavioral transactions.
            </p>
          </div>
        </div>

        {/* Responsive Horizontal Tabs */}
        <div className="flex overflow-x-auto gap-2 py-4 border-b border-neutral-900/60 no-scrollbar">
          {tabList.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all shrink-0 border ${
                  isActive
                    ? "bg-neutral-900 text-neutral-100 border-neutral-700 shadow-md"
                    : "bg-neutral-950/20 text-neutral-400 border-transparent hover:text-neutral-200 hover:bg-neutral-900/40"
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isActive ? tab.color : "text-neutral-500"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Render Active Tab Content */}
        <div className="mt-5 animate-fade-in">{renderActiveContent()}</div>
      </div>
    </div>
  );
}
