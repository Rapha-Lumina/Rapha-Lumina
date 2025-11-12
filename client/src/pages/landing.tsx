import React from "react";

export default function Landing() {
  return (
    <main className="min-h-screen bg-[#0b0d14] text-slate-100">
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(1200px 600px at 15% 0%, rgba(99,102,241,.18), transparent 60%)," +
              "radial-gradient(900px 500px at 80% 10%, rgba(16,185,129,.12), transparent 60%)," +
              "linear-gradient(180deg, #0b0d14 0%, #0b0d14 60%, #0b0d14 100%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-6 pt-28 pb-20 text-center">
          <h1 className="text-5xl font-serif text-white sm:text-6xl">Awaken. Expand. Remember.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Practical tools, gentle guidance, and courses for your inner journey — welcoming all paths, not affiliated with any religion.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <a href="/chat" className="rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-violet-500/90">
              Start a Conversation
            </a>
            <a href="/shop" className="rounded-xl bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 ring-1 ring-white/15 hover:bg-white/10">
              Explore Courses & Tools
            </a>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 sm:grid-cols-3">
          <Tile title="Conversational Guidance" body="Short, reflective replies plus an action step." />
          <Tile title="Courses & Tools" body="Structured lessons with gentle check-ins." />
          <Tile title="Your Data" body="7-day chat storage with export, members get full access." />
        </div>
      </section>
    </main>
  );
}

function Tile({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-white/80">{body}</p>
    </div>
  );
}
