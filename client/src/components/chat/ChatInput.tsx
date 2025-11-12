import React, { useEffect, useMemo, useRef, useState } from "react";
import ChatHeader from "../components/chat/ChatHeader";
import ChatMessage from "../components/chat/ChatMessage";
import ChatInput from "../components/chat/ChatInput";

export type Role = "user" | "assistant" | "system";
export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: string; // ISO
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [folderOpen, setFolderOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const canExport = messages.length > 0;

  useEffect(() => {
    fetch("/api/chats/current", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => setMessages(data.messages ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const exportText = useMemo(
    () =>
      messages
        .map(
          (m) =>
            `[${new Date(m.createdAt).toLocaleString()}] ${m.role.toUpperCase()}:\n${m.content}`
        )
        .join("\n\n"),
    [messages]
  );

  async function handleSend(text: string) {
    setLoading(true);
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ messages: [...messages, userMsg].slice(-15) }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Request failed: ${res.status}`);
      }
      const data = await res.json();
      const assistantMsg: Message = {
        id: data.id,
        role: "assistant",
        content: data.content,
        createdAt: data.createdAt,
      };
      setMessages((m) => [...m, assistantMsg]);
    } catch (e: any) {
      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: e?.message || "Something went wrong. Please try again.",
        createdAt: new Date().toISOString(),
      };
      setMessages((m) => [...m, assistantMsg]);
    } finally {
      setLoading(false);
    }
  }

  async function handleExport() {
    const res = await fetch("/api/chats/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ format: "txt", content: exportText }),
    });
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rapha-lumina-chat-${new Date().toISOString().slice(0, 10)}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-3rem)] max-w-6xl gap-4 px-4 py-4">
      {/* Folder pane */}
      <aside className="hidden w-72 shrink-0 md:block">
        <div className="sticky top-4 rounded-2xl border p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">My Chat Folder (7-day storage)</h2>
            <button onClick={() => setFolderOpen((v) => !v)} className="text-xs underline">
              {folderOpen ? "Hide" : "Show"}
            </button>
          </div>

          {folderOpen && (
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                Chats are stored for 7 days only. Please export to save them permanently.
              </p>
              <button
                onClick={handleExport}
                disabled={!canExport}
                className="w-full rounded-lg bg-gray-900 px-3 py-2 text-white disabled:opacity-50"
              >
                Export / Download
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Chat area */}
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border">
        <ChatHeader />
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((m) => (
            <ChatMessage key={m.id} role={m.role} content={m.content} createdAt={m.createdAt} />
          ))}
          <div ref={bottomRef} />
        </div>
        <ChatInput onSend={handleSend} loading={loading} />
        <footer className="border-t bg-gray-50 px-4 py-2 text-center text-xs text-gray-600">
          Guests: 2 chats total. Free: 5 chats/day. Paid: unlimited.
        </footer>
      </section>
    </div>
  );
}
