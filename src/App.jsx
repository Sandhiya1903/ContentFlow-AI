import { useState, useRef, useEffect } from "react";
import "./App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

  async function generateAnswer(e) {
    e.preventDefault();
    if (!question.trim()) return;

    setGeneratingAnswer(true);
    const currentQuestion = question;
    setQuestion(""); // Clear input immediately after sending

    // Add user question to chat history
    setChatHistory((prev) => [
      ...prev,
      { type: "question", content: currentQuestion },
    ]);

    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAv4tw_eVgV2JcUh6edeuoDDEfu3hdSdkg",
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      const aiResponse =
        response["data"]["candidates"][0]["content"]["parts"][0]["text"];
      setChatHistory((prev) => [
        ...prev,
        { type: "answer", content: aiResponse },
      ]);
      setAnswer(aiResponse);
    } catch (error) {
      console.log(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
    }
    setGeneratingAnswer(false);
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="h-full max-w-4xl mx-auto flex flex-col p-3">
        {/* Fixed Header */}
        <header className="text-center py-4">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <h1 className="text-4xl font-bold text-white hover:text-yellow-300 transition-colors animate-pulse">
              ContentFlow AI
            </h1>
          </a>
        </header>

        {/* Scrollable Chat Container - Updated className */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto mb-4 rounded-lg bg-white shadow-lg p-4 hide-scrollbar"
        >
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-8 max-w-2xl">
                <h2 className="text-2xl font-bold text-purple-600 mb-4">
                  Welcome to ContentFlow AI! 🎥✨
                </h2>
                <p className="text-gray-700 mb-4">
                  Empower your video content creation with AI-driven assistance.
                  Ask me about:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <span className="text-pink-500">📝</span> Script Writing
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <span className="text-pink-500">🎭</span> Storyboarding
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <span className="text-pink-500">🔍</span> SEO Optimization
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <span className="text-pink-500">💡</span> Content Ideas
                  </div>
                </div>
                <p className="text-gray-500 mt-6 text-sm">
                  Let's create engaging content together! Type your question
                  below and let the ideas flow.
                </p>
              </div>
            </div>
          ) : (
            <>
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    chat.type === "question" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block max-w-[80%] p-3 rounded-lg overflow-auto hide-scrollbar ${
                      chat.type === "question"
                        ? "bg-pink-500 text-white rounded-br-none"
                        : "bg-purple-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <ReactMarkdown className="overflow-auto hide-scrollbar">
                      {chat.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </>
          )}
          {generatingAnswer && (
            <div className="text-left">
              <div className="inline-block bg-purple-100 p-3 rounded-lg animate-pulse">
                Crafting content...
              </div>
            </div>
          )}
        </div>

        {/* Fixed Input Form */}
        <form
          onSubmit={generateAnswer}
          className="bg-white rounded-lg shadow-lg p-4"
        >
          <div className="flex gap-2">
            <textarea
              required
              className="flex-1 border border-gray-300 rounded p-3 focus:border-pink-400 focus:ring-1 focus:ring-pink-400 resize-none"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about script ideas, video concepts, or content strategies..."
              rows="2"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  generateAnswer(e);
                }
              }}
            ></textarea>
            <button
              type="submit"
              className={`px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-md hover:from-pink-600 hover:to-purple-700 transition-colors ${
                generatingAnswer ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={generatingAnswer}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
