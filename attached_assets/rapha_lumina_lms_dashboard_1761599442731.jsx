import React, { useEffect, useMemo, useRef, useState } from "react";

// Rapha Lumina LMS Dashboard
// Now with: API fetch, currency toggle, brand styling, progress + Continue Learning
// Drop this file into your Next.js/React app and render <LMSDashboard /> at /courses
// Expected API endpoint (customise as needed): GET /api/courses -> { courses: Course[] }
// Course shape used below.

// ---------- Types ----------
/**
 * @typedef {Object} Course
 * @property {string} id
 * @property {string} title
 * @property {string} level
 * @property {number} durationWeeks
 * @property {number} lessons
 * @property {string} category
 * @property {number} enrollments
 * @property {number} rating
 * @property {number} priceUSD
 * @property {number} priceZAR
 * @property {string} image
 * @property {string} description
 * @property {string[]} tags
 * @property {string} [accent] Tailwind gradient utility e.g. "from-indigo-500 to-fuchsia-500"
 */

// ---------- Brand theme ----------
const BRAND = {
  name: "Rapha Lumina Academy",
  // soft cosmic palette with star vibes
  primary: "#2D1B69", // deep indigo
  accentA: "#7C3AED", // violet
  accentB: "#EC4899", // pink
  surface: "#ffffff",
  text: "#0a0a0a",
  gradient: "from-violet-600 to-pink-500",
  ring: "ring-violet-500/30",
};

// ---------- Local fallback data (used if API is unavailable) ----------
const FALLBACK: Course[] = [
  {
    id: "awakening-to-consciousness",
    title: "Awakening to Consciousness",
    level: "Beginner",
    durationWeeks: 4,
    lessons: 15,
    category: "Consciousness Studies",
    enrollments: 2340,
    rating: 4.8,
    priceUSD: 50,
    priceZAR: 500,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    accent: "from-indigo-500 to-fuchsia-500",
    description:
      "A gentle entry into the seven levels of awareness. Learn the shift from reaction to presence with daily practices and audio journeys.",
    tags: ["Meditation", "Self inquiry", "Flow"],
  },
  {
    id: "mindful-productivity",
    title: "Mindful Productivity",
    level: "Beginner",
    durationWeeks: 3,
    lessons: 12,
    category: "Personal Growth",
    enrollments: 1205,
    rating: 4.6,
    priceUSD: 39,
    priceZAR: 390,
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    accent: "from-cyan-500 to-blue-600",
    description:
      "Structure your day with presence. Use intention, batching, and reflective breaks to work with ease.",
    tags: ["Intention", "Focus", "Habits"],
  },
  {
    id: "breath-and-stillness",
    title: "Breath and Stillness",
    level: "All levels",
    durationWeeks: 2,
    lessons: 8,
    category: "Meditation",
    enrollments: 980,
    rating: 4.7,
    priceUSD: 29,
    priceZAR: 290,
    image:
      "https://images.unsplash.com/photo-1517999349371-c43520457b23?q=80&w=1200&auto=format&fit=crop",
    accent: "from-emerald-500 to-teal-600",
    description:
      "Short breathwork journeys that calm the body and open clear awareness.",
    tags: ["Breathwork", "Nervous system", "Calm"],
  },
  {
    id: "creative-visualisation",
    title: "Creative Visualisation",
    level: "Intermediate",
    durationWeeks: 4,
    lessons: 14,
    category: "Creation",
    enrollments: 760,
    rating: 4.5,
    priceUSD: 45,
    priceZAR: 450,
    image:
      "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1200&auto=format&fit=crop",
    accent: "from-rose-500 to-orange-500",
    description:
      "Work with emotion, imagery, and gentle discipline to shape your reality with care.",
    tags: ["Intention", "Synchronicity", "Journaling"],
  },
];

// ---------- Utilities ----------
const fmt = (n: number) => new Intl.NumberFormat().format(n);
const clamp = (n: number, a = 0, b = 100) => Math.min(b, Math.max(a, n));

// Keys for localStorage
const LS = {
  currency: "rl.currency",
  progress: "rl.progress", // map: { [courseId]: { percent: number, lastLesson: number, updatedAt: number } }
};

function useLocalStorageState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState] as const;
}

// ---------- Fetch hook ----------
function useCourses(): { courses: Course[]; loading: boolean; error: string | null } {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await Promise.race([
          fetch("/api/courses", { signal: controller.signal }),
          new Promise<Response>((_, rej) => setTimeout(() => rej(new Error("timeout")), 6000)) as any,
        ]);
        if (!res || !("ok" in res) || !res.ok) throw new Error("bad-response");
        const json = await res.json();
        if (alive) setCourses(json.courses as Course[]);
      } catch (e) {
        // fallback to local data
        if (alive) {
          setCourses(FALLBACK);
          setError("Using local sample data");
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
      controller.abort();
    };
  }, []);

  return { courses, loading, error };
}

// ---------- Small UI bits ----------
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 shadow-sm">
      {children}
    </span>
  );
}

function StarRating({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${value.toFixed(1)} of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && half);
        return (
          <svg
            key={i}
            className={`h-4 w-4 ${filled ? "fill-yellow-400 text-yellow-400" : "fill-none text-zinc-400"}`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.983a1 1 0 00.95.69h4.188c.969 0 1.371 1.24.588 1.81l-3.39 2.463a1 1 0 00-.364 1.118l1.286 3.983c.3.921-.755 1.688-1.538 1.118l-3.39-2.463a1 1 0 00-1.176 0l-3.39 2.463c-.783.57-1.838-.197-1.538-1.118l1.286-3.983a1 1 0 00-.364-1.118L2.937 9.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 00.95-.69l1.286-3.983z" />
          </svg>
        );
      })}
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-zinc-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-zinc-900">{value}</div>
      <div className="text-xs text-zinc-500">{sub}</div>
    </div>
  );
}

function CurrencyToggle({ currency, onChange }: { currency: "USD" | "ZAR"; onChange: (c: any) => void }) {
  return (
    <div className="inline-flex items-center rounded-xl border border-zinc-200 bg-white p-1 shadow-sm">
      {["USD", "ZAR"].map((c) => (
        <button
          key={c}
          onClick={() => onChange(c as any)}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
            currency === c ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-100"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

// ---------- Progress utils ----------
function useProgress() {
  type One = { percent: number; lastLesson: number; updatedAt: number };
  const [map, setMap] = useLocalStorageState<Record<string, One>>(LS.progress, {});

  const set = (courseId: string, percent: number, lastLesson: number) => {
    setMap((m) => ({
      ...m,
      [courseId]: {
        percent: clamp(percent),
        lastLesson,
        updatedAt: Date.now(),
      },
    }));
  };

  return { map, set } as const;
}

// ---------- Components ----------
function CourseCard({ course, currency, progress }: { course: Course; currency: "USD" | "ZAR"; progress?: { percent: number; lastLesson: number } }) {
  const price = currency === "USD" ? `$${course.priceUSD}` : `R${course.priceZAR}`;
  const pct = progress?.percent ?? 0;
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-40 w-full overflow-hidden">
        <img src={course.image} alt={course.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className={`absolute inset-0 bg-gradient-to-tr ${course.accent || BRAND.gradient} opacity-20 mix-blend-multiply`} />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge>{course.level}</Badge>
          <Badge>{course.durationWeeks} weeks</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 text-lg font-semibold text-zinc-900">{course.title}</h3>
        <p className="line-clamp-2 text-sm text-zinc-600">{course.description}</p>
        <div className="flex flex-wrap gap-2">
          {course.tags?.slice(0, 3).map((t) => (
            <span key={t} className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">
              {t}
            </span>
          ))}
        </div>

        {/* progress bar */}
        {pct > 0 && (
          <div className="mt-1">
            <div className="mb-1 flex items-center justify-between text-xs text-zinc-600">
              <span>Progress</span>
              <span>{pct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
              <div className={`h-full bg-gradient-to-r ${BRAND.gradient}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StarRating value={course.rating} />
            <span className="text-xs text-zinc-500">{fmt(course.enrollments)} enrolled</span>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-zinc-900">{price}</div>
            <div className="text-xs text-zinc-500">{course.lessons} lessons</div>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <a
            href={`/courses/${course.id}${pct > 0 ? `/lesson/${progress?.lastLesson || 1}` : ""}`}
            className={`inline-flex flex-1 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition text-white bg-zinc-900 hover:bg-zinc-800`}
          >
            {pct > 0 ? "Resume" : "View course"}
          </a>
          <button className="rounded-xl border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100" aria-label="Add to wishlist">
            ❤
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LMSDashboard() {
  const { courses, loading, error } = useCourses();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("popularity");
  const [currency, setCurrency] = useLocalStorageState<"USD" | "ZAR">(LS.currency, "USD");
  const { map: progressMap, set: setProgress } = useProgress();

  // categories list
  const categories = useMemo(() => ["All", ...Array.from(new Set(courses.map((c) => c.category)))], [courses]);

  // filtered and sorted list
  const list = useMemo(() => {
    let data = [...courses];

    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.tags?.some((t) => t.toLowerCase().includes(q)));
    }

    if (category !== "All") data = data.filter((c) => c.category === category);

    if (sort === "price-asc") data.sort((a, b) => (currency === "USD" ? a.priceUSD - b.priceUSD : a.priceZAR - b.priceZAR));
    else if (sort === "price-desc") data.sort((a, b) => (currency === "USD" ? b.priceUSD - a.priceUSD : b.priceZAR - a.priceZAR));
    else if (sort === "rating") data.sort((a, b) => b.rating - a.rating);
    else data.sort((a, b) => b.enrollments - a.enrollments);

    return data;
  }, [courses, query, category, sort, currency]);

  // continue learning section
  const continueLearning = useMemo(() => {
    const entries = Object.entries(progressMap)
      .filter(([, v]) => (v as any).percent > 0)
      .sort((a, b) => (b[1] as any).updatedAt - (a[1] as any).updatedAt)
      .slice(0, 6);
    const byId = new Map(list.map((c) => [c.id, c] as const));
    return entries.map(([id, v]) => ({ course: byId.get(id) }).course && { course: byId.get(id)!, meta: v as any }).filter(Boolean) as { course: Course; meta: any }[];
  }, [progressMap, list]);

  // demo: if no progress saved, seed a small example for the first course so the section is visible
  useEffect(() => {
    if (continueLearning.length === 0 && list[0]) {
      // do not overwrite real users each time
      const seeded = sessionStorage.getItem("rl.seeded");
      if (!seeded) {
        setProgress(list[0].id, 20, 3);
        sessionStorage.setItem("rl.seeded", "1");
      }
    }
  }, [continueLearning.length, list, setProgress]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: BRAND.text }}>{BRAND.name}</h1>
          <p className="mt-2 max-w-2xl text-zinc-600">Learn with ease and presence. Choose a course, switch currency, and start at your own pace.</p>
        </div>
        <div className="flex items-center gap-3">
          <CurrencyToggle currency={currency} onChange={setCurrency} />
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="col-span-2 flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm">
          <svg className="h-5 w-5 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 21l-4.35-4.35" /><circle cx="11" cy="11" r="7" /></svg>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search courses" className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500" />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm">
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm">
          <option value="popularity">Sort by popularity</option>
          <option value="rating">Sort by rating</option>
          <option value="price-asc">Price low to high</option>
          <option value="price-desc">Price high to low</option>
        </select>
      </div>

      {/* Highlight banner */}
      <div className={`mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-r ${BRAND.gradient} p-6 text-white shadow-sm`}>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold">Start with Awakening to Consciousness</h2>
            <p className="mt-1 max-w-2xl text-white/90">A four week beginner journey into the seven levels of awareness. Calm, practical, and life changing.</p>
          </div>
          <a href="/courses/awakening-to-consciousness" className="inline-flex items-center justify-center rounded-xl bg-white/90 px-5 py-2.5 text-sm font-semibold text-zinc-900 backdrop-blur transition hover:bg-white">View course</a>
        </div>
      </div>

      {/* Continue learning */}
      {continueLearning.length > 0 && (
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-zinc-900">Continue learning</h3>
            <span className="text-xs text-zinc-500">Auto saved progress</span>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {continueLearning.map(({ course, meta }) => (
              <CourseCard key={course.id} course={course} currency={currency} progress={meta} />
            ))}
          </div>
        </section>
      )}

      {/* Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <CourseCard key={c.id} course={c} currency={currency} progress={progressMap[c.id]} />
        ))}
      </div>

      {/* Loading and error states */}
      {loading && (
        <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-600">Loading courses...</div>
      )}
      {error && (
        <div className="mt-4 text-xs text-zinc-500">{error}</div>
      )}

      {/* Stats footer */}
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Students" value="3,500+" sub="Lifetime learners" />
        <StatCard label="Courses" value={`${Math.max(list.length, 1)}`} sub="Available now" />
        <StatCard label="Average rating" value="4.7" sub="Across all courses" />
      </div>
    </div>
  );
}
