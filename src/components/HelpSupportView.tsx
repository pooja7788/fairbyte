import React, { useState } from "react";
import { 
  HelpCircle, 
  Search, 
  MessageSquare, 
  Phone, 
  Mail, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  Bot, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { FAQItem, SupportChatMessage } from "../types";
import { MOCK_FAQS, MOCK_SUPPORT_INITIAL_MESSAGES } from "../mockData";

export default function HelpSupportView() {
  const [searchFaq, setSearchFaq] = useState("");
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<string>("all");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>("faq-1");
  
  // Support Chat simulation state
  const [messages, setMessages] = useState<SupportChatMessage[]>(MOCK_SUPPORT_INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const filteredFaqs = MOCK_FAQS.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchFaq.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchFaq.toLowerCase());
    const matchesCat = selectedFaqCategory === "all" || faq.category === selectedFaqCategory;
    return matchesSearch && matchesCat;
  });

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg: SupportChatMessage = {
      id: "msg-" + Date.now(),
      sender: "user",
      text,
      timestamp: "Just now"
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate smart support bot response
    setTimeout(() => {
      let botReply = "Thank you for reaching out. Our support agent is reviewing your query.";
      const lower = text.toLowerCase();

      if (lower.includes("delay") || lower.includes("late") || lower.includes("where is my order")) {
        botReply = "We're checking your order status with courier Alex. Your delivery partner is on the way and expected to arrive in approximately 12 minutes.";
      } else if (lower.includes("platform fee") || lower.includes("pricing") || lower.includes("fee")) {
        botReply = "FairByte never charges platform or convenience markups. You only pay the exact restaurant menu price plus fair courier compensation.";
      } else if (lower.includes("cancel") || lower.includes("refund")) {
        botReply = "Orders can be cancelled with 100% full refund before the kitchen accepts preparation. For active orders, refunds are credited back to source within 15 minutes.";
      } else if (lower.includes("missing") || lower.includes("wrong")) {
        botReply = "We apologize! If any item is missing or incorrect, please share a quick note and we will instantly credit your wallet or redelivery.";
      }

      const botMsg: SupportChatMessage = {
        id: "msg-" + (Date.now() + 1),
        sender: "support",
        text: botReply,
        timestamp: "Just now"
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      
      {/* 1. HEADER */}
      <div className="text-center space-y-3 py-4">
        <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
          <HelpCircle className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-zinc-950 font-sans tracking-tight">
          FairByte Help & Support Center
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
          Instant answers on transparent billing, delivery tracking, and live customer assistance.
        </p>
      </div>

      {/* 2. CATEGORY QUICK SELECTORS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: "pricing", label: "Transparent Pricing", icon: ShieldCheck },
          { id: "delivery", label: "Delivery Issues", icon: HelpCircle },
          { id: "orders", label: "Order Questions", icon: HelpCircle },
          { id: "refunds", label: "Refunds & Billing", icon: HelpCircle }
        ].map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedFaqCategory(c.id)}
              className={`cursor-pointer p-4 rounded-2xl border text-left transition-all space-y-1 ${
                selectedFaqCategory === c.id
                  ? "bg-emerald-50 border-emerald-500/80 shadow-xs"
                  : "bg-white border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              <Icon className="w-4 h-4 text-emerald-600 mb-1" />
              <h4 className="font-bold text-xs text-zinc-950">{c.label}</h4>
              <p className="text-[10px] text-zinc-500">View FAQs</p>
            </button>
          );
        })}
      </div>

      {/* 3. INTERACTIVE SUPPORT CHAT SIMULATOR */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-zinc-950">
                FairByte Live Support Assistant
              </h3>
              <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Online • 24/7 Response Time</span>
              </p>
            </div>
          </div>
        </div>

        {/* Chat History Box */}
        <div className="bg-zinc-50 rounded-2xl p-4 h-64 overflow-y-auto space-y-3 border border-zinc-100">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-emerald-600 text-white font-medium shadow-xs"
                    : "bg-white border border-zinc-200 text-zinc-800 shadow-2xs"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-zinc-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs bg-white p-2.5 rounded-xl border border-zinc-200 w-28">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-100" />
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-200" />
              <span className="text-[10px] font-medium ml-1">Typing...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => handleSendMessage("My order is delayed.")}
            className="cursor-pointer text-[11px] font-bold text-zinc-700 bg-zinc-100 hover:bg-emerald-50 hover:text-emerald-800 px-3 py-1.5 rounded-xl border border-zinc-200/60 transition-colors"
          >
            "My order is delayed."
          </button>
          <button
            onClick={() => handleSendMessage("Why are there no platform fees?")}
            className="cursor-pointer text-[11px] font-bold text-zinc-700 bg-zinc-100 hover:bg-emerald-50 hover:text-emerald-800 px-3 py-1.5 rounded-xl border border-zinc-200/60 transition-colors"
          >
            "Why are there no platform fees?"
          </button>
          <button
            onClick={() => handleSendMessage("What is your refund policy?")}
            className="cursor-pointer text-[11px] font-bold text-zinc-700 bg-zinc-100 hover:bg-emerald-50 hover:text-emerald-800 px-3 py-1.5 rounded-xl border border-zinc-200/60 transition-colors"
          >
            "What is your refund policy?"
          </button>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message or question..."
            className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <button
            type="submit"
            className="cursor-pointer bg-zinc-950 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>

      {/* 4. FREQUENTLY ASKED QUESTIONS ACCORDION */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
          <div>
            <h3 className="font-black text-lg text-zinc-950 font-sans">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-zinc-500">Everything you need to know about FairByte</p>
          </div>

          <div className="relative w-full sm:w-60">
            <input
              type="text"
              value={searchFaq}
              onChange={(e) => setSearchFaq(e.target.value)}
              placeholder="Search questions..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-8 pr-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-zinc-50 border border-zinc-200/70 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                  className="cursor-pointer w-full p-4 text-left flex items-center justify-between gap-3 text-xs font-bold text-zinc-900"
                >
                  <span>{faq.question}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-zinc-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 text-xs text-zinc-600 leading-relaxed border-t border-zinc-200/50 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* 5. CONTACT CHANNELS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-zinc-200/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-zinc-950">Call Phone Support</h4>
            <p className="text-xs text-zinc-500 font-mono">+91 80 4092 8800</p>
            <span className="text-[10px] text-emerald-600 font-bold">Mon-Sun 8am - 12am</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-zinc-200/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-zinc-950">Email Assistance</h4>
            <p className="text-xs text-zinc-500 font-mono">support@fairbyte.app</p>
            <span className="text-[10px] text-emerald-600 font-bold">Guaranteed response under 15m</span>
          </div>
        </div>
      </div>

    </div>
  );
}
