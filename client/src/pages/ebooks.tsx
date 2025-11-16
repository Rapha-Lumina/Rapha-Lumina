import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Lock } from "lucide-react";
import booksImg from "@assets/stock_images/books_wisdom_learnin_36011055.jpg";

type Ebook = {
  id: string;
  title: string;
  description: string;
  pages: string;
  format: string;
  price: string;
  topics: string[];
  status: "available" | "coming_soon";
  href?: string; // download link when available
};

export default function EBooks() {
  const ebooks: Ebook[] = [
    {
      id: "the-awakened-path",
      title: "The Awakened Path: A Modern Guide to Consciousness",
      description:
        "Navigate the journey from unconscious living to awakened awareness. This comprehensive guide integrates ancient wisdom with modern psychology and quantum insights.",
      pages: "280 pages",
      format: "PDF",
      price: "$27",
      topics: ["Consciousness", "Awakening", "Integration", "Practice"],
      status: "available",
      href: "/api/ebooks/the-awakened-path/download?format=pdf",
    },
    {
      id: "shadow-to-light",
      title: "Shadow to Light: Embracing Your Whole Self",
      description:
        "A profound exploration of Jungian shadow work and integration practices. Learn to transform your hidden aspects into sources of power and wisdom.",
      pages: "196 pages",
      format: "Unavailable",
      price: "$24",
      topics: ["Shadow Work", "Jung", "Integration", "Transformation"],
      status: "coming_soon",
    },
    {
      id: "quantum-mind",
      title: "Quantum Mind: Where Science Meets Spirit",
      description:
        "Discover the fascinating convergence of quantum physics and mystical teachings. Understand consciousness from both scientific and spiritual perspectives.",
      pages: "312 pages",
      format: "Unavailable",
      price: "$29",
      topics: ["Quantum Physics", "Consciousness", "Mysticism", "Science"],
      status: "coming_soon",
    },
    {
      id: "the-stoic-soul",
      title: "The Stoic Soul: Ancient Wisdom for Modern Life",
      description:
        "Practical applications of Stoic philosophy for contemporary spiritual seekers. Learn resilience, equanimity, and the art of living well.",
      pages: "224 pages",
      format: "Unavailable",
      price: "$22",
      topics: ["Stoicism", "Philosophy", "Practice", "Wisdom"],
      status: "coming_soon",
    },
    {
      id: "conversations-with-the-infinite",
      title: "Conversations with the Infinite: A Dialogue Journal",
      description:
        "A guided journal for deep self-inquiry and dialogue with your higher self. Includes prompts, meditations, and contemplation practices.",
      pages: "168 pages",
      format: "Unavailable",
      price: "$19",
      topics: ["Self-Inquiry", "Journaling", "Meditation", "Practice"],
      status: "coming_soon",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-[400px] overflow-hidden">
          <img src={booksImg} alt="Books and wisdom" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">Wisdom Library</h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Deep dive into transformative teachings through our curated collection of eBooks
              </p>
            </div>
          </div>
        </div>

        {/* eBooks Grid */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-6">
            {ebooks.map((ebook, index) => {
              const isAvailable = ebook.status === "available";
              return (
                <Card key={ebook.id} className="hover-elevate flex flex-col" data-testid={`card-ebook-${index}`}>
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-3 rounded-lg shrink-0">
                        {isAvailable ? (
                          <FileText className="w-6 h-6 text-primary" />
                        ) : (
                          <Lock className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-xl font-serif">{ebook.title}</CardTitle>
                          {!isAvailable && <Badge variant="secondary">Coming soon</Badge>}
                          {isAvailable && <Badge>Available</Badge>}
                        </div>
                        <CardDescription className="mt-2">{ebook.description}</CardDescription>
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

                  <CardFooter className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{ebook.price}</span>
                    {isAvailable ? (
                      <Button asChild data-testid={`button-download-ebook-${index}`}>
                        <a href={ebook.href}>Download PDF</a>
                      </Button>
                    ) : (
                      <Button variant="secondary" disabled data-testid={`button-comingsoon-ebook-${index}`}>
                        Coming soon
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Bundle Offer */}
        <div className="bg-gradient-to-b from-primary/10 to-background py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-primary">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-3">
                  <CardTitle className="text-3xl font-display mb-2">Complete eBook Collection</CardTitle>
                  <Badge variant="secondary">Coming soon</Badge>
                </div>
                <CardDescription className="text-base">
                  All 5 titles in one purchase. The collection will be available once remaining titles are released.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className="text-2xl text-muted-foreground line-through">$121</span>
                  <span className="text-4xl font-bold text-muted-foreground">$79</span>
                </div>
                <p className="text-muted-foreground mb-6">Bundle not yet available.</p>
              </CardContent>
              <CardFooter className="justify-center">
                <Button size="lg" variant="secondary" disabled data-testid="button-purchase-bundle">
                  Coming soon
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Included in Package */}
        <div className="bg-muted/30 py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl mb-4">Included in Transformation Package</h2>
            <p className="text-muted-foreground mb-6">
              eBooks will be added to the Transformation Package as each title is released.
            </p>
            <Button variant="outline" size="lg" asChild>
              <a href="/shop" data-testid="link-view-transformation-package">
                View Transformation Package
              </a>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t bg-muted/30">
        <div className="max-ww-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">© 2025 Rapha Lumina. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
