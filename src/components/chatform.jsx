import { useRef } from "react";

const Chatform = ({
  chathistory,
  setchathistory,
  generateborresponse,
  isGenerating,
}) => {

const inputRef = useRef();
const submittingRef = useRef(false);

const handleformsubmit = (e) => {
    e.preventDefault();
    if (submittingRef.current || isGenerating) return;

    const userMessage = inputRef.current.value.trim();
    if(!userMessage) return;
    submittingRef.current = true;
    inputRef.current.value = "";
 
    const nextHistory = [...chathistory, { role: "user", text: userMessage }];
    setchathistory(nextHistory);

    generateborresponse(nextHistory).finally(() => {
      submittingRef.current = false;
    });
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
      <button
        type="submit"
        className="material-symbols-rounded"
        disabled={isGenerating}
      >
        keyboard_arrow_up
      </button>
    </form>
  );
};

export default Chatform;
