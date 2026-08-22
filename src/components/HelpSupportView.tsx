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
  ArrowRight,
  Bike,
  UtensilsCrossed,
  Receipt,
  RotateCcw,
  CheckCircle2
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

    // Smart contextual AI support assistant tailored to user preferences
    setTimeout(() => {
      let botReply = "Thank you for reaching out! Our live team is here to assist you with complete transparency.";
      const lower = text.toLowerCase();

      if (lower.includes("7") || lower.includes("km") || lower.includes("delivery fee") || lower.includes("calculate") || lower.includes("distance") || lower.includes("location")) {
        botReply = "📍 RestoX Delivery Calculation: We calculate exact GPS Haversine distance from the restaurant to your selected address. Delivery fee = Base Fee (₹25) + (Distance in km × ₹7/km). 100% of this fee goes directly to your courier partner with ₹0 surge!";
      } else if (lower.includes("delay") || lower.includes("late") || lower.includes("where is my order") || lower.includes("track") || lower.includes("status")) {
        botReply = "🛵 Live Order Tracking: Your courier Alex is currently en route with thermal food packaging. Estimated arrival is in ~14 minutes. You can check the live GPS movement on the 'Orders' / Live Tracking page!";
      } else if (lower.includes("veg") || lower.includes("pure veg") || lower.includes("jain") || lower.includes("diet") || lower.includes("prefer")) {
        botReply = "🥗 Dietary Preferences: RestoX features top-rated Pure Veg kitchens like Dosa District, Green Bowl, and Spice Route with 100% dedicated vegetarian cooking preparation. You can toggle the 'Pure Veg Only' filter on the homepage!";
      } else if (lower.includes("platform fee") || lower.includes("pricing") || lower.includes("fee") || lower.includes("transparent") || lower.includes("markup")) {
        botReply = "🛡️ Transparent Pricing Guarantee: RestoX charges ₹0 Platform Fees and ₹0 Convenience Markups. You pay the exact dine-in menu price + 2.5% CGST + 2.5% SGST + the distance delivery fee (₹7/km). No artificial price inflation!";
      } else if (lower.includes("cancel") || lower.includes("refund")) {
        botReply = "💳 Instant Refund Guarantee: You can cancel your order for an instant 100% full refund before the kitchen starts cooking. If any item is missing or damaged upon delivery, our support team will credit your original payment source within 15 minutes.";
      } else if (lower.includes("biryani") || lower.includes("butter chicken") || lower.includes("dosa") || lower.includes("recommend")) {
        botReply = "🍲 Food Recommendation: Top customer favorites right now include the 'Hyderabadi Chicken Dum Biryani' from Biryani Junction, 'Ghee Roast Podi Dosa' from Dosa District, and 'Signature Butter Chicken Bowl' from Spice Route!";
      } else if (lower.includes("payment") || lower.includes("upi") || lower.includes("cash") || lower.includes("cod")) {
        botReply = "💳 Flexible Payments: We accept UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, and Cash on Delivery (COD) with ₹0 payment transaction fee.";
      } else {
        botReply = `Got it! Regarding "${text}": RestoX is committed to 100% authentic restaurant menu prices, fair ₹7/km courier payouts, and rapid support. How else can I personalize your dining experience today?`;
      }

      const botMsg: SupportChatMessage = {
        id: "msg-" + (Date.now() + 1),
        sender: "support",
        text: botReply,
        timestamp: "Just now"
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      
      {/* 1. HEADER (Pinterest Warm Sand Theme) */}
      <div className="text-center space-y-3 py-6 bg-[#fbf9f4] border border-[#ebe4d7] rounded-[2rem] p-6 shadow-2xs">
        <div className="w-14 h-14 bg-[#2d4023] text-[#f3f7ee] rounded-full flex items-center justify-center mx-auto shadow-md shadow-[#2d4023]/20">
          <HelpCircle className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-[#1c271b] font-sans tracking-tight">
          RestoX Live Support & Help Center
        </h1>
        <p className="text-xs sm:text-sm text-[#5f6c5a] max-w-md mx-auto font-medium">
          Instant answers on transparent billing, dynamic ₹7/km delivery tracking, and live customer assistance.
        </p>
      </div>

      {/* 2. CATEGORY QUICK SELECTORS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: "pricing", label: "Transparent Pricing", icon: ShieldCheck },
          { id: "delivery", label: "₹7/km Delivery", icon: Bike },
          { id: "orders", label: "Live Order Tracking", icon: UtensilsCrossed },
          { id: "refunds", label: "Refunds & Support", icon: RotateCcw }
        ].map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedFaqCategory(c.id)}
              className={`cursor-pointer p-4 rounded-2xl border text-left transition-all space-y-1 ${
                selectedFaqCategory === c.id
                  ? "bg-[#edf4e8] border-[#365229] text-[#22351b] shadow-xs"
                  : "bg-white border-[#e6ded0] hover:bg-[#fbf9f4] text-[#334230]"
              }`}
            >
              <Icon className="w-4 h-4 text-[#355029] mb-1 stroke-[2.5]" />
              <h4 className="font-bold text-xs text-[#1c271b]">{c.label}</h4>
              <p className="text-[10px] text-[#717e6d]">View FAQs</p>
            </button>
          );
        })}
      </div>

      {/* 3. INTERACTIVE SUPPORT CHAT SIMULATOR */}
      <div className="bg-white rounded-[2rem] border border-[#e6ded0] p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#f0eae0] pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2d4023] text-white flex items-center justify-center font-bold shadow-xs">
              <Bot className="w-5 h-5 text-[#edf4e8]" />
            </div>
            <div>
              <h3 className="font-black text-sm text-[#1c271b]">
                RestoX Live Support Assistant
              </h3>
              <p className="text-[10px] text-[#365229] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#365229] animate-pulse" />
                <span>Online • Real-Time AI & Human Support</span>
              </p>
            </div>
          </div>
          <span className="bg-[#edf4e8] text-[#263a1e] text-[10px] font-black px-2.5 py-1 rounded-full border border-[#d0dfc7] hidden sm:inline-block">
            ⚡ Instant Responses
          </span>
        </div>

        {/* Chat History Box */}
        <div className="bg-[#faf7f2] rounded-2xl p-4 h-72 overflow-y-auto space-y-3 border border-[#ede6db]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-[#2d4023] text-white font-medium shadow-xs"
                    : "bg-white border border-[#e4dcce] text-[#22311f] shadow-2xs font-medium"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-[#869282] mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 text-[#677463] text-xs bg-white p-2.5 rounded-xl border border-[#e4dcce] w-32 shadow-2xs">
              <span className="w-1.5 h-1.5 bg-[#365229] rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-[#365229] rounded-full animate-bounce delay-100" />
              <span className="w-1.5 h-1.5 bg-[#365229] rounded-full animate-bounce delay-200" />
              <span className="text-[10px] font-bold ml-1 text-[#365229]">Thinking...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips (Tailored to User Preferences) */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => handleSendMessage("How is the ₹7/km delivery fee calculated?")}
            className="cursor-pointer text-[11px] font-bold text-[#2d3d29] bg-[#fbf9f4] hover:bg-[#edf4e8] hover:text-[#1c2d16] px-3.5 py-1.5 rounded-full border border-[#ded5c5] transition-colors shadow-2xs"
          >
            📍 "How is the ₹7/km delivery fee calculated?"
          </button>
          <button
            onClick={() => handleSendMessage("Where is my order and courier partner?")}
            className="cursor-pointer text-[11px] font-bold text-[#2d3d29] bg-[#fbf9f4] hover:bg-[#edf4e8] hover:text-[#1c2d16] px-3.5 py-1.5 rounded-full border border-[#ded5c5] transition-colors shadow-2xs"
          >
            🛵 "Where is my order and courier partner?"
          </button>
          <button
            onClick={() => handleSendMessage("Show me pure veg and healthy choices")}
            className="cursor-pointer text-[11px] font-bold text-[#2d3d29] bg-[#fbf9f4] hover:bg-[#edf4e8] hover:text-[#1c2d16] px-3.5 py-1.5 rounded-full border border-[#ded5c5] transition-colors shadow-2xs"
          >
            🥗 "Show me pure veg and healthy choices"
          </button>
          <button
            onClick={() => handleSendMessage("Why are there ₹0 platform fees?")}
            className="cursor-pointer text-[11px] font-bold text-[#2d3d29] bg-[#fbf9f4] hover:bg-[#edf4e8] hover:text-[#1c2d16] px-3.5 py-1.5 rounded-full border border-[#ded5c5] transition-colors shadow-2xs"
          >
            🛡️ "Why are there ₹0 platform fees?"
          </button>
          <button
            onClick={() => handleSendMessage("What is your refund and cancellation policy?")}
            className="cursor-pointer text-[11px] font-bold text-[#2d3d29] bg-[#fbf9f4] hover:bg-[#edf4e8] hover:text-[#1c2d16] px-3.5 py-1.5 rounded-full border border-[#ded5c5] transition-colors shadow-2xs"
          >
            💳 "What is your refund policy?"
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
            placeholder="Ask anything about orders, ₹7/km pricing, veg food, or delivery..."
            className="flex-1 bg-[#faf7f2] border border-[#ded5c5] rounded-full px-5 py-3 text-xs font-medium text-[#1c271b] placeholder-[#818f7d] focus:outline-none focus:ring-2 focus:ring-[#365229]/20 focus:border-[#365229] transition-all"
          />
          <button
            type="submit"
            className="cursor-pointer bg-[#2d4023] hover:bg-[#203018] text-white px-5 py-3 rounded-full text-xs font-black flex items-center gap-1.5 shadow-md shadow-[#2d4023]/25 active:scale-95 transition-all"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>

      {/* 4. FREQUENTLY ASKED QUESTIONS ACCORDION */}
      <div className="bg-white rounded-[2rem] border border-[#e6ded0] p-6 sm:p-8 shadow-xs space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f0eae0] pb-4">
          <div>
            <h3 className="font-black text-lg text-[#1c271b] font-sans">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-[#63705f]">Everything you need to know about RestoX transparent dining</p>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchFaq}
              onChange={(e) => setSearchFaq(e.target.value)}
              placeholder="Search questions..."
              className="w-full bg-[#faf7f2] border border-[#ded5c5] rounded-full pl-9 pr-4 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#365229]/20 focus:border-[#365229]"
            />
            <Search className="w-3.5 h-3.5 text-[#869282] absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-[#faf7f2] border border-[#eae3d5] rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-[#f6f1e8] transition-colors"
                >
                  <span className="font-bold text-xs sm:text-sm text-[#1c271b]">
                    {faq.question}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#365229] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#869282] shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-4 pt-0 text-xs text-[#525f4d] leading-relaxed border-t border-[#eee7db] mt-1">
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
