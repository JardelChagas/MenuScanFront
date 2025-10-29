import React, { useState, useEffect, useRef } from "react";

export default function ChatInput({ onSend, preloadedImage, onClearImage }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const inputRef = useRef();

  // Carrega imagem pré-carregada (ex: do drag & drop no ChatPage)
  useEffect(() => {
    if (preloadedImage) setImage(preloadedImage);
  }, [preloadedImage]);

  // Trata paste de imagens
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const blob = items[i].getAsFile();
          handleImageChange(blob);
          e.preventDefault();
          break;
        }
      }
    };

    const inputEl = inputRef.current;
    inputEl.addEventListener("paste", handlePaste);
    return () => inputEl.removeEventListener("paste", handlePaste);
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!text.trim() && !image) return;

  let base64Image = null;
  if (image && image.startsWith("blob:")) {
    const blob = await fetch(image).then(r => r.blob());
    const reader = new FileReader();
    base64Image = await new Promise(resolve => {
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  onSend({ text, image: base64Image });
  setText("");
  setImage(null);
  if (onClearImage) onClearImage();
};

  const handleImageChange = (file) => {
    if (!file) return;
    const previewURL = URL.createObjectURL(file);
    setImage(previewURL);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <form
      ref={inputRef}
      onSubmit={handleSubmit}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="flex flex-col gap-2 p-3 border-t bg-white dark:bg-gray-800"
    >
      {image && (
        <div className="relative w-32 h-32">
          <img
            src={image}
            alt="preview"
            className="w-full h-full object-cover rounded-lg border"
          />
          <button
            type="button"
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
            onClick={() => {
              setImage(null);
              if (onClearImage) onClearImage();
            }}
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Envie uma mensagem..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(e.target.files[0])}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="bg-blue-500 text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-blue-600 transition"
        >
          📎
        </label>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition"
        >
          Enviar
        </button>
      </div>
    </form>
  );
}
