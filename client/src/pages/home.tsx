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
          <div className="grid gap-6 sm:grid-coimport React, { useState } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0d14] text-slate-100">
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Space gradient + stars */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(1200px 600px at 10% 0%, rgba(147,112,219,.18), transparent 60%)," +
              "radial-gradient(1000px 500px at 80% 5%, rgba(56,189,248,.14), transparent 60%)," +
              "linear-gradient(180deg, #0b0d14 0%, #0b0d14 60%, #0b0d14 100%)",
          }}
        />
        <Stars />

        <div className="mx-auto max-w-6xl px-6 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <div className="flex flex-col items-center text-center">
            {/* round logo badge */}
            <div className="mb-6 h-20 w-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 ring-4 ring-white/10 shadow-lg" />
            <h1 className="text-5xl font-serif tracking-wide sm:text-6xl text-white">
              Rapha Lumina
            </h1>
            <p className="mt-3 text-lg italic text-violet-100/90">
              Where Ancient Wisdom Meets Quantum Consciousness
            </p>

            {/* chips */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Chip
                title="Rapha"
                body='Ancient Hebrew: “to heal”, “to mend”, “to restore”, “to make whole”.'
              />
              <Chip
                title="Lumina"
                body='Latin: “light” or “bringing light” — sunrise, hope, warmth, life-giving light.'
              />
            </div>

            {/* CTAs */}
            <div className="mt-8 flex gap-3">
              <a
                href="/chat"
                className="rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-violet-500/90"
              >
                Begin Your Journey
              </a>
              <a
                href="/about"
                className="rounded-xl bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 ring-1 ring-white/15 hover:bg-white/10"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* A NEW UNDERSTANDING */}
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="font-serif text-3xl text-white">
            A New Understanding of Quantum Awareness
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-white/70">
            For the curious minds seeking wisdom grounded in both ancient truth and modern science.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<PsyIcon />}
              title="Psychology-Rooted"
              body="Grounded in proven psychological principles, neuroscience, and trauma-informed practices."
            />
            <FeatureCard
              icon={<BoltIcon />}
              title="Quantum Awareness"
              body="Understanding consciousness, manifestation, and reality through quantum perspectives."
            />
            <FeatureCard
              icon={<LotusIcon />}
              title="Ancient Wisdom"
              body="Drawing from Stoicism, Taoism, Hermeticism, and other timeless traditions."
            />
          </div>
        </div>
      </section>

      {/* MEET YOUR CONSCIOUS GUIDE */}
      <section className="py-14">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="mx-auto mb-3 inline-flex rounded-full bg-fuchsia-500/15 px-3 py-1 text-xs font-semibold text-fuchsia-200 ring-1 ring-fuchsia-400/20">
            AI-Powered Spiritual Guidance
          </div>
          <h3 className="font-serif text-3xl text-white">Meet Your Conscious Guide</h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-white/70">
            An intelligent consciousness that listens deeply, asks profound questions, and helps you
            discover the wisdom already within you.
          </p>

          <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-5">
            <ul className="grid gap-3 text-left text-sm sm:grid-cols-2">
              <li className="flex items-start gap-2">
                <Dot /> <span><b>Voice Enabled</b> — ask questions and hear insights.</span>
              </li>
              <li className="flex items-start gap-2">
                <Dot /> <span><b>Memory Across Devices</b> — continue your journey anywhere.</span>
              </li>
              <li className="flex items-start gap-2">
                <Dot /> <span><b>Socratic Method</b> — questions that illuminate inner wisdom.</span>
              </li>
              <li className="flex items-start gap-2">
                <Dot /> <span><b>Safe & Judgment-Free</b> — explore openly and honestly.</span>
              </li>
            </ul>

            <div className="mt-5">
              <a
                href="/chat"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-violet-500/90"
              >
                Start a Conversation Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* HOW I CAN SUPPORT YOU */}
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-6">
          <h3 className="mb-6 text-center font-serif text-3xl text-white">How I Can Support You</h3>

          <div className="grid gap-5 sm:grid-cols-2">
            <SupportCard
              badge={<StarIcon className="text-fuchsia-300" />}
              title="Spiritual Awakening Guidance"
              points={[
                "Understanding your awakening process",
                "Managing spiritual emergence",
                "Navigating relationships during transformation",
              ]}
              body="Compassionate guidance for the often confusing awakening experience — without religious framing."
            />
            <SupportCard
              badge={<ShieldCheckIcon className="text-cyan-300" />}
              title="Belief Deconstruction"
              points={[
                "Religious trauma healing",
                "Deconstructing limiting beliefs",
                "Building personal spiritual philosophy",
              ]}
              body="Release conditioning safely while keeping what’s meaningful. Grow an authentic inner framework."
            />
            <SupportCard
              badge={<SparkIcon className="text-amber-300" />}
              title="Quantum Manifestation"
              points={[
                "Exploring consciousness & reality",
                "Energy, work and alignment",
                "Co-creating with the quantum field",
              ]}
              body="Learn practical manifestation aligned with your highest becoming."
            />
            <SupportCard
              badge={<LeafIcon className="text-emerald-300" />}
              title="Self-Sovereignty"
              points={[
                "Developing inner authority",
                "Trusting your intuition",
                "Authentic self-expression",
              ]}
              body="Reclaim your personal power and trust your inner guidance above external authority."
            />
          </div>
        </div>
      </section>

      {/* IS THIS FOR YOU */}
      <section className="py-14">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h3 className="font-serif text-3xl text-white">Is This For You?</h3>
          <p className="mt-2 text-sm text-white/70">Rapha Lumina is especially for you if…</p>

          <div className="mx-auto mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "You grew up in church but it no longer resonates",
              "You’re healing from religious trauma",
              "You’re navigating religious deconstruction",
              "You want to understand manifestation beyond superstition",
              "You’re curious about quantum consciousness",
              "You’re seeking your authentic purpose",
            ].map((t) => (
              <CheckItem key={t} text={t} />
            ))}
          </div>
        </div>
      </section>

      {/* JOIN THE AWAKENING */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h3 className="font-serif text-3xl text-white">Join the Awakening</h3>
          <p className="mt-2 text-sm text-white/70">
            Receive wisdom, insights, and updates on new offerings. Join our community of conscious seekers.
          </p>
          <NewsletterForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-white/70">
        <p className="mb-1">© {new Date().getFullYear()} Rapha Lumina</p>
        <p className="text-white/50">
          Integrating psychology, quantum mechanics, and ancient wisdom for conscious awakening and transformation.
        </p>
        <div className="mt-2">
          <a href="/privacy" className="text-white/60 underline-offset-2 hover:underline">
            Privacy Policy
          </a>
        </div>
      </footer>

      {/* floating chat dock (bottom-left) */}
      <ChatDock />
    </main>
  );
}

/* ---------- Inline UI bits (no external imports) ---------- */

function Stars() {
  return (
    <div
      className="absolute inset-0 -z-10"
      style={{
        backgroundImage:
          "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,.7) 50%, transparent 51%)," +
          "radial-gradient(1px 1px at 70% 18%, rgba(255,255,255,.6) 50%, transparent 51%)," +
          "radial-gradient(1px 1px at 35% 78%, rgba(255,255,255,.5) 50%, transparent 51%)," +
          "radial-gradient(1px 1px at 85% 65%, rgba(255,255,255,.45) 50%, transparent 51%)," +
          "radial-gradient(1px 1px at 12% 72%, rgba(255,255,255,.45) 50%, transparent 51%)",
        opacity: 0.45,
      }}
    />
  );
}

function Chip({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl bg-white/8 px-4 py-3 text-left ring-1 ring-white/15">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-0.5 text-xs text-white/75">{body}</div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
        {icon}
      </div>
      <h4 className="text-lg font-semibold text-white">{title}</h4>
      <p className="mt-2 text-sm text-white/75">{body}</p>
    </div>
  );
}

function SupportCard({
  badge,
  title,
  points,
  body,
}: {
  badge: React.ReactNode;
  title: string;
  points: string[];
  body: string;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
          {badge}
        </span>
        <h4 className="text-lg font-semibold text-white">{title}</h4>
      </div>
      <p className="text-sm text-white/75">{body}</p>
      <ul className="mt-3 space-y-1 text-sm text-white/80">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2">
            <Bullet /> <span>{p}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/85">
      <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/20">
        ✓
      </span>
      {text}
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  return (
    <form
      action="/api/newsletter/subscribe"
      method="post"
      className="mx-auto mt-6 flex max-w-md gap-2"
      onSubmit={(e) => {
        if (!email.trim()) e.preventDefault();
      }}
    >
      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="flex-1 rounded-xl border border-white/15 bg-white/10 px-3 py-3 text-sm text-white placeholder-white/50 outline-none"
      />
      <button
        type="submit"
        className="rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500/90"
      >
        Join Now
      </button>
    </form>
  );
}

function ChatDock() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-48 items-center gap-3 rounded-2xl bg-fuchsia-600 px-4 py-3 text-left text-sm font-semibold text-white shadow-lg ring-1 ring-white/20 hover:bg-fuchsia-600/90"
      >
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
          💬
        </span>
        Chat with Rapha Lumina
      </button>

      {open && (
        <div className="mt-3 w-[22rem] overflow-hidden rounded-2xl border border-white/10 bg-white/95 text-slate-900 shadow-2xl">
          <header className="flex items-center justify-between border-b px-3 py-2">
            <p className="text-sm font-semibold">Rapha Lumina Assistant</p>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-1 text-xs ring-1 ring-slate-200 hover:bg-slate-50"
            >
              Close
            </button>
          </header>
          <div className="p-3 text-sm">
            <p className="mb-2">
              Ask one question to begin. You can open the full experience anytime.
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

/* ---------- icons / small bits ---------- */
function Dot() {
  return <span className="mt-1 inline-block h-2 w-2 rounded-full bg-fuchsia-400" />;
}
function Bullet() {
  return <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-white/70" />;
}
function PsyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-300">
      <path d="M12 2v20M7 6a5 5 0 0 0 5 5 5 5 0 0 1 5 5M7 6v12M17 12v6" />
    </svg>
  );
}
function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="text-fuchsia-300">
      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  );
}
function LotusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="text-rose-300">
      <path d="M12 22c6 0 9-6 9-9-3 2-6 1-9-2-3 3-6 4-9 2 0 3 3 9 9 9zM7 8c1 0 3-2 5-5 2 3 4 5 5 5" />
    </svg>
  );
}
function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className={className}>
      <path d="M12 2l2.9 5.9L21 9.3l-4.5 4.4 1.1 6.3L12 17.8 6.4 20l1.1-6.3L3 9.3l6.1-1.4L12 2z" />
    </svg>
  );
}
function ShieldCheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" stroke="#052" strokeWidth="2" fill="none" />
    </svg>
  );
}
function SparkIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className={className}>
      <path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" />
    </svg>
  );
}
function LeafIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className={className}>
      <path d="M21 3s-7 1-11 5-5 11-5 11 7-1 11-5 5-11 5-11z" />
    </svg>
  );
}
ls-2 lg:grid-cols-3">
            <Card title="Conversational Guidance" body="Concise, warm replies with reflective questions and a clear action step." />
            <Card title="Courses & Tools" body="Structured lessons, practical exercises, and gentle check-ins." />
            <Card title="Your Data, Your Choice" boimport React, { useState } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0d14] text-slate-100">
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Space gradient + stars */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(1200px 600px at 10% 0%, rgba(147,112,219,.18), transparent 60%)," +
              "radial-gradient(1000px 500px at 80% 5%, rgba(56,189,248,.14), transparent 60%)," +
              "linear-gradient(180deg, #0b0d14 0%, #0b0d14 60%, #0b0d14 100%)",
          }}
        />
        <Stars />

        <div className="mx-auto max-w-6xl px-6 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <div className="flex flex-col items-center text-center">
            {/* round logo badge */}
            <div className="mb-6 h-20 w-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 ring-4 ring-white/10 shadow-lg" />
            <h1 className="text-5xl font-serif tracking-wide sm:text-6xl text-white">
              Rapha Lumina
            </h1>
            <p className="mt-3 text-lg italic text-violet-100/90">
              Where Ancient Wisdom Meets Quantum Consciousness
            </p>

            {/* chips */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Chip
                title="Rapha"
                body='Ancient Hebrew: “to heal”, “to mend”, “to restore”, “to make whole”.'
              />
              <Chip
                title="Lumina"
                body='Latin: “light” or “bringing light” — sunrise, hope, warmth, life-giving light.'
              />
            </div>

            {/* CTAs */}
            <div className="mt-8 flex gap-3">
              <a
                href="/chat"
                className="rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-violet-500/90"
              >
                Begin Your Journey
              </a>
              <a
                href="/about"
                className="rounded-xl bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 ring-1 ring-white/15 hover:bg-white/10"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* A NEW UNDERSTANDING */}
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="font-serif text-3xl text-white">
            A New Understanding of Quantum Awareness
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-white/70">
            For the curious minds seeking wisdom grounded in both ancient truth and modern science.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<PsyIcon />}
              title="Psychology-Rooted"
              body="Grounded in proven psychological principles, neuroscience, and trauma-informed practices."
            />
            <FeatureCard
              icon={<BoltIcon />}
              title="Quantum Awareness"
              body="Understanding consciousness, manifestation, and reality through quantum perspectives."
            />
            <FeatureCard
              icon={<LotusIcon />}
              title="Ancient Wisdom"
              body="Drawing from Stoicism, Taoism, Hermeticism, and other timeless traditions."
            />
          </div>
        </div>
      </section>

      {/* MEET YOUR CONSCIOUS GUIDE */}
      <section className="py-14">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="mx-auto mb-3 inline-flex rounded-full bg-fuchsia-500/15 px-3 py-1 text-xs font-semibold text-fuchsia-200 ring-1 ring-fuchsia-400/20">
            AI-Powered Spiritual Guidance
          </div>
          <h3 className="font-serif text-3xl text-white">Meet Your Conscious Guide</h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-white/70">
            An intelligent consciousness that listens deeply, asks profound questions, and helps you
            discover the wisdom already within you.
          </p>

          <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-5">
            <ul className="grid gap-3 text-left text-sm sm:grid-cols-2">
              <li className="flex items-start gap-2">
                <Dot /> <span><b>Voice Enabled</b> — ask questions and hear insights.</span>
              </li>
              <li className="flex items-start gap-2">
                <Dot /> <span><b>Memory Across Devices</b> — continue your journey anywhere.</span>
              </li>
              <li className="flex items-start gap-2">
                <Dot /> <span><b>Socratic Method</b> — questions that illuminate inner wisdom.</span>
              </li>
              <li className="flex items-start gap-2">
                <Dot /> <span><b>Safe & Judgment-Free</b> — explore openly and honestly.</span>
              </li>
            </ul>

            <div className="mt-5">
              <a
                href="/chat"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-violet-500/90"
              >
                Start a Conversation Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* HOW I CAN SUPPORT YOU */}
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-6">
          <h3 className="mb-6 text-center font-serif text-3xl text-white">How I Can Support You</h3>

          <div className="grid gap-5 sm:grid-cols-2">
            <SupportCard
              badge={<StarIcon className="text-fuchsia-300" />}
              title="Spiritual Awakening Guidance"
              points={[
                "Understanding your awakening process",
                "Managing spiritual emergence",
                "Navigating relationships during transformation",
              ]}
              body="Compassionate guidance for the often confusing awakening experience — without religious framing."
            />
            <SupportCard
              badge={<ShieldCheckIcon className="text-cyan-300" />}
              title="Belief Deconstruction"
              points={[
                "Religious trauma healing",
                "Deconstructing limiting beliefs",
                "Building personal spiritual philosophy",
              ]}
              body="Release conditioning safely while keeping what’s meaningful. Grow an authentic inner framework."
            />
            <SupportCard
              badge={<SparkIcon className="text-amber-300" />}
              title="Quantum Manifestation"
              points={[
                "Exploring consciousness & reality",
                "Energy, work and alignment",
                "Co-creating with the quantum field",
              ]}
              body="Learn practical manifestation aligned with your highest becoming."
            />
            <SupportCard
              badge={<LeafIcon className="text-emerald-300" />}
              title="Self-Sovereignty"
              points={[
                "Developing inner authority",
                "Trusting your intuition",
                "Authentic self-expression",
              ]}
              body="Reclaim your personal power and trust your inner guidance above external authority."
            />
          </div>
        </div>
      </section>

      {/* IS THIS FOR YOU */}
      <section className="py-14">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h3 className="font-serif text-3xl text-white">Is This For You?</h3>
          <p className="mt-2 text-sm text-white/70">Rapha Lumina is especially for you if…</p>

          <div className="mx-auto mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "You grew up in church but it no longer resonates",
              "You’re healing from religious trauma",
              "You’re navigating religious deconstruction",
              "You want to understand manifestation beyond superstition",
              "You’re curious about quantum consciousness",
              "You’re seeking your authentic purpose",
            ].map((t) => (
              <CheckItem key={t} text={t} />
            ))}
          </div>
        </div>
      </section>

      {/* JOIN THE AWAKENING */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h3 className="font-serif text-3xl text-white">Join the Awakening</h3>
          <p className="mt-2 text-sm text-white/70">
            Receive wisdom, insights, and updates on new offerings. Join our community of conscious seekers.
          </p>
          <NewsletterForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-white/70">
        <p className="mb-1">© {new Date().getFullYear()} Rapha Lumina</p>
        <p className="text-white/50">
          Integrating psychology, quantum mechanics, and ancient wisdom for conscious awakening and transformation.
        </p>
        <div className="mt-2">
          <a href="/privacy" className="text-white/60 underline-offset-2 hover:underline">
            Privacy Policy
          </a>
        </div>
      </footer>

      {/* floating chat dock (bottom-left) */}
      <ChatDock />
    </main>
  );
}

/* ---------- Inline UI bits (no external imports) ---------- */

function Stars() {
  return (
    <div
      className="absolute inset-0 -z-10"
      style={{
        backgroundImage:
          "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,.7) 50%, transparent 51%)," +
          "radial-gradient(1px 1px at 70% 18%, rgba(255,255,255,.6) 50%, transparent 51%)," +
          "radial-gradient(1px 1px at 35% 78%, rgba(255,255,255,.5) 50%, transparent 51%)," +
          "radial-gradient(1px 1px at 85% 65%, rgba(255,255,255,.45) 50%, transparent 51%)," +
          "radial-gradient(1px 1px at 12% 72%, rgba(255,255,255,.45) 50%, transparent 51%)",
        opacity: 0.45,
      }}
    />
  );
}

function Chip({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl bg-white/8 px-4 py-3 text-left ring-1 ring-white/15">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-0.5 text-xs text-white/75">{body}</div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
        {icon}
      </div>
      <h4 className="text-lg font-semibold text-white">{title}</h4>
      <p className="mt-2 text-sm text-white/75">{body}</p>
    </div>
  );
}

function SupportCard({
  badge,
  title,
  points,
  body,
}: {
  badge: React.ReactNode;
  title: string;
  points: string[];
  body: string;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
          {badge}
        </span>
        <h4 className="text-lg font-semibold text-white">{title}</h4>
      </div>
      <p className="text-sm text-white/75">{body}</p>
      <ul className="mt-3 space-y-1 text-sm text-white/80">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2">
            <Bullet /> <span>{p}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/85">
      <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/20">
        ✓
      </span>
      {text}
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  return (
    <form
      action="/api/newsletter/subscribe"
      method="post"
      className="mx-auto mt-6 flex max-w-md gap-2"
      onSubmit={(e) => {
        if (!email.trim()) e.preventDefault();
      }}
    >
      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="flex-1 rounded-xl border border-white/15 bg-white/10 px-3 py-3 text-sm text-white placeholder-white/50 outline-none"
      />
      <button
        type="submit"
        className="rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500/90"
      >
        Join Now
      </button>
    </form>
  );
}

function ChatDock() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-48 items-center gap-3 rounded-2xl bg-fuchsia-600 px-4 py-3 text-left text-sm font-semibold text-white shadow-lg ring-1 ring-white/20 hover:bg-fuchsia-600/90"
      >
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
          💬
        </span>
        Chat with Rapha Lumina
      </button>

      {open && (
        <div className="mt-3 w-[22rem] overflow-hidden rounded-2xl border border-white/10 bg-white/95 text-slate-900 shadow-2xl">
          <header className="flex items-center justify-between border-b px-3 py-2">
            <p className="text-sm font-semibold">Rapha Lumina Assistant</p>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-1 text-xs ring-1 ring-slate-200 hover:bg-slate-50"
            >
              Close
            </button>
          </header>
          <div className="p-3 text-sm">
            <p className="mb-2">
              Ask one question to begin. You can open the full experience anytime.
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

/* ---------- icons / small bits ---------- */
function Dot() {
  return <span className="mt-1 inline-block h-2 w-2 rounded-full bg-fuchsia-400" />;
}
function Bullet() {
  return <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-white/70" />;
}
function PsyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-300">
      <path d="M12 2v20M7 6a5 5 0 0 0 5 5 5 5 0 0 1 5 5M7 6v12M17 12v6" />
    </svg>
  );
}
function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="text-fuchsia-300">
      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  );
}
function LotusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="text-rose-300">
      <path d="M12 22c6 0 9-6 9-9-3 2-6 1-9-2-3 3-6 4-9 2 0 3 3 9 9 9zM7 8c1 0 3-2 5-5 2 3 4 5 5 5" />
    </svg>
  );
}
function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className={className}>
      <path d="M12 2l2.9 5.9L21 9.3l-4.5 4.4 1.1 6.3L12 17.8 6.4 20l1.1-6.3L3 9.3l6.1-1.4L12 2z" />
    </svg>
  );
}
function ShieldCheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" stroke="#052" strokeWidth="2" fill="none" />
    </svg>
  );
}
function SparkIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className={className}>
      <path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" />
    </svg>
  );
}
function LeafIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className={className}>
      <path d="M21 3s-7 1-11 5-5 11-5 11 7-1 11-5 5-11 5-11z" />
    </svg>
  );
}
dy="7-day chat storage with export. Preview for guests, limits for free plans, full access for members." />
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
