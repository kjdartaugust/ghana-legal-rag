"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";
import { Logo } from "../components/Logo";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const DOC_NAMES: Record<string, string> = {
  "1992-CONSTITUTION-OF-THE-REPUBLIC-OF-GHANA": "1992 Constitution",
  "COMPANIES-ACT-2019-ACT-992": "Companies Act 2019",
  "LABOUR-ACT-2003-ACT-651": "Labour Act 2003",
};

function normalizeDoc(raw: string): string {
  const key = raw.trim().replace(/\.pdf$/i, "").toUpperCase();
  return DOC_NAMES[key] ?? raw.trim();
}

function parseMessage(content: string): { text: string; sources: string[] } {
  const match = content.match(/\nSource:\s*(.+)$/);
  if (!match) return { text: content.trim(), sources: [] };

  const rawText = content.slice(0, match.index).trim();
  const text = rawText.replace(
    /\[([^\]]+\.pdf)\]/gi,
    (_, f) => `[${normalizeDoc(f)}]`
  );
  const sources = match[1]
    .split(/[;,]/)
    .map(normalizeDoc)
    .filter((s) => s.length > 0);

  return { text, sources };
}

const STARTER_QUESTIONS = [
  "What's the minimum wage in Ghana?",
  "How do I register a company in Ghana?",
  "What are my rights if I'm arrested?",
  "How many days of annual leave am I entitled to?",
  "What is the legal age of employment?",
  "What happens if I'm dismissed without notice?",
];

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-xl bg-blue-900 text-white px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed">
          {msg.content}
        </div>
      </div>
    );
  }

  const { text, sources } = parseMessage(msg.content);

  return (
    <div className="flex justify-start">
      <div className="max-w-xl">
        <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed text-gray-800 shadow-sm whitespace-pre-wrap">
          {text}
        </div>
        {sources.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 ml-1">
            {sources.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full"
              >
                <span>📄</span> {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(questionOverride?: string) {
    const question = (questionOverride ?? input).trim();
    if (!question || loading) return;
    if (!questionOverride) setInput("");

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);

    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm">
        <Logo size="sm" />
        <UserButton />
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center mt-10 px-4">
            <p className="text-gray-400 text-sm mb-5">
              Ask anything about Ghanaian law — or try one of these:
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
              {STARTER_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="bg-white border border-gray-200 text-gray-700 text-sm px-4 py-2 rounded-full hover:border-blue-300 hover:text-blue-900 transition-colors shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}

        {loading && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-white px-4 pt-3 pb-2">
        <div className="flex gap-3 max-w-3xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a legal question… (Enter to send, Shift+Enter for new line)"
            rows={1}
            className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-blue-900 text-white rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-blue-800 transition-colors"
          >
            Send
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2 pb-1">
          Not legal advice — for informational purposes only
        </p>
      </div>
    </div>
  );
}
