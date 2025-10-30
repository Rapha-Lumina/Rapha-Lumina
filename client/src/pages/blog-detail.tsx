import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import meditationImg from "@assets/stock_images/meditation_spiritual_555a3c50.jpg";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  thumbnail: string | null;
  publishedAt: string;
  updatedAt: string;
};

export default function BlogDetail() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ["/api/blog", slug],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
          <h1 className="text-2xl font-display">Article not found</h1>
          <Link href="/blog">
            <Button variant="ghost" data-testid="button-back-to-blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const displayDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        {post.thumbnail && (
          <div className="w-full h-96 overflow-hidden relative">
            <img 
              src={post.thumbnail || meditationImg}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
          </div>
        )}

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-4 py-12">
          {/* Back Button */}
          <Link href="/blog">
            <Button variant="ghost" className="mb-6" data-testid="button-back-to-blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          {/* Category Badge */}
          <Badge variant="secondary" className="mb-4">{post.category}</Badge>

          {/* Title */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {displayDate}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-display prose-headings:text-foreground prose-p:text-foreground/90 prose-a:text-primary prose-strong:text-foreground prose-blockquote:text-muted-foreground prose-blockquote:border-primary">
            {post.content.split('\n').map((paragraph, index) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-3xl font-display mt-12 mb-6 first:mt-0">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                  <p key={index} className="text-xl font-semibold my-6">
                    {paragraph.replace(/\*\*/g, '')}
                  </p>
                );
              } else if (paragraph.startsWith('—')) {
                return (
                  <p key={index} className="text-center italic text-muted-foreground my-8">
                    {paragraph}
                  </p>
                );
              } else if (paragraph.trim()) {
                return (
                  <p key={index} className="mb-6 leading-relaxed">
                    {paragraph.split('**').map((part, i) => 
                      i % 2 === 0 ? part : <strong key={i}>{part}</strong>
                    )}
                  </p>
                );
              }
              return null;
            })}
          </div>

          {/* Call to Action */}
          <div className="mt-16 pt-8 border-t">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-8 text-center">
              <h3 className="font-display text-2xl mb-4">Continue Your Journey</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Explore more wisdom, insights, and transformative content to support your spiritual awakening.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/chat">
                  <Button size="lg" data-testid="button-start-chat">
                    Begin Chatting
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button size="lg" variant="outline" data-testid="button-more-articles">
                    More Articles
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </article>
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
