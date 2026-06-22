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

function replaceInline(t: string): string {
  return t.replace(/\[([^\]]+\.pdf)\]/gi, (_, f) => `[${normalizeDoc(f)}]`);
}

function parseMessage(content: string): { text: string; sources: string[] } {
  const match = content.match(/[\n\r]*Source:\s*(.+)$/i);
  if (!match) return { text: replaceInline(content.trim()), sources: [] };
  const text = replaceInline(content.slice(0, match.index).trim());
  const sources = match[1].split(/[;,]/).map(normalizeDoc).filter(Boolean);
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

function SendIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-[#071e4a] flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
        G
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-message">
        <div className="flex gap-1.5 items-center">
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-dot-1" />
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-dot-2" />
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-dot-3" />
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  if (msg.role === "user") {
    return (
      <div className="flex items-end justify-end gap-2 animate-fade-up">
        <div className="max-w-lg bg-[#071e4a] text-white px-5 py-3.5 rounded-2xl rounded-br-sm text-sm leading-relaxed shadow-message">
          {msg.content}
        </div>
      </div>
    );
  }

  const { text, sources } = parseMessage(msg.content);

  return (
    <div className="flex items-start gap-3 animate-fade-up">
      <div className="w-8 h-8 rounded-full bg-[#071e4a] flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
        G
      </div>
      <div className="max-w-lg">
        <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-5 py-4 text-sm leading-relaxed text-slate-700 shadow-message whitespace-pre-wrap">
          {text}
        </div>
        {sources.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {sources.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full font-medium"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                {s}
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">

      {/* Header */}
      <header className="flex items-center justify-between px-6 h-16 bg-white border-b border-slate-100 shadow-sm flex-shrink-0">
        <Logo size="sm" />
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-xs text-slate-400 font-medium">Ghana Legal Assistant</span>
          <UserButton />
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">

          {messages.length === 0 && (
            <div className="flex flex-col items-center pt-8 animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-[#071e4a] flex items-center justify-center mb-5 shadow-card-md">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-[#071e4a] mb-1">Ask a legal question</h2>
              <p className="text-sm text-slate-500 mb-8 text-center max-w-sm">
                Get cited answers from the 1992 Constitution, Companies Act 2019, and Labour Act 2003.
              </p>
              <div className="flex flex-wrap justify-center gap-2 w-full">
                {STARTER_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="bg-white border border-slate-200 text-slate-600 text-xs font-medium px-4 py-2.5 rounded-xl hover:border-[#1a4a8a] hover:text-[#1a4a8a] hover:shadow-sm transition-all"
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
      </div>

      {/* Input bar */}
      <div className="flex-shrink-0 bg-white border-t border-slate-100 px-4 pt-4 pb-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-3 items-end bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-card focus-within:border-[#1a4a8a] focus-within:shadow-card-md transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a legal question… (Enter to send)"
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none leading-relaxed"
              disabled={loading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="flex-shrink-0 w-9 h-9 bg-[#071e4a] text-white rounded-xl flex items-center justify-center disabled:opacity-30 hover:bg-[#0d3875] transition-all hover:shadow-sm"
            >
              <SendIcon />
            </button>
          </div>
          <p className="text-center text-xs text-slate-400 mt-2">
            Not legal advice — for informational purposes only
          </p>
        </div>
      </div>

    </div>
  );
}
