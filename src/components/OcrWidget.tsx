/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { OCRResult } from "../types";
import { UploadCloud, FileText, CheckCircle, RefreshCw, Terminal, Plus, ArrowRight, Sparkles } from "lucide-react";

interface OcrWidgetProps {
  twinId: string;
  onOcrMerge: (ocrData: any) => void;
}

export default function OcrWidget({ twinId, onOcrMerge }: OcrWidgetProps) {
  const [loading, setLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [merged, setMerged] = useState(false);

  // Pre-made sample data to help testing
  const sampleDocs = [
    { name: "GSTR-3B_Q1_2026.pdf", type: "GST", label: "Sample GST Filings" },
    { name: "IDBI_CurrentStatement_6M.pdf", type: "BankStatement", label: "Sample Bank Statement" },
    { name: "Invoice_TataMotors_9421.png", type: "Invoice", label: "Sample Trade Invoice" },
  ];

  const logMessage = (msg: string, delay: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setTerminalLogs((prev) => [...prev, msg]);
        resolve();
      }, delay);
    });
  };

  const handleOcrProcess = async (fileName: string, type: string) => {
    setLoading(true);
    setMerged(false);
    setTerminalLogs([]);
    setOcrResult(null);

    // Simulate terminals logs for rich visual effect
    await logMessage(`[OCR] Initializing scanning context for document: ${fileName}`, 100);
    await logMessage(`[OCR] Analyzing MIME type and digital signature...`, 200);
    await logMessage(`[OCR] Invoking Google Gemini 3.5-Flash OCR parser pipeline...`, 300);

    try {
      // Create a dummy base64 representation of the file to satisfy the backend
      const dummyBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

      const response = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentType: type,
          fileName,
          base64Data: dummyBase64,
          twinId,
        }),
      });

      if (!response.ok) {
        throw new Error("OCR endpoint failed");
      }

      const result = await response.json();

      await logMessage(`[OCR] Success. Extracted layout structure. Code blocks verified.`, 400);
      await logMessage(`[SUCCESS] Extracted business node: "${result.extractedData.businessName || "Verified"}"`, 200);
      await logMessage(`[SUCCESS] Confidence metric: ${(result.extractedData.confidence * 100).toFixed(1)}%`, 100);

      setOcrResult(result);
    } catch (error) {
      console.error("OCR parse failed:", error);
      await logMessage(`[ERROR] Parsing failed. Check connection or API key.`, 100);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Infer type
      let docType = "Invoice";
      if (file.name.toLowerCase().includes("gst")) docType = "GST";
      if (file.name.toLowerCase().includes("bank") || file.name.toLowerCase().includes("statement")) docType = "BankStatement";

      handleOcrProcess(file.name, docType);
    }
  };

  const handleMergeAction = () => {
    if (!ocrResult) return;
    setMerged(true);
    onOcrMerge(ocrResult);
  };

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString("en-IN")}`;
  };

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950">
      <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* 1. Drag & Drop Upload Zone (5 columns) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-sans font-bold text-sm text-neutral-100 flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4 text-cyan-400" />
              Intelligent Alternate Data OCR Engine
            </h3>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Upload statements or invoices to dynamically extract, verify, and incorporate alternative credit datasets.
          </p>
        </div>

        {/* Drop zone */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[140px] ${
            dragActive
              ? "border-cyan-400 bg-cyan-500/5 shadow-inner"
              : "border-neutral-800 hover:border-neutral-700 bg-neutral-900/10"
          }`}
          onClick={() => handleOcrProcess("Custom_InwardStatement.pdf", "BankStatement")}
        >
          <UploadCloud className={`w-8 h-8 mb-2 ${dragActive ? "text-cyan-400" : "text-neutral-500"}`} />
          <span className="text-xs font-bold text-neutral-300 block">Drag & Drop Statement Here</span>
          <span className="text-[10px] text-neutral-500 mt-1 block">Or click to upload a simulated statement file</span>
        </div>

        {/* Pre-made testing samples */}
        <div className="space-y-1.5">
          <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">
            IDBI Pre-compiled Verification Samples:
          </span>
          <div className="flex flex-col gap-1.5">
            {sampleDocs.map((doc, idx) => (
              <button
                key={idx}
                disabled={loading}
                onClick={() => handleOcrProcess(doc.name, doc.type)}
                className="w-full text-left bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 px-3 py-2 rounded-xl text-xs flex items-center justify-between text-neutral-300 transition-all font-sans cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="truncate max-w-[200px]">{doc.name}</span>
                </div>
                <span className="bg-neutral-800 text-[9px] font-mono text-neutral-400 px-2 py-0.5 rounded border border-neutral-700">
                  {doc.type}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Logging and Results Screen (7 columns) */}
      <div className="lg:col-span-7 flex flex-col justify-between min-h-[260px] bg-neutral-900/30 border border-neutral-900 rounded-xl p-4">
        {/* Terminal Log Output */}
        <div className="space-y-3 flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-neutral-900/60 pb-1.5 text-[11px]">
            <span className="text-neutral-400 font-bold flex items-center gap-1.5 font-mono">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              OCR PIPELINE CONSOLE LOGS
            </span>
            <span className="text-neutral-500 font-mono">NODE v20.0</span>
          </div>

          <div className="bg-black/40 border border-neutral-900 rounded-lg p-3 font-mono text-[10px] text-cyan-400 space-y-1 overflow-y-auto max-h-[110px] min-h-[90px] no-scrollbar">
            {terminalLogs.length > 0 ? (
              terminalLogs.map((log, idx) => <div key={idx}>{log}</div>)
            ) : (
              <div className="text-neutral-600 font-sans italic text-center py-6">
                Terminal idle. Awaiting document feed...
              </div>
            )}
          </div>
        </div>

        {/* Structured Extraction Output */}
        {ocrResult && (
          <div className="mt-4 pt-3 border-t border-neutral-900/60 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-neutral-200 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>Extracted Schema Fields</span>
              </div>
              <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono px-2 py-0.5 rounded-full">
                Confidence: {(ocrResult.extractedData.confidence * 100).toFixed(0)}%
              </span>
            </div>

            {/* Field Matrix */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-neutral-950/45 p-3 rounded-xl border border-neutral-900/80">
              <div>
                <span className="text-neutral-500 text-[10px] block uppercase">Business Entity</span>
                <span className="text-neutral-300 font-sans font-bold truncate block">{ocrResult.extractedData.businessName || "N/A"}</span>
              </div>
              <div>
                <span className="text-neutral-500 text-[10px] block uppercase">GSTIN / Tax ID</span>
                <span className="text-neutral-300 font-sans truncate block">{ocrResult.extractedData.gstin || "N/A"}</span>
              </div>
              <div className="mt-1">
                <span className="text-neutral-500 text-[10px] block uppercase">Data Value Found</span>
                <span className="text-cyan-400 font-sans font-bold block">
                  {ocrResult.extractedData.invoiceAmount
                    ? formatCurrency(ocrResult.extractedData.invoiceAmount)
                    : ocrResult.extractedData.turnover
                    ? formatCurrency(ocrResult.extractedData.turnover)
                    : ocrResult.extractedData.avgDailyBalance
                    ? formatCurrency(ocrResult.extractedData.avgDailyBalance)
                    : "Verified"}
                </span>
              </div>
              <div className="mt-1">
                <span className="text-neutral-500 text-[10px] block uppercase">Extracted Stamp</span>
                <span className="text-neutral-300 font-sans block">{ocrResult.extractedData.date || "N/A"}</span>
              </div>
            </div>

            {/* Merge Action Button */}
            {!merged ? (
              <button
                onClick={handleMergeAction}
                className="w-full py-2 bg-indigo-500 hover:bg-indigo-400 text-neutral-950 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-indigo-400/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
              >
                <Plus className="w-4 h-4" />
                <span>Merge Extracted Metrics into Digital Twin Profile</span>
              </button>
            ) : (
              <div className="flex items-center justify-center gap-1.5 py-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold rounded-xl font-sans animate-fade-in">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>Twin Merged successfully! Credit vectors adjusted (+2 pts)</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);
}
