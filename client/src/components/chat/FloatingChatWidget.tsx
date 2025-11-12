"use client";
import React, { useState } from "react";

function FloatingChatWidgetImpl() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: "fixed", right: "1.5rem", bottom: "1.5rem", zIndex: 9999 }}>
      <button
        aria-label="Open chat"
        onClick={() => setIsOpen((v) => !v)}
        style={{
          height: "3.5rem",
          width: "3.5rem",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "9999px",
          background: "#fff",
          border: "1px solid rgba(0,0,0,0.1)",
          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
          cursor: "pointer",
        }}
        title={isOpen ? "Close chat widget" : "Open chat widget"}
      >
        <svg
          role="img"
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        </svg>
      </button>

      {isOpen && (
        <div
          style={{
            marginTop: "0.75rem",
            width: "22rem",
            overflow: "hidden",
            borderRadius: "1rem",
            border: "1px solid rgba(0,0,0,0.1)",
            background: "#fff",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          }}
        >
          <header
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
              padding: "0.5rem 0.75rem",
            }}
          >
            <p style={{ fontSize: "0.875rem", fontWeight: 600, margin: 0 }}>Rapha Lumina Assistant</p>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                borderRadius: "0.375rem",
                padding: "0.25rem 0.5rem",
                fontSize: "0.75rem",
                border: "1px solid rgba(0,0,0,0.1)",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </header>

          <div style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#374151" }}>
            <p style={{ marginTop: 0, marginBottom: "0.5rem" }}>
              Curious about purpose, patterns, or next steps? Ask one question to begin.
            </p>
            <a
              href="/chat"
              style={{
                display: "block",
                textAlign: "center",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.5rem",
                background: "#111827",
                color: "#fff",
                textDecoration: "none",
              }}
            >
              Go to full chat
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export const FloatingChatWidget = FloatingChatWidgetImpl;
export default FloatingChatWidgetImpl;
