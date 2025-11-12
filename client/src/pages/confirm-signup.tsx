import React, { useState } from "react";
import FloatingChatWidget from "@/components/FloatingChatWidget"; // if you don’t use aliases, change to ../components/FloatingChatWidget

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section className="relative isolate overflow-hidden py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
              Where Ancient Wisdom Meets Quantum Clarity
            </h1>
            <p className="mt-6 text-lg leading-7 text-gray-700">
              Rapha Lumina supports your inner journey with practical tools, courses, and a conversational guide.
              We welcome all paths of growth and learning, and we are <span className="font-semibold">not affiliated
              with any religion</span>. Your path is yours to choose.
            </p>

            <div className="mt-10 flex items-center justify-center gap-4">
              <a href="/chat" className="rounded-xl bg-gray-900 px-6 py-3 text-base font-semibold text-white shadow hover:bg-gray-800">
                Start a conversation
              </a>
              <a href="/shop" className="rounded-xl px-6 py-3 text-base font-semibold shadow-sm ring-1 ring-gray-200 hover:shadow">
                Explore resources
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card title="Conversational Guidance" body="Concise, warm replies with reflective questions and a clear action step." />
            <Card title="Courses & Tools" body="Structured lessons, practical exercises, and gentle check-ins." />
            <Card title="Your Data, Your Choice" body="7-day chat storage with export. Preview for guests, limits for free plans, full access for members." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold">Begin your next chapter</h2>
          <p className="mt-3 text-gray-700">
            Join free to save more chats, or become a member for unlimited guidance and premium resources.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a href="/signup" className="rounded-xl bg-gray-900 px-6 py-3 text-base font-semibold text-white shadow hover:bg-gray-800">Create a free account</a>
            <a href="/pricing" className="rounded-xl px-6 py-3 text-base font-semibold shadow-sm ring-1 ring-gray-200 hover:shadow">See membership options</a>
          </div>
        </div>
      </section>

      <FloatingChatWidget />
    </main>
  );
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-gray-700">{body}</p>
    </div>
  );
}
