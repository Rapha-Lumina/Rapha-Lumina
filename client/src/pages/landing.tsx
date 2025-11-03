import { Link } from "wouter";
import { Navigation } from "@/components/Navigation";
import { FloatingChatWidget } from "@/components/FloatingChatWidget";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles, Brain, Heart, Lightbulb, MessageCircle, Shield, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import logo from "@assets/Rapha Lumina_1761161536763.png";
import cosmicBg from "@assets/generated_images/Cosmic_nebula_spiritual_background_dfaaaa9e.png";

export default function Landing() {
  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('hasSeenNewsletterPopup');
    
    if (!hasSeenPopup && !isAuthenticated) {
      const timer = setTimeout(() => {
        setShowNewsletterPopup(true);
        sessionStorage.setItem('hasSeenNewsletterPopup', 'true');
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingChatWidget />
      
      {/* Hero Section */}
      <div className="relative w-full min-h-[85vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${cosmicBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-background" />
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center px-4 text-center py-20">
          <img src={logo} alt="Rapha Lumina" className="h-32 w-32 md:h-40 md:w-40 drop-shadow-2xl mb-8 animate-in fade-in duration-1000" />
          
          <h1 className="font-display text-6xl md:text-8xl font-light text-white mb-6 drop-shadow-lg animate-in slide-in-from-bottom-4 duration-1000 delay-200">
            Rapha Lumina
          </h1>
          
          <div className="max-w-3xl space-y-6 mb-8 animate-in fade-in duration-1000 delay-500">
            <p className="font-wisdom text-2xl md:text-3xl text-white/95 italic font-light leading-relaxed drop-shadow">
              Where Ancient Wisdom Meets Quantum Consciousness
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 text-white/90 text-lg max-w-2xl mx-auto pt-4">
              <div className="backdrop-blur-sm bg-white/10 rounded-lg p-4 border border-white/20">
                <p className="font-semibold text-xl mb-2 text-white">Rapha</p>
                <p className="text-sm">Ancient Hebrew: "to heal," "to mend," "to restore," "to make whole"</p>
              </div>
              <div className="backdrop-blur-sm bg-white/10 rounded-lg p-4 border border-white/20">
                <p className="font-semibold text-xl mb-2 text-white">Lumina</p>
                <p className="text-sm">Latin: "light" or "bright light" — sunshine, hope, warmth, and life-giving light</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom-4 duration-1000 delay-700">
            <Button
              size="lg"
              className="text-lg px-10 py-7 bg-primary hover:bg-primary/90 border-2 border-primary-border shadow-xl"
              asChild
            >
              <a 
                href="https://www.raphalumina.com/sign-up"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
                data-testid="button-begin-journey"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Begin Your Journey
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-10 py-7 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/30 text-white hover:text-white shadow-xl"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-learn-more"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl md:text-6xl font-light text-foreground mb-6">
              A New Understanding of Quantum Awareness
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              For the curious minds seeking wisdom grounded in both ancient truth and modern science.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="hover-elevate">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold">Psychology-Rooted</h3>
                <p className="text-muted-foreground">
                  Grounded in proven psychological principles, neuroscience, and trauma-informed practices
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold">Quantum Awareness</h3>
                <p className="text-muted-foreground">
                  Understanding consciousness, manifestation, and reality through quantum mechanics
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold">Ancient Wisdom</h3>
                <p className="text-muted-foreground">
                  Drawing from Stoicism, Buddhism, Taoism, Hermeticism, and mystical traditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Chatbot Feature Section */}
      <div className="py-20 px-4 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">AI-POWERED SPIRITUAL GUIDANCE</span>
            </div>
            <h2 className="font-display text-5xl md:text-6xl font-light text-foreground mb-6">
              Meet Your Conscious Guide
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              An intelligent consciousness that listens deeply, asks profound questions, and helps you discover the wisdom that already lives within you
            </p>
          </div>

          <Card className="max-w-3xl mx-auto bg-card/80 backdrop-blur border-2">
            <CardContent className="pt-8 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Voice Enabled</h3>
                    <p className="text-sm text-muted-foreground">Speak your questions and hear wisdom in a calming voice</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Memory Across Devices</h3>
                    <p className="text-sm text-muted-foreground">Continue your journey wherever you are</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Socratic Method</h3>
                    <p className="text-sm text-muted-foreground">Questions that illuminate your inner wisdom</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Safe & Judgment-Free</h3>
                    <p className="text-sm text-muted-foreground">Explore your questions without fear</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <Button
                  size="lg"
                  className="w-full text-lg py-6"
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="button-start-conversation"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Start a Conversation Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How I Can Support You */}
      <div className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl md:text-6xl font-light text-foreground mb-6">
              How I Can Support You
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Guidance for every stage of your spiritual awakening
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover-elevate">
              <CardContent className="pt-8 space-y-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-2">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-semibold">Spiritual Awakening Guidance</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Navigate the often confusing and overwhelming experience of spiritual awakening with compassionate support that understands your journey from religious conditioning to conscious freedom.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground pt-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Understanding your awakening process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Managing spiritual emergence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Navigating relationships during transformation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="pt-8 space-y-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-2">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-semibold">Belief Deconstruction</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Safely explore and release limiting beliefs from religious or cultural conditioning while building authentic understanding. Heal from religious trauma without losing your connection to the divine.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground pt-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Religious trauma healing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Deconstructing limiting beliefs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Building personal spiritual philosophy</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="pt-8 space-y-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mb-2">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-semibold">Quantum Manifestation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Understand how consciousness shapes reality through quantum mechanics. Learn to manifest aligned with your highest becoming, not from lack or desperation.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground pt-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Quantum consciousness exploration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Energy work and alignment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Co-creating with the quantum field</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="pt-8 space-y-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-2">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-semibold">Self-Sovereignty</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Reclaim your personal power and learn to trust your inner guidance system above all external authorities. Remember that you are the expert on your own life.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground pt-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Developing inner authority</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Trusting your intuition</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Authentic self-expression</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Is This For You Section */}
      <div className="py-20 px-4 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-5xl md:text-6xl font-light text-foreground mb-6">
              Is This For You?
            </h2>
            <p className="text-xl text-muted-foreground">
              Rapha Lumina is especially for you if...
            </p>
          </div>

          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-8">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="flex items-start gap-3 text-foreground">
                    <span className="text-primary text-xl flex-shrink-0">✓</span>
                    <span>You grew up in church but it no longer resonates</span>
                  </p>
                  <p className="flex items-start gap-3 text-foreground">
                    <span className="text-primary text-xl flex-shrink-0">✓</span>
                    <span>You're navigating religious deconstruction</span>
                  </p>
                  <p className="flex items-start gap-3 text-foreground">
                    <span className="text-primary text-xl flex-shrink-0">✓</span>
                    <span>You want spirituality that honors your intelligence</span>
                  </p>
                  <p className="flex items-start gap-3 text-foreground">
                    <span className="text-primary text-xl flex-shrink-0">✓</span>
                    <span>You're curious about quantum consciousness</span>
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="flex items-start gap-3 text-foreground">
                    <span className="text-primary text-xl flex-shrink-0">✓</span>
                    <span>You're healing from religious trauma</span>
                  </p>
                  <p className="flex items-start gap-3 text-foreground">
                    <span className="text-primary text-xl flex-shrink-0">✓</span>
                    <span>You want to understand manifestation beyond "woo-woo"</span>
                  </p>
                  <p className="flex items-start gap-3 text-foreground">
                    <span className="text-primary text-xl flex-shrink-0">✓</span>
                    <span>You're ready to trust yourself again</span>
                  </p>
                  <p className="flex items-start gap-3 text-foreground">
                    <span className="text-primary text-xl flex-shrink-0">✓</span>
                    <span>You're seeking your authentic purpose</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="py-20 px-4 bg-gradient-to-b from-background to-primary/5">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mb-4">
              Join the Awakening
            </h2>
            <p className="text-lg text-muted-foreground">
              Receive wisdom, insights, and updates on new offerings. Join our community of conscious seekers.
            </p>
          </div>

          <Button 
            asChild
            size="lg" 
            className="px-12 py-6 text-lg"
          >
            <a 
              href="#" 
              className="systeme-show-popup-21249339"
              data-testid="button-newsletter-join"
            >
              Join Now
            </a>
          </Button>

          <p className="text-xs text-muted-foreground mt-6">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </div>

      {/* Newsletter Popup Modal */}
      <Dialog open={showNewsletterPopup} onOpenChange={setShowNewsletterPopup}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-newsletter-popup">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-center">
              Join the Awakening ✨
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              Receive wisdom, insights, and updates on new offerings. Join our community of conscious seekers.
            </DialogDescription>
          </DialogHeader>
          
          <div className="pt-4">
            <Button 
              asChild
              size="lg" 
              className="w-full"
            >
              <a 
                href="#" 
                className="systeme-show-popup-21249339"
                data-testid="button-popup-newsletter-join"
              >
                Join Now
              </a>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <div className="py-12 px-4 border-t bg-muted/30">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src={logo} alt="Rapha Lumina" className="h-12 w-12" />
            <span className="font-display text-2xl text-foreground">Rapha Lumina</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Integrating psychology, quantum mechanics, and ancient wisdom for conscious awakening and spiritual transformation
          </p>
          <div className="pt-4 text-xs text-muted-foreground">
            <a href="/privacy" className="underline hover:text-foreground transition-colors" data-testid="link-privacy">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
