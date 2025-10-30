import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

export default function JoinAwakening() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-3xl w-full text-center">
          {/* Logo/Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/30">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-foreground mb-6">
            Join the Awakening
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-muted-foreground mb-8 font-light">
            Begin Your Journey of Spiritual Wisdom and Transformation
          </p>

          {/* Description */}
          <p className="text-lg text-muted-foreground/90 mb-12 leading-relaxed max-w-2xl mx-auto">
            Discover deep life answers, direction, and philosophical guidance through contemplative dialogue.
            Connect with channeled spiritual wisdom drawing from philosophical traditions across human history.
          </p>

          {/* CTA Button - Different for authenticated users */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <Button
                asChild
                size="lg"
                className="text-lg px-12 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                data-testid="button-start-chat"
              >
                <Link href="/chat">
                  Start Chatting
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                size="lg"
                className="text-lg px-12 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <a 
                  href="#" 
                  className="systeme-show-popup-21189482"
                  data-testid="button-join-now"
                >
                  Join Now
                </a>
              </Button>
            )}
          </div>

          {/* Additional Info */}
          <p className="mt-12 text-sm text-muted-foreground/70">
            By joining, you'll gain access to exclusive spiritual wisdom,
            guided meditations, and transformative teachings.
          </p>

          {/* Back Link */}
          <div className="mt-8">
            <a
              href="/"
              className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
              data-testid="link-back-home"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </main>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary/3 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}