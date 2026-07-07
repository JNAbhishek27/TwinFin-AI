/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { MSMEProfile } from "../types";
import { Layers, ShieldCheck, Users, RefreshCw, Landmark, Briefcase } from "lucide-react";

interface HeaderProps {
  twins: { id: string; businessName: string; constitution: string; industry: string }[];
  activeTwinId: string;
  onTwinChange: (id: string) => void;
  portalMode: "msme" | "rm";
  onPortalModeChange: (mode: "msme" | "rm") => void;
  activeProfile: MSMEProfile | null;
  onReset: () => void;
  isSimulating: boolean;
}

export default function Header({
  twins,
  activeTwinId,
  onTwinChange,
  portalMode,
  onPortalModeChange,
  activeProfile,
  onReset,
  isSimulating,
}: HeaderProps) {
  return (
    <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500/10 p-2.5 rounded-xl border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(8,145,178,0.3)]">
            <Layers className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-sans font-bold text-lg md:text-xl text-neutral-100 tracking-tight">
                TwinFin <span className="text-cyan-400 animate-pulse">AI</span>
              </h1>
              <span className="bg-neutral-800 text-[10px] text-neutral-400 px-2 py-0.5 rounded-full font-mono border border-neutral-700">
                IDBI INNOVATE 2026
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-sans mt-0.5">
              Financial Digital Twin & Decision Intelligence Platform
            </p>
          </div>
        </div>

        {/* Central Controls: Selector & Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Switcher */}
          <div className="bg-neutral-900 p-1 rounded-xl border border-neutral-800 flex items-center">
            <button
              onClick={() => onPortalModeChange("msme")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                portalMode === "msme"
                  ? "bg-neutral-800 text-emerald-400 shadow-sm border border-neutral-700"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              MSME Owner Portal
            </button>
            <button
              onClick={() => onPortalModeChange("rm")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                portalMode === "rm"
                  ? "bg-neutral-800 text-indigo-400 shadow-sm border border-neutral-700"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              RM Dashboard
            </button>
          </div>

          {/* Active Twin Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider hidden lg:inline">
              Active Twin:
            </span>
            <select
              value={activeTwinId}
              onChange={(e) => onTwinChange(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-cyan-400 transition-all font-sans max-w-[200px] md:max-w-[250px]"
            >
              {twins.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.businessName} ({t.constitution})
                </option>
              ))}
            </select>
          </div>

          {/* Reset / Re-sync Simulation State */}
          {isSimulating && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-xs font-medium transition-all animate-fade-in"
              title="Reset Twin to Real-Time Feed"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Simulation</span>
            </button>
          )}
        </div>
      </div>

      {/* Active MSME banner */}
      {portalMode === "msme" && activeProfile && (
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-neutral-900 flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-4 text-neutral-400 font-mono">
            <div>
              <span className="text-neutral-500">Industry:</span>{" "}
              <span className="text-neutral-200 font-sans">{activeProfile.industry}</span>
            </div>
            <div className="hidden sm:block text-neutral-700">|</div>
            <div>
              <span className="text-neutral-500">GSTIN:</span>{" "}
              <span className="text-neutral-200">{activeProfile.gstin}</span>
            </div>
            <div className="hidden sm:block text-neutral-700">|</div>
            <div>
              <span className="text-neutral-500">PAN:</span>{" "}
              <span className="text-neutral-200">{activeProfile.pan}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-cyan-500/5 px-2.5 py-1 rounded-full text-[11px] font-sans text-cyan-400 border border-cyan-500/10">
            <ShieldCheck className="w-3.5 h-3.5" />
            Consent Account Aggregator Active
          </div>
        </div>
      )}
    </header>
  );
}
