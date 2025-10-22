import React from "react";

export default function ChatMessage({ role, text, image }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[75%] p-3 rounded-2xl shadow
          ${isUser 
            ? "bg-blue-600 text-white dark:bg-blue-700" 
            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"}`}
      >
        {text && <div className="mb-2">{text}</div>}
        {image && (
          <img
            src={image}
            alt="chat-img"
            className="max-w-full max-h-80 rounded-lg object-cover"
          />
        )}
      </div>
    </div>
  );
}
