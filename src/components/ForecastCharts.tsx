/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ForecastPoint } from "../types";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";
import { TrendingUp, Award, Activity } from "lucide-react";

interface ForecastChartsProps {
  forecasts: ForecastPoint[];
  isSimulated: boolean;
}

export default function ForecastCharts({ forecasts, isSimulated }: ForecastChartsProps) {
  // Format numbers to Indian Lakhs
  const formatYAxis = (value: number) => {
    return `₹${(value / 100000).toFixed(1)}L`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl shadow-xl font-sans text-xs space-y-1.5">
          <p className="font-bold text-neutral-300 border-b border-neutral-900 pb-1 mb-1 font-mono">{label}</p>
          <p className="text-cyan-400 flex justify-between gap-4 font-mono">
            <span>Revenue:</span>
            <span>₹{payload[0].value.toLocaleString("en-IN")}</span>
          </p>
          {payload[1] && (
            <p className="text-blue-400 flex justify-between gap-4 font-mono">
              <span>Cashflow:</span>
              <span className={payload[1].value < 0 ? "text-rose-400" : "text-blue-400"}>
                ₹{payload[1].value.toLocaleString("en-IN")}
              </span>
            </p>
          )}
          {payload[2] && (
            <p className="text-amber-400 flex justify-between gap-4 font-mono">
              <span>Repayment Index:</span>
              <span>{payload[2].value}%</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 1. Cashflow & Revenue Projections (8 columns) */}
      <div className="lg:col-span-8 bg-neutral-950 border border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-neutral-900 pb-3 mb-4 relative z-10">
          <div>
            <h3 className="font-sans font-bold text-sm text-neutral-100 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              6-Month Predictive Financial Projections
            </h3>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Machine learning forecasts based on integrated GST, invoices, and historical bank statement trends.
            </p>
          </div>
          {isSimulated && (
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1 animate-pulse">
              <Activity className="w-3 h-3" />
              SIMULATED VALUES ACTIVE
            </span>
          )}
        </div>

        {/* Chart area */}
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecasts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCashflow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
              <XAxis dataKey="month" stroke="#737373" fontSize={10} fontStyle="mono" tickLine={false} />
              <YAxis stroke="#737373" fontSize={10} fontStyle="mono" tickFormatter={formatYAxis} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                iconSize={10}
                iconType="circle"
                wrapperStyle={{ fontSize: "11px", fontFamily: "sans-serif" }}
              />
              <Area
                name="Projected Monthly Revenue"
                type="monotone"
                dataKey="revenue"
                stroke="#06b6d4"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                strokeWidth={2}
              />
              <Area
                name="Projected Net Cashflow"
                type="monotone"
                dataKey="cashflow"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorCashflow)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Repayment Ability Index (4 columns) */}
      <div className="lg:col-span-4 bg-neutral-950 border border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
        <div className="border-b border-neutral-900 pb-3 mb-4 relative z-10">
          <h3 className="font-sans font-bold text-sm text-neutral-100 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-purple-400" />
            Repayment Ability Index
          </h3>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Proprietary credit intelligence rating predicting monthly debt servicing resilience.
          </p>
        </div>

        <div className="w-full h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={forecasts} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
              <XAxis dataKey="month" stroke="#737373" fontSize={10} fontStyle="mono" tickLine={false} />
              <YAxis stroke="#737373" fontSize={10} fontStyle="mono" domain={[0, 100]} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar name="Repayment Confidence %" dataKey="repaymentAbility" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-neutral-900/60 p-3 rounded-xl border border-neutral-900 text-xs mt-3">
          <span className="text-neutral-500 block uppercase font-mono text-[9px]">Decision Insight</span>
          <p className="text-neutral-300 leading-relaxed mt-1">
            Ratings above <span className="text-purple-400 font-bold">75%</span> represent immediate eligibility for IDBI prime interest discounts.
          </p>
        </div>
      </div>
    </div>
  );
}
