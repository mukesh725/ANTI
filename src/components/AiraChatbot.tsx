"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, RefreshCw, AlertTriangle } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  chips?: string[];
  isEmergency?: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome",
    sender: "bot",
    text: "Welcome to AIRO Health. I'm AIRO, your personal health and wellness guide. How can I help you today?",
    chips: [
      "I feel tired all the time",
      "I want to lose weight",
      "I need vitamins",
      "What is AIRO Health?"
    ]
  }
];

export function AiraChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleRestart = () => {
    setMessages(INITIAL_MESSAGES);
    setIsTyping(false);
  };

  const getAiraResponse = (text: string): { text: string; chips?: string[]; isEmergency?: boolean } => {
    const input = text.toLowerCase().trim();

    // 1. Emergency Validation
    const emergencyKeywords = [
      "emergency", "chest pain", "heart attack", "stroke", "accident", 
      "bleeding", "difficulty breathing", "choking", "suicide", "poison", 
      "critical", "severe pain", "broken bone"
    ];
    if (emergencyKeywords.some(keyword => input.includes(keyword))) {
      return {
        text: "If this is a medical emergency, call emergency services or visit the nearest emergency room immediately.",
        isEmergency: true,
        chips: ["Start Over", "Speak with an AIRO specialist"]
      };
    }

    // 2. Main Prompt Options
    // Tired / Fatigue
    if (input.includes("tired") || input.includes("fatigue") || input.includes("exhaust") || input.includes("sleep") || input.includes("energy")) {
      return {
        text: "I can help with that. Fatigue can sometimes be related to:\n\n• Vitamin deficiencies\n• Hormonal imbalances\n• Stress\n• Sleep quality\n• Metabolic health\n\nWould you like to explore:",
        chips: ["Health Chair Assessment (5 Minutes)", "Advanced Lab Testing", "Wellness Consultation"]
      };
    }

    // Weight Loss
    if (input.includes("weight") || input.includes("lose") || input.includes("diet") || input.includes("obese") || input.includes("fat") || input.includes("glp")) {
      return {
        text: "Great. AIRO offers several options depending on your goals.\n\nWhich best describes your situation?",
        chips: [
          "Lose 10-20 lbs", 
          "Lose 20-50 lbs", 
          "Metabolic health improvement", 
          "Interested in GLP-1 therapy"
        ]
      };
    }

    // Vitamins
    if (input.includes("vitamin") || input.includes("supplement") || input.includes("nutr")) {
      return {
        text: "I can help.\n\nAre you looking for:",
        chips: [
          "Energy Support", 
          "Immune Support", 
          "Heart Health", 
          "Women's Wellness", 
          "Men's Wellness", 
          "General Multivitamins"
        ]
      };
    }

    // 3. Health Chair / Vitals
    if (input.includes("chair") || input.includes("scan") || input.includes("assessment") || input.includes("screening")) {
      return {
        text: "The AIRO Health Chair is a rapid wellness assessment system designed to provide a comprehensive health screening in approximately 5 minutes.\n\nIt captures vitals, respiratory indicators, kidney metrics, hormone profiles, metabolic markers, and thyroid status.\n\nWould you like a Health Chair assessment?",
        chips: ["Schedule Health Chair Scan", "Speak with an AIRO specialist", "Go Back"]
      };
    }

    // 4. Lab / Diagnostic Testing
    if (input.includes("lab") || input.includes("test") || input.includes("diagnostic") || input.includes("blood") || input.includes("marker")) {
      return {
        text: "AIRO Advanced Diagnostics tests the markers that matter across vitals, respiratory, kidney, hormone, metabolic, thyroid, cardiovascular, vitamins, iron, liver, and stress markers.\n\nWould you like to schedule a consultation for lab testing?",
        chips: ["Schedule a consultation", "Speak with an AIRO specialist", "Go Back"]
      };
    }

    // 5. Wellness Consultation
    if (input.includes("consultation") || input.includes("consult") || input.includes("appointment") || input.includes("book")) {
      return {
        text: "I would be happy to help arrange that. We offer consultations with our clinical and wellness specialists for customized health optimization.\n\nWould you like me to schedule a consultation?",
        chips: ["Yes, schedule a consultation", "Speak with an AIRO specialist", "Go Back"]
      };
    }

    // 6. Clinic / Minute Clinic
    if (input.includes("clinic") || input.includes("doctor") || input.includes("walk-in") || input.includes("vaccin") || input.includes("cold") || input.includes("flu")) {
      return {
        text: "AIRO Minute Clinic provides quick care, preventive care, and chronic disease monitoring. Services range from vaccinations and cold/flu care to annual physicals and travel medicine.\n\nWould you like to book a visit or consult a clinician?",
        chips: ["Schedule a consultation", "Speak with an AIRO specialist", "Go Back"]
      };
    }

    // 7. Pharmacy / Compounding
    if (input.includes("pharmacy") || input.includes("medication") || input.includes("prescription") || input.includes("compounding")) {
      return {
        text: "AIRO Pharmacy offers prescription, OTC, controlled, and refrigerated medications, along with custom compounding for personalized dosing, flexible formulations, and allergy exclusions.\n\nWould you like to speak with an AIRO pharmacy specialist?",
        chips: ["Speak with an AIRO specialist", "Go Back"]
      };
    }

    // 8. IV Therapy
    if (input.includes("iv") || input.includes("drip") || input.includes("nad") || input.includes("hydration")) {
      return {
        text: "AIRO IV Therapy provides direct hydration, recovery, and nutrient optimization. Core programs include AIRO Charge (Energy), Reset (Recovery), Glow (Skin & Beauty), and NAD+ Regen.\n\nWould you like to book an IV session?",
        chips: ["Schedule IV Therapy", "Speak with an AIRO specialist", "Go Back"]
      };
    }

    // 9. Essentials / Grocery
    if (input.includes("essential") || input.includes("grocery") || input.includes("food") || input.includes("produce") || input.includes("organic")) {
      return {
        text: "AIRO Essentials is our premium grocery and wellness retail division, providing fresh, organic, local, and sustainable food selections. Nutrition plays a foundational role in preventive health.\n\nWould you like a personalized wellness nutrition plan?",
        chips: ["Request personalized wellness plan", "Go Back"]
      };
    }

    // 10. Sub-options / Lead capture triggers
    if (
      input.includes("yes, schedule") || 
      input.includes("schedule a consultation") || 
      input.includes("speak with an airo specialist") || 
      input.includes("request personalized wellness plan") || 
      input.includes("schedule health chair scan") || 
      input.includes("schedule iv therapy") ||
      input.includes("lose 10-20 lbs") || 
      input.includes("lose 20-50 lbs") ||
      input.includes("metabolic health improvement") ||
      input.includes("interested in glp-1")
    ) {
      return {
        text: "Excellent choice. To arrange your request, please provide your email address or phone number, and one of our AIRO health coordinators will reach out shortly to finalize details.",
        chips: ["Go Back"]
      };
    }

    // Vitamin Sub-options
    const vitaminSubs = ["energy support", "immune support", "heart health", "women's wellness", "men's wellness", "general multivitamins"];
    if (vitaminSubs.some(sub => input.includes(sub))) {
      return {
        text: `AIRO Pharmacy and Compounding services can customize wellness supplement regimens for your needs.\n\nWould you like to speak with an AIRO pharmacy specialist for personalized wellness support?`,
        chips: ["Speak with an AIRO specialist", "Schedule a consultation", "Go Back"]
      };
    }

    // Email / phone capturing
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (emailRegex.test(input) || phoneRegex.test(input) || (input.length > 5 && /\d/.test(input) && (input.includes("@") || input.includes("-") || input.match(/\d/g)!.length >= 7))) {
      return {
        text: "Thank you. Your request and contact details have been securely captured. A wellness concierge will contact you within 24 hours to schedule your consultation.",
        chips: ["Start Over"]
      };
    }

    // Back / Reset
    if (input.includes("go back") || input.includes("start over") || input.includes("main menu") || input.includes("main option")) {
      return {
        text: "I'm here to guide you. What wellness goals can I help you explore today?",
        chips: [
          "I feel tired all the time",
          "I want to lose weight",
          "I need vitamins",
          "What is AIRO Health?"
        ]
      };
    }

    if (input.includes("what is airo") || input.includes("about airo") || input.includes("airo company")) {
      return {
        text: "AIRO Health is a next-generation integrated healthcare ecosystem focused on prevention, optimization, diagnostics, pharmacy services, wellness, and long-term longevity management. We combine our Health Chair, Advanced Labs, Minute Clinic, Pharmacy/Compounding, and Premium Grocery (Essentials) to make proactive wellness accessible.",
        chips: ["Health Chair assessment", "Advanced Lab testing", "Minute Clinic services", "Start Over"]
      };
    }

    // Fallback:
    return {
      text: "I don't currently have that information. Let me connect you with an AIRO Health specialist.",
      chips: ["Speak with an AIRO specialist", "Start Over"]
    };
  };

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: textToSend
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    // Simulate concierge response delay
    setTimeout(async () => {
      const response = getAiraResponse(textToSend);
      
      // Save chatbot lead if user entered an email/phone number
      const input = textToSend.toLowerCase().trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
      const isLead = emailRegex.test(input) || phoneRegex.test(input) || (input.length > 5 && /\d/.test(input) && (input.includes("@") || input.includes("-") || input.match(/\d/g)!.length >= 7));
      
      if (isLead) {
        try {
          const isEmail = emailRegex.test(input);

          // Send email notification via Formspree
          fetch('https://formspree.io/f/xpqegewy', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              subject: `New Chatbot Lead Captured!`,
              name: "Chatbot Visitor",
              email: isEmail ? textToSend : "Not Provided",
              phone: !isEmail ? textToSend : "Not Provided",
              message: `Captured contact details during conversation: "${textToSend}"`,
            }),
          }).catch(console.error);

          // Save globally to Firebase Dashboard
          try {
            await addDoc(collection(db, "leads"), {
              name: "Chatbot Visitor",
              email: isEmail ? textToSend : "Not Provided",
              phone: !isEmail ? textToSend : "Not Provided",
              type: "Chatbot Inquiry",
              message: `Captured contact details during conversation: "${textToSend}"`,
              source: "AI Assistant",
              status: "New",
              createdAt: new Date().toISOString()
            });
          } catch (dbError) {
            console.error("Failed to save lead to database:", dbError);
          }
        } catch {
          console.warn("Could not save chatbot lead");
        }
      }

      const botMsg: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: response.text,
        chips: response.chips,
        isEmergency: response.isEmergency
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }, 850);
  };

  const handleChipClick = (chipText: string) => {
    handleSendMessage(chipText);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mb-4 w-[380px] h-[580px] max-h-[80vh] max-w-[calc(100vw-2rem)] bg-[#FAF8F5] border border-[#E6DFD5] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-none"
          >
            {/* Chat Window Header */}
            <div className="bg-[#597467] text-[#FAF8F5] px-5 py-4 flex items-center justify-between border-b border-[#7C9A8E]">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#FAF8F5]/10 flex items-center justify-center border border-[#FAF8F5]/20">
                  <Bot className="w-5 h-5 text-[#E6DFD5]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg tracking-wide">AIRO</h3>
                  <p className="text-[10px] text-[#FAF8F5]/60 tracking-wider uppercase font-medium">AIRO Health Concierge</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRestart}
                  type="button"
                  title="Reset Conversation"
                  className="p-1.5 rounded-full hover:bg-white/10 text-[#FAF8F5]/80 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  type="button"
                  title="Close Assistant"
                  className="p-1.5 rounded-full hover:bg-white/10 text-[#FAF8F5]/80 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-grow overflow-y-auto p-5 space-y-4 scrollbar-thin">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-2 animate-none">
                  <div className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className="flex items-start max-w-[85%] space-x-2">
                      {msg.sender === "bot" && (
                        <div className="w-6 h-6 rounded-full bg-[#597467] flex-shrink-0 flex items-center justify-center text-[10px] text-[#FAF8F5] mt-1 font-serif">
                          O
                        </div>
                      )}
                      
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                          msg.sender === "user"
                            ? "bg-[#597467] text-[#FAF8F5]"
                            : msg.isEmergency
                            ? "bg-red-50 text-red-950 border border-red-200"
                            : "bg-[#F5EFEB] text-[#597467] border border-[#E6DFD5]"
                        }`}
                      >
                        {msg.isEmergency && (
                          <div className="flex items-center space-x-2 text-red-700 font-bold mb-1">
                            <AlertTriangle className="w-4 h-4" />
                            <span>EMERGENCY PROTOCOL</span>
                          </div>
                        )}
                        {msg.text}
                      </div>
                    </div>
                  </div>

                  {/* Interactive chips */}
                  {msg.chips && msg.chips.length > 0 && (
                    <div className="flex flex-wrap gap-2 pl-8 pt-1">
                      {msg.chips.map((chip, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleChipClick(chip)}
                          className="bg-white border border-[#E6DFD5] text-[#597467] hover:bg-[#597467] hover:text-[#FAF8F5] hover:border-[#597467] text-xs px-3 py-1.5 rounded-full transition-all duration-200 shadow-sm font-medium tracking-wide active:scale-95"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start items-center space-x-2 pl-8">
                  <div className="bg-[#F5EFEB] border border-[#E6DFD5] rounded-2xl px-4 py-3 flex space-x-1 items-center">
                    <span className="w-2 h-2 bg-[#597467]/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 bg-[#597467]/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 bg-[#597467]/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Disclaimer and Input Area */}
            <div className="border-t border-[#E6DFD5] bg-[#FAF8F5] p-3 space-y-2">
              {/* Disclaimer */}
              <p className="text-[10px] text-center text-gray-500 leading-normal px-2">
                AIRO provides wellness insights and does not diagnose disease or replace professional medical advice. For emergencies, call 911 immediately.
              </p>

              {/* Form Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputVal);
                }}
                className="flex items-center bg-white border border-[#E6DFD5] rounded-full px-4 py-1.5 shadow-sm focus-within:border-[#597467] transition-all"
              >
                <input
                  type="text"
                  placeholder="Ask AIRO about health chair, vitamins..."
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className="flex-grow bg-transparent border-none text-sm text-[#597467] focus:outline-none placeholder-gray-400 py-1"
                />
                <button
                  type="submit"
                  disabled={!inputVal.trim()}
                  className="p-1.5 text-[#597467] hover:text-[#597467]/80 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#597467] rounded-full shadow-2xl flex items-center justify-center text-[#FAF8F5] focus:outline-none border border-[#7C9A8E]/50 relative"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative"
            >
              <MessageSquare className="w-6 h-6" />
              {/* Notification dot */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#E6AFA3] rounded-full border-2 border-[#597467]"></span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
