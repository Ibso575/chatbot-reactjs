import React, { useRef } from "react";

const Chatform = () => {

const inputRef = useRef();

const handleformsubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if(!userMessage);

    console.log(userMessage);
    
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
