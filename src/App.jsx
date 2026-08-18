import React from 'react';
import Chatboticon from './components/chatboticon';

const App = () => {
    return (
        <div className='container'>
            <div className="chatbot-popup">
                {/* chatbot header */}
               <div className='chat-header'>
                <div className='header-info'>
                    <Chatboticon/>
                    <h2 className="logo-text">Chatbot</h2>
                </div>
                <button className='material-symbols-rounded'>keyboard_arrow_down</button>
               </div>
               {/* chatbot-body */}
               <div className="chat-body">
                  <div className="message bot-message">
                    <Chatboticon/>
                    <p className='message-text'>
                        Hey there <br /> How can I help you?
                    </p>
                  </div>
                  <div className="message user-message">
                    <p className='message-text'>
                        Lorem ipsum dolor sit amet consectetur adipisicing.
                    </p>
                  </div>
               </div>
               {/* chat footer */}
               <div className="chat-footer">
                <form action="#" className="chat-form">
                    <input type="text" placeholder='message...' className="message-input" required/>
                    <button className='material-symbols-rounded'>keyboard_arrow_up</button>
                </form>
               </div>
            </div>
        </div>
    );
}

export default App;
