import React, { useState } from "react";
import Chatboticon from "./components/chatboticon";
import Chatform from "./components/chatform";
import ChatMessage from "./components/ChatMessage";

const App = () => {
  const [chathistory, setchathistory] = useState([]);

  const generatebotresponse = async (history) => {

    // help function to update chat history
    const updatehistory = (text) => {
      setchathistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text },
      ]);
    };

    // format chat history
    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

    const requestoptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL,
        requestoptions,
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error.message || "Something went wrong");

      const apiresponsetext = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
      updatehistory(apiresponsetext);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="chatbot-popup">
        {/* chatbot header */}
        <div className="chat-header">
          <div className="header-info">
            <Chatboticon />
            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button className="material-symbols-rounded">
            keyboard_arrow_down
          </button>
        </div>
        {/* chatbot-body */}
        <div className="chat-body">
          <div className="message bot-message">
            <Chatboticon />
            <p className="message-text">
              Hey there <br /> How can I help you?
            </p>
          </div>
          {/* render the chat history dynamically */}
          {chathistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>
        {/* chat footer */}
        <div className="chat-footer">
          <Chatform
            chathistory={chathistory}
            setchathistory={setchathistory}
            generateborresponse={generatebotresponse}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
