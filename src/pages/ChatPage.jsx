import React, { useState } from "react";
import ChatMessage from "../components/ChatMessage.jsx";
import ChatInput from "../components/ChatInput.jsx";
import { v4 as uuidv4 } from "uuid";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Olá! Como posso ajudar hoje?" },
  ]);
  const [loading, setLoading] = useState(false);
  const [draggedImage, setDraggedImage] = useState(null);
  const [conversationId] = useState(uuidv4());

  const handleSend = async (message) => {
    setMessages((prev) => [...prev, { role: "user", ...message }]);
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: message.text || null,
          image: message.image || null,
        }),
      });

      const data = await response.json();

      // ✅ Se o backend retornar um link de download
      if (data.downloadUrl) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: data.reply,
            downloadUrl: data.downloadUrl, // passa o link
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: data.reply },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Erro ao se comunicar com o servidor." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Drag & Drop (arrastar imagem para o chat)
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    setDraggedImage(previewURL);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* 🧠 Área das mensagens */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map((m, i) => (
          <ChatMessage
            key={i}
            role={m.role}
            text={m.text}
            image={m.image}
            downloadUrl={m.downloadUrl} // ✅ agora o botão aparece
          />
        ))}

        {loading && (
          <div className="text-gray-500 dark:text-gray-400 italic">
            Digitando...
          </div>
        )}
      </div>

      {/* 📸 Campo de entrada com imagem arrastada */}
      <ChatInput
        onSend={handleSend}
        preloadedImage={draggedImage}
        onClearImage={() => setDraggedImage(null)}
      />
    </div>
  );
}
