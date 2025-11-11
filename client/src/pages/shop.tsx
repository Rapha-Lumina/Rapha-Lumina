import { Link } from "wouter";
import { useEffect, useMemo, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Package, Sparkles } from "lucide-react";

type Ebook = {
  id: string;
  title: string;
  description: string;
  pages: string;
  format: string;
  topics: string[];
  available: boolean;
};

export default function Shop() {
  const [isZA, setIsZA] = useState(false);
  const [isSuper, setIsSuper] = useState(false);
  const [ebookExists, setEbookExists] = useState<Record<string, boolean>>({});

  // Detect SA pricing
  useEffect(() => {
    const detectZA = () => {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
        const lang = (navigator.language || "").toUpperCase();
        if (tz === "Africa/Johannesburg" || lang.endsWith("-ZA")) return true;
      } catch {}
      return false;
    };
    setIsZA(detectZA());
  }, []);

  // Superuser check (uses /api/superuser from server)
  useEffect(() => {
    const run = async () => {
      try {
        const r = await fetch("/api/superuser", { credentials: "include" });
        if (r.ok) {
          const j = await r.json();
          setIsSuper(!!j.superuser);
        }
      } catch {
        setIsSuper(false);
      }
    };
    run();
  }, []);

  const priceLabel = useMemo(() => (isZA ? "R100" : "$10"), [isZA]);
  const bundlePrice = useMemo(() => (isZA ? "R300" : "$25"), [isZA]);

  // Catalog (only first is currently available)
  const EBOOKS: Ebook[] = [
    {
      id: "the-awakened-path",
      title: "The Awakened Path: A Modern Guide to Consciousness",
      description:
        "Navigate the journey from unconscious living to awakened awareness. This guide blends ancient wisdom with psychology and quantum insights.",
      pages: "241 pages",
      format: "PDF",
      topics: ["Consciousness", "Awakening", "Integration", "Practice"],
      available: true,
    },
    {
      id: "shadow-to-light",
      title: "Shadow to Light: Embracing Your Whole Self",
      description:
        "A deep dive into shadow work and integration practices. Learn to transform hidden aspects into strength and wisdom.",
      pages: "196 pages",
      format: "PDF, EPUB, MOBI",
      topics: ["Shadow Work", "Jung", "Integration", "Transformation"],
      available: false,
    },
    {
      id: "quantum-mind",
      title: "Quantum Mind: Where Science Meets Spirit",
      description:
        "Explore the bridge between quantum physics and spirituality. Understand consciousness through both science and mysticism.",
      pages: "312 pages",
      format: "PDF, EPUB, MOBI",
      topics: ["Quantum Physics", "Consciousness", "Mysticism", "Science"],
      available: false,
    },
    {
      id: "stoic-soul",
      title: "The Stoic Soul: Ancient Wisdom for Modern Life",
      description:
        "Practical applications of Stoic philosophy for inner peace and emotional mastery in the modern world.",
      pages: "224 pages",
      format: "PDF, EPUB, MOBI",
      topics: ["Stoicism", "Philosophy", "Practice", "Wisdom"],
      available: false,
    },
    {
      id: "conversations-with-the-infinite",
      title: "Conversations with the Infinite: A Dialogue Journal",
      description:
        "A guided journal for deep self-inquiry and connection with higher consciousness. Includes prompts and meditations.",
      pages: "168 pages",
      format: "PDF, EPUB, MOBI",
      topics: ["Self-Inquiry", "Journaling", "Meditation", "Practice"],
      available: false,
    },
  ];

  // Probe file existence for available items (so the Download button only shows when the file is actually there)
  useEffect(() => {
    const probe = async (id: string) => {
      try {
        const r = await fetch(`/api/ebooks/${id}/exists`, {
          method: "HEAD",
          credentials: "include",
        });
        setEbookExists((s) => ({ ...s, [id]: r.status === 204 }));
      } catch {
        setEbookExists((s) => ({ ...s, [id]: false }));
      }
    };
    EBOOKS.filter((b) => b.available).forEach((b) => probe(b.id));
  }, []);

  const renderButton = (b: Ebook) => {
    // Not yet published
    if (!b.available) {
      return (
        <button
          className="px-4 py-2 rounded-lg bg-gray-700/60 text-gray-300 cursor-not-allowed"
          disabled
          title="Coming soon"
        >
          Not available — coming soon
        </button>
      );
    }

    // Owner sees direct download (only if file exists)
    if (isSuper) {
      if (!ebookExists[b.id]) {
        return (
          <button
            className="px-4 py-2 rounded-lg bg-gray-700/60 text-gray-300 cursor-not-allowed"
            disabled
            title="File not found on server"
          >
            File not found
          </button>
        );
      }
      return (
        <a
          href={`/api/ebooks/${b.id}/download?format=pdf`}
          className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white inline-flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </a>
      );
    }

    // Regular visitors purchase
    return (
      <Button
        onClick={() => {
          window.location.href = "/membership";
        }}
      >
        Purchase eBook
      </Button>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1">
        {/* Coming Soon Section */}
        <div className="bg-gradient-to-b from-primary/10 to-background py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Package className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-display text-5xl sm:text-6xl mb-4">
              Physical Products Coming Soon
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              We're preparing sacred wellness tools and conscious living products — stay tuned for
              launch.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="bg-primary/5 border-primary/20"
              asChild
            >
              <Link href="/signup" className="inline-flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Get Notified When Shop Launches</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* eBooks Section */}
        <div className="relative py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl sm:text-5xl mb-4">Wisdom Library</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover transformative teachings through our curated eBook collection.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Regional pricing: <strong>{priceLabel}</strong> per eBook
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {EBOOKS.map((ebook) => (
                <Card key={ebook.id} className="hover-elevate flex flex-col">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-3 rounded-lg shrink-0">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl font-serif mb-2">
                          {ebook.title}
                        </CardTitle>
                        <CardDescription>{ebook.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {ebook.topics.map((topic) => (
                        <Badge key={topic} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{ebook.pages}</p>
                      <p className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {ebook.format}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between gap-4">
                    <span className="text-2xl font-bold">{priceLabel}</span>
                    {renderButton(ebook)}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Bundle Offer Section */}
        <div className="bg-gradient-to-b from-primary/10 to-background py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-primary">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-display mb-2">
                  Complete eBook Collection
                </CardTitle>
                <CardDescription className="text-base">
                  Get all 5 eBooks at one exclusive bundle price
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className="text-4xl font-bold text-primary">{bundlePrice}</span>
                </div>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  Upgrade your journey with every Rapha Lumina eBook. You’ll also receive future
                  titles at no extra cost.
                </p>

                <p className="text-sm text-muted-foreground mb-4">
                  <strong>Want more?</strong> If you upgrade to the{" "}
                  <strong>Premium Wisdom Membership</strong>, all eBooks are included — along with
                  courses, coaching, and other exciting products that expand your consciousness
                  journey.
                </p>

                <Link href="/membership" className="text-primary underline text-sm font-medium">
                  Click here to upgrade
                </Link>
              </CardContent>
              <CardFooter className="justify-center mt-6">
                <Button
                  size="lg"
                  onClick={() => {
                    window.location.href = "/membership";
                  }}
                >
                  Get Complete Collection
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Package Section */}
        <div className="bg-muted/30 py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl mb-4">
              Included in Transformation Package
            </h2>
            <p className="text-muted-foreground mb-6">
              All eBooks are included in the Transformation Package, together with your membership
              benefits.
            </p>
            <Button variant="outline" size="lg" asChild>
              <a href="/membership">View Membership Options</a>
            </Button>
          </div>
        </div>
      </main>

      <footer className="py-8 px-4 border-t bg-muted/30">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Rapha Lumina. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
