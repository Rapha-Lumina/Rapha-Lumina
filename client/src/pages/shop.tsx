import React, { useEffect, useMemo, useState } from "react";

type FileType = "pdf" | "epub" | "mobi";

type Product = {
  id: string;
  title: string;
  description: string;
  cover?: string;
  priceZAR: number;
  fileBase: string; // server id or slug, e.g. "the-awakened-path"
};

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "The Awakened Path",
    description: "A practical guide to inner clarity and daily alignment.",
    cover: "/covers/awakened-path.jpg",
    priceZAR: 149,
    fileBase: "the-awakened-path",
  },
];

export default function Shop() {
  const [selectedType, setSelectedType] = useState<FileType>("pdf");
  const [isAdmin, setIsAdmin] = useState(false); // superuser bypass
  const [purchased, setPurchased] = useState<string[]>([]); // product ids

  // Detect admin bypass (cookie or query param)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const adminParam = params.get("superuser");
      if (adminParam === "1") setIsAdmin(true);
      // cookie fallback
      if (document.cookie.includes("superuser=1")) setIsAdmin(true);
    } catch {}
  }, []);

  // In a real app, fetch purchases for the logged-in user
  useEffect(() => {
    // Example: fetch("/api/me/purchases", { credentials: "include" }).then(...)
    // For now, leave empty -> no purchases found
  }, []);

  function handleDownload(prod: Product) {
    // If admin, always allow. If not admin, allow only if purchased.
    if (!isAdmin && !purchased.includes(prod.id)) {
      alert("Please purchase or sign in to download this file.");
      return;
    }
    const url = `/api/ebooks/${encodeURIComponent(prod.fileBase)}/download?type=${selectedType}`;
    window.location.href = url;
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight">Shop</h1>
            <p className="mt-2 text-gray-700">
              Choose your format and download instantly. Admin testers can bypass purchase.
            </p>
          </header>

          {/* Format selector + admin toggle (simple visual) */}
          <div className="mx-auto mb-8 flex max-w-3xl items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Download format</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as FileType)}
                className="rounded-lg border px-3 py-2 text-sm"
              >
                <option value="pdf">PDF</option>
                <option value="epub">ePub</option>
                <option value="mobi">MOBI</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm">Admin bypass</span>
              <button
                onClick={() => {
                  const next = !isAdmin;
                  setIsAdmin(next);
                  document.cookie = `superuser=${next ? "1" : "0"}; path=/; SameSite=Lax`;
                }}
                className={`rounded-lg px-3 py-2 text-sm ${
                  isAdmin ? "bg-gray-900 text-white" : "ring-1 ring-gray-200"
                }`}
                title="Toggle superuser testing access"
              >
                {isAdmin ? "On" : "Off"}
              </button>
            </div>
          </div>

          {/* Products */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SAMPLE_PRODUCTS.map((prod) => {
              const hasAccess = isAdmin || purchased.includes(prod.id);
              return (
                <article key={prod.id} className="rounded-2xl border p-6 flex flex-col">
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 mb-4">
                    {prod.cover ? (
                      <img
                        src={prod.cover}
                        alt={prod.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : null}
                  </div>
                  <h3 className="text-lg font-semibold">{prod.title}</h3>
                  <p className="mt-2 text-sm text-gray-700 flex-1">{prod.description}</p>

                  {!hasAccess ? (
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-semibold">ZAR {prod.priceZAR}</span>
                      </div>
                      <a
                        href={`/checkout?product=${encodeURIComponent(prod.id)}`}
                        className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                      >
                        Purchase
                      </a>
                    </div>
                  ) : (
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-green-700">Access granted</span>
                      <button
                        onClick={() => handleDownload(prod)}
                        className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                      >
                        Download {selectedType.toUpperCase()}
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {/* Info note */}
          <p className="mt-8 text-center text-xs text-gray-600">
            Admin testers: switch “Admin bypass” to On to download without purchase. Real users will
            be checked via your payment system before download links activate.
          </p>
        </div>
      </section>
    </main>
  );
}
import React, { useState } from "react";

type Format = "pdf" | "epub" | "mobi";
type Item = { id: string; title: string; desc: string; price: number };

const ITEMS: Item[] = [
  { id: "the-awakened-path", title: "The Awakened Path", desc: "Practical guide for conscious awakening.", price: 12 },
  // Add more products here…
];

export default function Shop() {
  const [choice, setChoice] = useState<Record<string, Format>>({});

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 text-slate-100 bg-[#0b0d14]">
      <h1 className="mb-6 text-3xl font-serif">Shop</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((item) => {
          const fmt = choice[item.id] || "pdf";
          return (
            <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm text-white/80">{item.desc}</p>
              <div className="mt-4 flex items-center gap-2">
                <label className="text-xs text-white/70">Format</label>
                <select
                  className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-sm"
                  value={fmt}
                  onChange={(e) => setChoice((s) => ({ ...s, [item.id]: e.target.value as Format }))}
                >
                  <option value="pdf">PDF</option>
                  <option value="epub">ePub</option>
                  <option value="mobi">MOBI</option>
                </select>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div className="text-sm text-white/80">${item.price.toFixed(2)}</div>
                <a
                  href={`/api/ebooks/${item.id}/download?format=${fmt}`}
                  className="rounded-xl bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500/90"
                >
                  Download
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
