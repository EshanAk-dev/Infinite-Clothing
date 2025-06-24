import { useState, useEffect, useRef } from "react";
import {
  Send,
  Minimize2,
  Maximize2,
  X,
  Bot,
  User,
  Sparkles,
  Settings,
  AlertCircle,
} from "lucide-react";

const FashionTrendsChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hello! I'm your AI-powered Fashion Trends assistant with real-time data! I can help you discover the latest fashion trends, styling tips, and what's hot in the fashion world right now. To get started with real-time trends, please add your free Gemini API key in settings. What would you like to know?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const storedKey = localStorage.getItem("geminiApiKey");
    if (storedKey) setApiKey(storedKey);
    scrollToBottom();
  }, [messages]);

  const saveApiKey = () => {
    localStorage.setItem("geminiApiKey", apiKey); // Save to localStorage
    setShowSettings(false);
    addMessage(
      "✅ API key saved! I can now provide real-time fashion trends. Ask me anything about current fashion!",
      true
    );
  };

  const addMessage = (text, isBot = false) => {
    const message = {
      id: Date.now() + Math.random(),
      text,
      isBot,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
  };

  // Enhanced AI response with real API integration
  const getAIResponse = async (userMessage) => {
    if (!apiKey) {
      return `🔑 To get real-time fashion trends, please add your free Gemini API key in settings (⚙️ icon). 

**Meanwhile, here are some trending styles:**
• **Oversized Blazers** - Professional yet comfortable
• **Wide-leg Trousers** - Flowy and elegant  
• **Cottagecore Dresses** - Romantic and whimsical
• **Cargo Pants** - Utilitarian chic

Get your free API key at: https://aistudio.google.com/app/apikey`;
    }

    try {
      const prompt = `You are a fashion trends expert. The user asked: "${userMessage}"

Please provide a helpful, trendy, and engaging response about fashion. Include:
- Current fashion trends for 2025
- Specific styling tips
- Color recommendations
- Seasonal considerations
- Practical advice

Keep the response conversational, use emojis, and format with bullet points where helpful. Focus on actionable fashion advice.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Invalid API response structure");
      }
    } catch (error) {
      console.error("API Error:", error);
      return `❌ Unable to get real-time trends right now. ${
        error.message.includes("API_KEY")
          ? "Please check your API key in settings."
          : "Please try again later."
      }

**Here's some general fashion advice:**
• **Current hot colors**: Sage green, burnt orange, digital lavender
• **Trending styles**: Oversized blazers, wide-leg pants, midi dresses
• **Key accessories**: Chunky jewelry, mini bags, statement belts

Need help setting up your API key? Visit: https://aistudio.google.com/app/apikey`;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const aiResponse = await getAIResponse(inputMessage);
      const botMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "❌ Sorry, I encountered an error. Please try again or check your API key in settings.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "What are new trendings in Sri Lanka?",
    "Latest spring 2025 trends",
    "Sustainable fashion tips",
    "Budget-friendly outfit ideas",
    "What accessories are hot right now?",
    "Current shoe trends",
  ];

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .split("\n")
      .map((line, index) => (
        <div key={index} dangerouslySetInnerHTML={{ __html: line }} />
      ));
  };

  // Settings Modal
  const SettingsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-96 max-w-[90vw]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">API Settings</h3>
          <button
            onClick={() => setShowSettings(false)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Gemini API Key (Free)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">
                  How to get your free API key:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>
                    Visit{" "}
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Google AI Studio
                    </a>
                  </li>
                  <li>Sign in with your Google account</li>
                  <li>Click &quot;Create API Key&quot;</li>
                  <li>Copy and paste it here</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={saveApiKey}
              disabled={!apiKey.trim()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-pink-700 transition-colors"
            >
              Save API Key
            </button>
            <button
              onClick={() => setShowSettings(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl animate-bounce"
        >
          {/* Use Sparkles icon for a more attractive look */}
          <Sparkles size={32} className="drop-shadow-lg" />
          {/* AI Badge */}
          <span className="absolute top-1 -right-1 bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow">
            AI
          </span>
        </button>

        <div className="absolute -top-12 right-0 bg-black text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
          AI Fashion Trends
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex items-center justify-between rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-semibold">AI Fashion Trends</h3>
                <p className="text-sm opacity-90">
                  {apiKey ? "Real-time powered" : "Setup required"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSettings(true)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title="Settings"
              >
                <Settings size={16} />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                {isMinimized ? (
                  <Maximize2 size={16} />
                ) : (
                  <Minimize2 size={16} />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Container */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isBot ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`flex items-start gap-2 max-w-[85%] ${
                        message.isBot ? "flex-row" : "flex-row-reverse"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-full ${
                          message.isBot
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                            : "bg-gray-600 text-white"
                        }`}
                      >
                        {message.isBot ? <Bot size={16} /> : <User size={16} />}
                      </div>
                      <div
                        className={`p-3 rounded-2xl ${
                          message.isBot
                            ? "bg-white border border-gray-200 text-gray-800"
                            : "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        }`}
                      >
                        <div className="text-sm leading-relaxed">
                          {message.isBot
                            ? formatMessage(message.text)
                            : message.text}
                        </div>
                        <div
                          className={`text-xs mt-2 ${
                            message.isBot ? "text-gray-500" : "text-white/70"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-2">
                      <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        <Bot size={16} />
                      </div>
                      <div className="bg-white border border-gray-200 p-3 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              {messages.length <= 2 && (
                <div className="p-4 border-t border-gray-200 bg-white">
                  <p className="text-xs text-gray-600 mb-2">Try asking:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setInputMessage(question)}
                        className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs hover:bg-purple-200 transition-colors text-left"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
                <div className="flex gap-2">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about fashion trends..."
                    className="flex-1 text-sm resize-none border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent max-h-20"
                    rows={2}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-all duration-200"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {showSettings && <SettingsModal />}
    </>
  );
};

export default FashionTrendsChatbot;
