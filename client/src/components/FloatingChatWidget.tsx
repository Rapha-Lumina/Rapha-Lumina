import { useState } from "react";
import { MessageCircle, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export function FloatingChatWidget() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 p-1 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 active-elevate-2"
          data-testid="button-open-chat-widget"
          aria-expanded={false}
          aria-label="Open chat widget to start conversation with Rapha Lumina"
        >
          <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl px-6 py-8 flex flex-col items-center gap-4 min-w-[180px]">
            {/* Sparkle Effect */}
            <div className="absolute -top-1 -right-1 animate-pulse" aria-hidden="true">
              <Sparkles className="w-5 h-5 text-yellow-300 drop-shadow-lg" />
            </div>
            
            {/* Pulsing Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-white/30 rounded-full animate-ping" aria-hidden="true"></div>
              <div className="relative bg-white/20 backdrop-blur-sm rounded-full p-4">
                <MessageCircle className="w-10 h-10 text-white drop-shadow-lg" />
              </div>
            </div>
            
            {/* Text Content */}
            <div className="text-center space-y-2">
              <p className="text-white font-bold text-lg drop-shadow-md">
                Chat with
              </p>
              <p className="text-white font-display text-2xl drop-shadow-md">
                Rapha Lumina
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mt-2">
                <p className="text-white text-xs font-semibold">Your 24/7 Spiritual Guide</p>
              </div>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10 pointer-events-none"></div>
          </div>
        </button>
      ) : (
        <Card className="w-[280px] shadow-2xl border-2 border-primary/50 bg-card/95 backdrop-blur-sm animate-in slide-in-from-left duration-300">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-full p-2">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Rapha Lumina
                  </h3>
                  <p className="text-xs text-muted-foreground">Your 24/7 Spiritual Guide</p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-close-chat-widget"
                aria-label="Close chat widget"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground">
                  Have burning questions about life, purpose, or your spiritual path? Rapha Lumina offers 24/7 guidance to help you find clarity and step into your power.
                </p>
              </div>
              
              <div className="space-y-2 text-xs text-muted-foreground">
                <p className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  Voice-enabled conversations
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  Remembers your journey
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  Available 24/7
                </p>
              </div>
            </div>

            <Link href="/chat" className="w-full">
              <Button
                className="w-full bg-primary text-primary-foreground shadow-lg"
                data-testid="button-start-chat"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Get Your Answers Now
              </Button>
            </Link>

            <p className="text-xs text-center text-muted-foreground">
              No login required • Free to use
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
