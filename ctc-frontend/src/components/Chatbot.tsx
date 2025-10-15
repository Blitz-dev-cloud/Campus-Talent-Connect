import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Sparkles } from "lucide-react";
import api from "../lib/api";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Opportunity {
  id: string | number;
  title: string;
  description: string;
  type: string;
  company: string;
  location: string;
  salary?: string | number;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Fetch opportunities from database
  const fetchOpportunities = async (): Promise<Opportunity[]> => {
    try {
      const response = await api.get("/api/opportunities");
      return response.data || [];
    } catch (error) {
      console.error("Failed to fetch opportunities:", error);
      return [];
    }
  };

  // Check if user is asking about opportunities
  const isAskingAboutOpportunities = (query: string): boolean => {
    const keywords = [
      "opportunity",
      "opportunities",
      "job",
      "jobs",
      "internship",
      "internships",
      "research",
      "position",
      "hire",
      "hiring",
      "available",
      "open",
      "postings",
      "what jobs",
      "find work",
      "looking for",
      "available positions",
    ];
    return keywords.some((keyword) => query.toLowerCase().includes(keyword));
  };

  // Format opportunities for the chatbot response
  const formatOpportunitiesResponse = (
    opportunities: Opportunity[]
  ): string => {
    if (opportunities.length === 0) {
      return "Currently, there are no opportunities available. Please check back soon!";
    }

    const formatted = opportunities
      .map((opp, index) => {
        const salary =
          opp.salary && opp.salary !== "" ? `$${opp.salary}` : "Not specified";
        return `${index + 1}. ${opp.title} at ${opp.company}\n   Type: ${
          opp.type
        } | Location: ${opp.location} | Salary: ${salary}`;
      })
      .join("\n\n");

    return `I found ${opportunities.length} available opportunities:\n\n${formatted}\n\nWould you like more details about any of these?`;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      if (!GEMINI_API_KEY) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Chatbot temporarily unavailable. Please configure Gemini API key.",
          },
        ]);
        return;
      }

      let systemPrompt = `You are a friendly assistant for Campus Talent Connect. Answer in natural, conversational language without bullet points, asterisks, or markdown formatting. Keep responses under 100 words. Be helpful and direct.`;

      let enrichedContent = input;

      // Check if user is asking about opportunities
      if (isAskingAboutOpportunities(input)) {
        const opportunities = await fetchOpportunities();
        if (opportunities.length > 0) {
          const oppSummary = formatOpportunitiesResponse(opportunities);
          enrichedContent = `${input}\n\nHere's current data from our database:\n${oppSummary}`;
          systemPrompt +=
            "\nThe user is asking about opportunities. Use the provided opportunity data to give a specific, helpful answer about what's currently available.";
        }
      }

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${systemPrompt}\n\nUser question: ${enrichedContent}`,
                  },
                ],
              },
            ],
            generationConfig: {
              maxOutputTokens: 150,
              temperature: 0.6,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to get response");
      }

      const data = await response.json();
      const botMsg =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Unable to process your request.";
      setMessages((prev) => [...prev, { role: "assistant", content: botMsg }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    {
      label: "What jobs are available?",
      query: "What opportunities are available?",
    },
    { label: "Get started", query: "How do I get started?" },
    { label: "Find internships", query: "Show me available internships" },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 flex flex-col overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-5">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">
                    Campus Helper
                  </h3>
                  <p className="text-white/80 text-xs">AI-powered assistance</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 hover:rotate-90"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-transparent to-blue-50/30">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <MessageCircle size={32} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    Welcome to CTC!
                  </h4>
                  <p className="text-sm text-gray-500">
                    Ask about opportunities or anything else
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center px-4">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(q.query)}
                      className="px-3 py-1.5 bg-white rounded-full text-xs text-gray-700 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                } animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-sm whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-br-md"
                      : "bg-white text-gray-800 rounded-bl-md border border-gray-100"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start animate-in fade-in duration-200">
                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white/50 backdrop-blur-sm border-t border-gray-100">
            <div className="flex gap-2 bg-white rounded-2xl shadow-lg p-2 border border-gray-200">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about opportunities..."
                className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none text-gray-800 placeholder-gray-400"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2.5 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-3xl transition-all duration-300 hover:scale-110 active:scale-95 group z-40"
      >
        <MessageCircle
          size={28}
          className="group-hover:rotate-12 transition-transform duration-300"
        />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
      </button>
    </>
  );
};

export default Chatbot;
