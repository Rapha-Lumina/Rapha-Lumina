import React, { useEffect, useRef, useState } from "react";

type Role = "user" | "assistant";
type Message = { id: string; role: Role; content: string; createdAt: string };

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const content = text.trim();
    if (!content || loading) return;
    setLoading(true);

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content, createdAt: new Date().toISOString() };
    setMessages((m) => [...m, userMsg]);
    setText("");

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content, history: [...messages, userMsg].slice(-15) }),
      });

      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        setMessages((m) => [
          ...m,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: err?.message || "Couldn’t respond right now. Try again.",
            createdAt: new Date().toISOString(),
          },
        ]);
        setLoading(false);
        return;
      }

      const data = await r.json();
      setMessages((m) => [
        ...m,
        { id: String(data.id || crypto.randomUUID()), role: "assistant", content: data.content, createdAt: data.createdAt || new Date().toISOString() },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "assistant", content: "Network issue. Please retry.", createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-5xl flex-col gap-4 p-4">
      <header className="rounded-2xl border p-4">
        <h1 className="text-base font-semibold">Rapha Lumina Chat</h1>
        <p className="text-xs text-gray-600">
          Replies are short, reflective, and end with one next step. 7-day chat storage with export.
        </p>
      </header>

      <section className="flex-1 space-y-4 overflow-y-auto rounded-2xl border p-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${m.role === "user" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
              <div className="mb-1 text-[10px] opacity-60">{new Date(m.createdAt).toLocaleString()}</div>
              <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </section>

      <form
        className="flex items-end gap-2 rounded-2xl border p-3"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <textarea
          className="min-h-[44px] flex-1 resize-none rounded-xl border px-3 py-2 text-sm focus:outline-none"
          placeholder="Ask anything…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={1}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Thinking…" : "Send"}
        </button>
      </form>
    </main>
  );
}
