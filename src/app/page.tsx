'use client'

import { useState, useEffect, useRef } from 'react';

type ChatMessageProps = {
  role: string;
  content: string;
};

function ChatMessage({ role, content }: ChatMessageProps) {
  const displayName = role === "assistant" ? "StarterSupport" : "User";
  return (
    <div className="flex items-start">
      <div className={`w-8 h-8 rounded-full flex-shrink-0 ${role === "assistant" ? "bg-gray-700" : "bg-purple-700"}`}></div>
      <div className="ml-3">
        <p className="font-semibold mb-1">{displayName}</p>
        <div className={`bg-gray-800 rounded-2xl rounded-tl-none p-3 ${role === "assistant" ? "text-white" : "text-gray-300"}`}>
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessageProps[]>([
    {
      role: "assistant",
      content: "Hello there!👋 I am StarterSupport, here to answer questions you may have regarding the product or your order."
    },
  ]);

  const [retrieveMode, setRetrieveMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = (userMessage?: string) => {
    const trimmedInput = userMessage || inputValue.trim();
  
    if (trimmedInput === '') return;

    console.log(`mode: ${retrieveMode}`)
  
    if (retrieveMode) {
      // Handle order retrieval mode
      handleOrderNumberSubmission(trimmedInput);
    } else {
      // Handle regular FAQ mode
      setMessages(prevMessages => [
        ...prevMessages,
        { role: "user", content: trimmedInput },
      ]);
  
      fetch('https://ai-customer-support-432321.ue.r.appspot.com/faq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, { role: "user", content: trimmedInput }] }),
      })
        .then(response => response.json())
        .then(data => {
          setMessages(prevMessages => [
            ...prevMessages,
            { role: "assistant", content: data.message || "Sorry, I couldn't find an answer to that." },
          ]);
        })
        .catch(error => {
          console.error('Error:', error);
          setMessages(prevMessages => [
            ...prevMessages,
            { role: "assistant", content: "Something went wrong. Please try again later." },
          ]);
        });
    }
  
    setInputValue('');
  };

  const handleOrderNumberSubmission = (orderNumber: string) => {
    setMessages(prevMessages => [
      ...prevMessages,
      { role: "user", content: orderNumber },
      // { role: "assistant", content: "Retrieving your order information..." },
    ]);

    fetch('https://ai-customer-support-432321.ue.r.appspot.com/order-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ order_id: orderNumber }),
    })
      .then(response => response.json())
      .then(data => {
        setMessages(prevMessages => [
          ...prevMessages,
          { role: "assistant", content: data.message || "I couldn't retrieve your order information. Please check your order number and try again." },
        ]);
        setRetrieveMode(false); // Switch back to FAQ mode
      })
      .catch(error => {
        console.error('Error:', error);
        setMessages(prevMessages => [
          ...prevMessages,
          { role: "assistant", content: "Something went wrong. Please try again later." },
        ]);
        setRetrieveMode(false); // Switch back to FAQ mode
      });
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 to-black min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-3xl w-full max-w-md overflow-hidden shadow-xl flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 bg-gray-800">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <h2 className="text-white font-semibold">StarterSupport AI</h2>
          </div>
          <p className="text-gray-400 text-sm">Ready to help</p>
        </div>

        {/* Chat area */}
        <div className="chat p-4 space-y-4 flex-1 min-h-[60dvh] max-h-[60dvh] overflow-y-auto">
          {messages.map((message, index) => (
            <ChatMessage key={index} role={message.role} content={message.content} />
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* AI options */}
        <div className="p-4 pb-3">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => {
                setRetrieveMode(true);
                handleSendMessage("Could you provide my order information?");
              }} 
              className="w-full text-left bg-purple-800 hover:bg-opacity-75 bg-opacity-45 text-fuchsia-400 rounded-xl px-3 py-2 transition-colors flex gap-2 items-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              Retrieve order information
            </button>
          </div>
        </div>

        {/* Input area */}
        <div className="p-4 bg-gray-800 flex items-center">
          <input 
            type="text" 
            className="flex-grow bg-gray-700 rounded-l-full px-4 py-2 text-white focus:outline-none" 
            placeholder="Type your message..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyUp={handleKeyPress}
          />
          <button 
            className="bg-purple-600 rounded-r-full p-2 text-white"
            onClick={() => handleSendMessage}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
