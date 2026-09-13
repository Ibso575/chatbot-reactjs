import { useEffect, useRef, useState } from "react";
import Chatboticon from "./components/chatboticon";
import Chatform from "./components/chatform";
import ChatMessage from "./components/ChatMessage";

const App = () => {
  const [chathistory, setchathistory] = useState([]);
  const [showchatbot, setshowchatbot] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const chatbodyref = useRef(null);
  const requestInProgress = useRef(false);

  const generatebotresponse = async (history) => {
    if (requestInProgress.current) return;
    requestInProgress.current = true;
    setIsGenerating(true);

    setchathistory((prev) => [
      ...prev,
      { role: "model", text: "Thinking...", iserror: false },
    ]);

    const recentHistory = history
      .filter(({ text }) => text && text !== "Thinking...")
      .slice(-4)
      .map(({ role, text }) => ({
        role: role === "assistant" ? "model" : role,
        parts: [{ text }],
      }));

    const requestoptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: recentHistory,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      }),
    };

    try {
      const apiKey = import.meta.env.VITE_API_KEY || "";
      const modelName = import.meta.env.VITE_GEMINI_MODEL || "gemini-3.6-flash";

      if (!apiKey) {
        throw new Error("VITE_API_KEY is missing. Add it to the .env file.");
      }

      const streamUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:streamGenerateContent?key=${apiKey}&alt=sse`;
      const response = await fetch(streamUrl, requestoptions);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Something went wrong";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData?.error?.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }

        if (errorMessage.toLowerCase().includes("quota") || errorMessage.toLowerCase().includes("exceeded")) {
          throw new Error("So‘rovlar soni oshib ketdi, iltimos 20 soniyadan so‘ng qayta urinib ko‘ring.");
        }

        throw new Error(errorMessage);
      }

      if (!response.body) {
        throw new Error("Gemini response body is empty.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulatedText = "";
      let buffer = "";

      const streamUpdate = async (chunk) => {
        const characters = Array.from(chunk);
        for (const char of characters) {
          accumulatedText += char;
          setchathistory((prev) => {
            const updated = [...prev];
            const lastMessage = updated[updated.length - 1];
            if (lastMessage && lastMessage.role === "model") {
              lastMessage.text = accumulatedText;
              lastMessage.iserror = false;
            }
            return updated;
          });

          await new Promise((resolve) => setTimeout(resolve, 12));
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() || "";

        for (const line of lines) {
          const cleanLine = line.trim();
          if (!cleanLine.startsWith("data: ")) continue;

          try {
            const safePayload = cleanLine.replace(/^data:\s*/, "").trim();
            if (!safePayload || safePayload === "[DONE]") continue;

            const json = JSON.parse(safePayload);
            const textChunk = json?.candidates?.[0]?.content?.parts?.[0]?.text || "";
            if (!textChunk) continue;

            await streamUpdate(textChunk);
          } catch {
            // Chala yoki noxos JSON tekshirilmaydi.
          }
        }
      }
    } catch (error) {
      const friendlyMessage = String(error?.message || "");
      const cleanErrorMessage =
        friendlyMessage.toLowerCase().includes("quota") ||
        friendlyMessage.toLowerCase().includes("exceeded")
          ? "So‘rovlar soni oshib ketdi, iltimos 20 soniyadan so‘ng qayta urinib ko‘ring."
          : friendlyMessage || "Server bilan bog'lanishda xatolik.";

      setchathistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "model",
          text: cleanErrorMessage,
          iserror: true,
        };
        return updated;
      });
    } finally {
      requestInProgress.current = false;
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    chatbodyref.current?.scrollTo({
      top: chatbodyref.current.scrollHeight,
      behavior: "auto",
    });
  }, [chathistory]);

  return (
    <div className={`container ${showchatbot ? "show-chatbot" : ""}`}>
      <button
        onClick={() => setshowchatbot((prev) => !prev)}
        id="chatbot-toggler"
      >
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-rounded">close</span>
      </button>
      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <Chatboticon />
            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button
            onClick={() => setshowchatbot((prev) => !prev)}
            className="material-symbols-rounded"
          >
            keyboard_arrow_down
          </button>
        </div>
        <div ref={chatbodyref} className="chat-body">
          <div className="message bot-message">
            <Chatboticon />
            <p className="message-text">
              Hey there <br /> How can I help you?
            </p>
          </div>
          {chathistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>
        <div className="chat-footer">
          <Chatform
            chathistory={chathistory}
            setchathistory={setchathistory}
            generateborresponse={generatebotresponse}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </div>
  );
};

export default App;