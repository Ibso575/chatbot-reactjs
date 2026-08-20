import React, { useState } from "react";
import Chatboticon from "./components/chatboticon";
import Chatform from "./components/chatform";
import ChatMessage from "./components/ChatMessage";

const App = () => {
  const [chathistory, setchathistory] = useState([]);

  const generateborresponse = (history) =>{
console.log(history);

  }

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
          <Chatform chathistory={chathistory} setchathistory={setchathistory} generateborresponse={generateborresponse} />
        </div>
      </div>
    </div>
  );
};

export default App;
