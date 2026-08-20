import React, { useRef } from "react";

const Chatform = ({ chathistory,setchathistory,generateborresponse}) => {

const inputRef = useRef();

const handleformsubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if(!userMessage) return;
    inputRef.current.value = "";
 
    // update chat history with user's message
    setchathistory(history => [...history,{role:"user",text:userMessage}]);

// add a thingking ... bot's response
    setTimeout(() => setchathistory(history => [...history,{role:"model",text:"Thinking..."}]),600);

    // call the function to generate the bot's response
    generateborresponse([...chathistory,{role:"user",text:userMessage}]);
}

  return (
    <form action="#" className="chat-form" onSubmit={handleformsubmit}>
      <input
      ref={inputRef}
        type="text"
        placeholder="message..."
        className="message-input"
        required
      />
      <button className="material-symbols-rounded">keyboard_arrow_up</button>
    </form>
  );
};

export default Chatform;
