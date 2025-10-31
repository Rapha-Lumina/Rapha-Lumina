import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Package, Sparkles } from "lucide-react";
import booksImg from "@assets/stock_images/books_wisdom_learnin_36011055.jpg";

export default function Shop() {
  const ebooks = [
    {
      title: "The Awakened Path: A Modern Guide to Consciousness",
      description: "Navigate the journey from unconscious living to awakened awareness. This comprehensive guide integrates ancient wisdom with modern psychology and quantum insights.",
      pages: "280 pages",
      format: "PDF, EPUB, MOBI",
      price: "$27",
      topics: ["Consciousness", "Awakening", "Integration", "Practice"]
    },
    {
      title: "Shadow to Light: Embracing Your Whole Self",
      description: "A profound exploration of Jungian shadow work and integration practices. Learn to transform your hidden aspects into sources of power and wisdom.",
      pages: "196 pages",
      format: "PDF, EPUB, MOBI",
      price: "$24",
      topics: ["Shadow Work", "Jung", "Integration", "Transformation"]
    },
    {
      title: "Quantum Mind: Where Science Meets Spirit",
      description: "Discover the fascinating convergence of quantum physics and mystical teachings. Understand consciousness from both scientific and spiritual perspectives.",
      pages: "312 pages",
      format: "PDF, EPUB, MOBI",
      price: "$29",
      topics: ["Quantum Physics", "Consciousness", "Mysticism", "Science"]
    },
    {
      title: "The Stoic Soul: Ancient Wisdom for Modern Life",
      description: "Practical applications of Stoic philosophy for contemporary spiritual seekers. Learn resilience, equanimity, and the art of living well.",
      pages: "224 pages",
      format: "PDF, EPUB, MOBI",
      price: "$22",
      topics: ["Stoicism", "Philosophy", "Practice", "Wisdom"]
    },
    {
      title: "Conversations with the Infinite: A Dialogue Journal",
      description: "A guided journal for deep self-inquiry and dialogue with your higher self. Includes prompts, meditations, and contemplation practices.",
      pages: "168 pages",
      format: "PDF, EPUB, MOBI",
      price: "$19",
      topics: ["Self-Inquiry", "Journaling", "Meditation", "Practice"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1">
        {/* Coming Soon Hero */}
        <div className="bg-gradient-to-b from-primary/10 to-background py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Package className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-display text-5xl sm:text-6xl mb-4">
              Physical Products Coming Soon
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              We're preparing a carefully curated collection of spiritual tools, wellness products, and sacred items to support your journey. Stay tuned for nootropics, meditation essentials, sacred geometry art, and more.
            </p>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-primary/5 border-primary/20"
              asChild
            >
              <a 
                href="#" 
                className="systeme-show-popup-21189482 inline-flex items-center gap-2"
                data-testid="button-notify-launch"
              >
                <Sparkles className="w-5 h-5" />
                <span>Get Notified When Shop Launches</span>
              </a>
            </Button>
          </div>
        </div>

        {/* eBooks Section */}
        <div className="relative py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl sm:text-5xl mb-4">
                Wisdom Library
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Deep dive into transformative teachings through our curated collection of eBooks
              </p>
            </div>

            {/* eBooks Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {ebooks.map((ebook, index) => (
                <Card key={index} className="hover-elevate flex flex-col" data-testid={`card-ebook-${index}`}>
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-3 rounded-lg shrink-0">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl font-serif mb-2">{ebook.title}</CardTitle>
                        <CardDescription>{ebook.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {ebook.topics.map((topic, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
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
                    <span className="text-2xl font-bold">{ebook.price}</span>
                    <Button 
                      onClick={() => {
                        window.location.href = '/membership';
                      }}
                      data-testid={`button-purchase-ebook-${index}`}
                    >
                      Purchase eBook
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Bundle Offer */}
        <div className="bg-gradient-to-b from-primary/10 to-background py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-primary">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-display mb-2">Complete eBook Collection</CardTitle>
                <CardDescription className="text-base">
                  Get all 5 eBooks at a special bundle price
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className="text-2xl text-muted-foreground line-through">$121</span>
                  <span className="text-4xl font-bold text-primary">$79</span>
                  <Badge variant="default" className="text-sm">Save $42</Badge>
                </div>
                <p className="text-muted-foreground mb-6">
                  Lifetime access to all current and future eBooks in the collection
                </p>
              </CardContent>
              <CardFooter className="justify-center">
                <Button 
                  size="lg" 
                  onClick={() => {
                    window.location.href = '/membership';
                  }}
                  data-testid="button-purchase-bundle"
                >
                  Get Complete Collection
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
              All eBooks are included in the Transformation Package, along with courses, coaching, and more.
            </p>
            <Button variant="outline" size="lg" asChild>
              <a href="/membership" data-testid="link-view-transformation-package">
                View Membership Options
              </a>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
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
