import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import meditationImg from "@assets/stock_images/meditation_spiritual_555a3c50.jpg";

export default function Blog() {
  const posts = [
    {
      title: "The Integration of Shadow and Light: A Modern Approach",
      excerpt: "Exploring how Jungian psychology meets quantum consciousness in the journey of self-discovery and wholeness.",
      date: "October 15, 2025",
      readTime: "8 min read",
      category: "Psychology",
      image: meditationImg
    },
    {
      title: "Why Rigid Religion Fails the Modern Seeker",
      excerpt: "Understanding the spiritual exodus of millennials and what they're truly seeking in their quest for meaning.",
      date: "October 8, 2025",
      readTime: "6 min read",
      category: "Spirituality",
      image: meditationImg
    },
    {
      title: "Quantum Mechanics and the Nature of Reality",
      excerpt: "How modern physics validates ancient mystical insights about the fundamental nature of consciousness and reality.",
      date: "October 1, 2025",
      readTime: "10 min read",
      category: "Science & Spirit",
      image: meditationImg
    },
    {
      title: "The Stoic Practice of Memento Mori in Contemporary Life",
      excerpt: "Death contemplation as a path to living more fully - ancient wisdom for modern times.",
      date: "September 24, 2025",
      readTime: "7 min read",
      category: "Philosophy",
      image: meditationImg
    },
    {
      title: "Awakening Without a Teacher: The Solo Journey",
      excerpt: "Navigating spiritual awakening in isolation and finding guidance within when external teachers are absent.",
      date: "September 17, 2025",
      readTime: "9 min read",
      category: "Awakening",
      image: meditationImg
    },
    {
      title: "The Feminine Divine in Modern Consciousness",
      excerpt: "Reclaiming sacred feminine wisdom in a patriarchal world and integrating both polarities.",
      date: "September 10, 2025",
      readTime: "8 min read",
      category: "Spirituality",
      image: meditationImg
    }
  ];

  const categories = ["All", "Psychology", "Spirituality", "Science & Spirit", "Philosophy", "Awakening"];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-primary/10 to-background py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-5xl sm:text-6xl mb-6">
              Wisdom Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Exploring consciousness, transformation, and the integration of ancient wisdom with modern understanding.
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Badge 
                key={category} 
                variant="outline" 
                className="cursor-pointer hover-elevate px-4 py-2"
                data-testid={`badge-category-${category.toLowerCase()}`}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Blog Posts */}
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <Card key={index} className="hover-elevate flex flex-col" data-testid={`card-post-${index}`}>
                <div className="overflow-hidden rounded-t-lg">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                  </div>
                  <CardTitle className="text-lg font-serif line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full group" data-testid={`button-read-post-${index}`}>
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="bg-muted/30 py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl mb-4">Stay Connected</h2>
            <p className="text-muted-foreground mb-6">
              Get new articles delivered to your inbox. Join our community of conscious seekers.
            </p>
            <Button size="lg" asChild>
              <a href="/" data-testid="link-subscribe-newsletter">
                Subscribe to Newsletter
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
