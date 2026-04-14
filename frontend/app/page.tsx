"use client";

import {useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import { getUserInfo } from "@/requests/api";
import { getCurrentSession, getSessionMessages, sendMessage } from "@/requests/api";

type Message = {
  id: number;
  chatSessionId: number;
  sender: "user" | "ai";
  content: string;
};

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const userResponse = await getUserInfo(token);

      if (userResponse.username) {
        setUsername(userResponse.username);
      } else {
        localStorage.removeItem("auth_token");
        router.push("/login");
      }
    } catch (err) {
      localStorage.removeItem("auth_token");
      alert("Failed to fetch user info " + err);
      router.push("/login");
    }
  };

  fetchUser();

  }, [router]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      text: input,
      sender: "user",
    };

    const botMessage: Message = {
      text: "This is a bot reply 🤖",
      sender: "ai",
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  };

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div>
      <Navbar username={username} onLogout={() => {
        localStorage.removeItem("auth_token");
        router.push("/login");
      }} />
      <div className="h-screen flex flex-col pt-18">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.text + msg.sender}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs wrap-break-words ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800 shadow"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-s-gray-400 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
