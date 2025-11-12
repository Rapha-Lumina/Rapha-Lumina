"use client";
import React, { useState } from "react";

export default function FloatingChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "fixed", right: "1.25rem", bottom: "1.25rem", zIndex: 50 }}>
      <button
        aria-label="Open chat"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg ring-1 ring-slate-200 hover:shadow-xl"
        title={open ? "Close chat" : "Open chat"}
      >
        {/* chat bubble */}
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        </svg>
      </button>

      {open && (
        <div className="mt-3 w-[22rem] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <header className="flex items-center justify-between border-b px-3 py-2">
            <p className="text-sm font-semibold">Rapha Lumina</p>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-1 text-xs ring-1 ring-slate-200 hover:bg-slate-50"
            >
              Close
            </button>
          </header>
          <div className="p-3 text-sm text-slate-700">
            <p className="mb-2 font-medium">Do you have burning questions about life?</p>
            <p className="mb-3">
              Get gentle, practical spiritual guidance. Ask one question to begin and follow the next small action.
            </p>
            <a
              href="/chat"
              className="block rounded-lg bg-slate-900 px-3 py-2 text-center text-white hover:bg-slate-800"
            >
              Go to full chat
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
