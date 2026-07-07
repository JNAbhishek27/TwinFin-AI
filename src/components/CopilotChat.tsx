/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { MessageSquare, Send, Sparkles, AlertCircle, HelpCircle, User, MessageSquareCode, Minimize2, Maximize2 } from "lucide-react";

interface CopilotChatProps {
  twinId: string;
  businessName: string;
}

export default function CopilotChat({ twinId, businessName }: CopilotChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      sender: "ai",
      text: `Hello! I am your IDBI TwinFin AI Copilot. I have mapped your complete financial Digital Twin, including GST turnover, UPI cash-settlement velocity, and bank DSCR levels. How can I help you optimize your lending eligibility or decision intelligence today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    "Why did my score change?",
    "Can I qualify for a ₹20 Lakh loan?",
    "How do I improve my liquidity?",
    "What is the CGTMSE coverage rule?",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `m-user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages,
          twinId,
        }),
      });

      if (!response.ok) {
        throw new Error("Copilot API failed");
      }

      const result = await response.json();

      const aiMsg: ChatMessage = {
        id: `m-ai-${Date.now()}`,
        sender: "ai",
        text: result.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: ChatMessage = {
        id: `m-err-${Date.now()}`,
        sender: "ai",
        text: "I encountered an error synchronizing with the credit model. Please make sure the server is active and the API key is set.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col h-[400px] relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950">
      <div className="absolute top-0 left-0 w-full h-[100px] bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 p-4 shrink-0 bg-neutral-950/60 rounded-t-2xl relative z-10">
        <div className="flex items-center gap-2">
          <div className="bg-cyan-500/10 p-1.5 rounded-lg border border-cyan-500/20">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-xs text-neutral-100">RAG Credit Advisory Copilot</h3>
            <span className="text-[10px] text-neutral-500 font-mono tracking-wider block">Connected: {businessName}</span>
          </div>
        </div>
      </div>

      {/* Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-950/20 no-scrollbar">
        {messages.map((m) => {
          const isAi = m.sender === "ai";
          return (
            <div key={m.id} className={`flex gap-2.5 max-w-[85%] ${isAi ? "mr-auto" : "ml-auto flex-row-reverse"}`}>
              {/* Avatar */}
              <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border text-[10px] ${
                isAi 
                  ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" 
                  : "bg-neutral-800 border-neutral-700 text-neutral-300"
              }`}>
                {isAi ? <Sparkles className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>

              {/* Bubble */}
              <div className={`p-3 rounded-xl text-xs leading-relaxed border ${
                isAi 
                  ? "bg-neutral-900/60 border-neutral-900 text-neutral-200" 
                  : "bg-cyan-500/10 border-cyan-500/20 text-neutral-100"
              }`}>
                <div className="whitespace-pre-wrap">{m.text}</div>
                <span className="text-[9px] font-mono text-neutral-600 block mt-1.5 text-right">{m.timestamp}</span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-2 mr-auto items-center text-xs text-neutral-500 font-mono bg-neutral-900/40 px-3 py-2 rounded-xl border border-neutral-900 animate-pulse">
            <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
            <span>Consulting RAG policy database...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Suggestions (only visible when not loading) */}
      <div className="px-4 py-2 bg-neutral-950 border-t border-neutral-900 overflow-x-auto no-scrollbar flex gap-2 shrink-0">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            disabled={loading}
            onClick={() => handleSendMessage(p)}
            className="bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-850 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all shrink-0 cursor-pointer disabled:opacity-50 font-sans"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input controls */}
      <div className="p-3 border-t border-neutral-800 bg-neutral-950 shrink-0 rounded-b-2xl flex items-center gap-2 relative z-10">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
          placeholder={`Ask credit advisory questions (e.g. "Can I get mudra loan?")`}
          className="flex-1 bg-neutral-900 border border-neutral-850 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 transition-all font-sans"
        />
        <button
          onClick={() => handleSendMessage(input)}
          disabled={!input.trim() || loading}
          className="bg-cyan-500 hover:bg-cyan-400 border border-cyan-400/20 text-neutral-950 p-2 rounded-xl transition-all flex items-center justify-center cursor-pointer disabled:opacity-40 shadow-[0_0_15px_rgba(6,182,212,0.15)] shrink-0"
        >
          <Send className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>
    </div>
  );
}
