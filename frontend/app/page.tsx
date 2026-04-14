"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import { getUserInfo } from "@/requests/api";
import ReactMarkdown from "react-markdown";
import {
  getCurrentSession,
  getSessionMessages,
  sendMessage,
} from "@/requests/api";

type Message = {
  id: number;
  chatSessionId: number;
  sender: "user" | "ai";
  content: string;
};

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const loadMessages = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const session = await getCurrentSession(token);

      if (session?.session_id) {
        const res = await getSessionMessages(token, session.session_id);
        console.log("Loaded messages:", res);
        setMessages(res.messages);
      } else {
        console.log("No active session found");
      }
    };

    loadMessages();
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);

    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      chatSessionId: 0,
      sender: "user",
      content: input,
    };

    const loadingMessage: Message = {
      id: Date.now() + 1,
      chatSessionId: 0,
      sender: "ai",
      content: "Fetching...",
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInput("");

    try {
      const res = await sendMessage(token, input);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? { ...msg, content: res.response }
            : msg,
        ),
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? { ...msg, content: "Error getting response." }
            : msg,
        ),
      );
      console.error("Failed to send message:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div>
      <Navbar
        username={username}
        onLogout={() => {
          localStorage.removeItem("auth_token");
          router.push("/login");
        }}
      />
      <div className="h-screen flex flex-col pt-22">
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`prose prose-sm px-4 py-2 rounded-2xl max-w-full wrap-break-words ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white prose-invert"
                      : "bg-white text-gray-800 shadow"
                  }`}
                >
                  {msg.content === "Fetching..." ? (
                    <span className="animate-pulse text-gray-400">
                      Fetching...
                    </span>
                  ) : (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  )}
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
              disabled={loading}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />

            <button
              onClick={handleSendMessage}
              disabled={loading}
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
