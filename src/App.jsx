import React, { useState, useEffect } from "react";
import ChatPage from "./pages/ChatPage.jsx";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Aplica a classe dark no <html>
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) html.classList.add("dark");
    else html.classList.remove("dark");
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">

      <ChatPage />
    </div>
  );
}
