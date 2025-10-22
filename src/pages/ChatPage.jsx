import React, { useState } from "react";
import ChatMessage from "../components/ChatMessage.jsx";
import ChatInput from "../components/ChatInput.jsx";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Olá! Como posso ajudar hoje?" },
  ]);
  const [loading, setLoading] = useState(false);
  const [draggedImage, setDraggedImage] = useState(null);

  const handleSend = async (message) => {
    const newMessages = [...messages, { role: "user", ...message }];
    setMessages(newMessages);

    // Se houver texto, chama a API
    if (message.text) {
      setLoading(true);
      try {
        const response = await fetch("https://sua-api-chat.com/respond", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages.filter(
              (m) => m.role === "user" || m.role === "assistant"
            ),
            userInput: message.text,
          }),
        });
        const data = await response.json();

        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: data.reply },
        ]);
      } catch (error) {
        console.error("Erro na API:", error);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: "Ocorreu um erro. Tente novamente." },
        ]);
      } finally {
        setLoading(false);
      }
    }

    // Se não houver texto (apenas imagem), envia mensagem padrão
    if (!message.text && message.image) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Imagem recebida!" },
      ]);
    }
  };

  // Drag & drop handlers no chat
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
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role} text={m.text} image={m.image} />
        ))}

        {loading && (
          <div className="text-gray-500 dark:text-gray-400 italic">Digitando...</div>
        )}
      </div>

      {/* Se arrastou uma imagem para o chat, mostra no input */}
      <ChatInput
        onSend={handleSend}
        preloadedImage={draggedImage}
        onClearImage={() => setDraggedImage(null)}
      />
    </div>
  );
}
