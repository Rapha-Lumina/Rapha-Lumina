import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageCircle, Zap, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";

export default function Signup() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/chat");
    }
  }, [isAuthenticated, setLocation]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-primary/10 to-background py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl mb-4">
              Begin Your Journey
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join our community and unlock the full wisdom of Rapha Lumina. Click the "Sign Up" button in the menu above to get started.
            </p>
            
            <Button 
              asChild
              variant="default" 
              size="lg"
              className="text-lg px-12 py-6"
            >
              <a 
                href="#" 
                className="systeme-show-popup-21189482"
                data-testid="button-signup-hero"
              >
                Sign Up Now
              </a>
            </Button>
          </div>
        </div>

        {/* Info Section */}
        <div className="max-w-4xl mx-auto px-4 py-16">

          <div className="text-center mb-12">
            <h2 className="font-display text-3xl mb-4">What You'll Receive</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose between our Premium monthly plan or Transformation one-time package. Both include exclusive features and personalized spiritual guidance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2 text-lg">Personalized Wisdom</h4>
              <p className="text-sm text-muted-foreground">
                AI-powered spiritual guidance tailored to your unique journey with increased chat limits
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2 text-lg">Voice Interaction</h4>
              <p className="text-sm text-muted-foreground">
                Speak directly with Rapha Lumina using advanced voice technology
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2 text-lg">Exclusive Content</h4>
              <p className="text-sm text-muted-foreground">
                Access to premium courses, eBooks, and meditation resources
              </p>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-muted/30 py-12 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-display text-2xl mb-4">Ready to Transform?</h3>
            <p className="text-muted-foreground mb-6">
              Click the button below or the "Sign Up" button in the navigation menu to begin your journey.
            </p>
            <Button 
              asChild
              variant="default" 
              size="lg"
            >
              <a 
                href="#" 
                className="systeme-show-popup-21189482"
                data-testid="button-signup-cta"
              >
                Sign Up Now
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
