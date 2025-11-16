import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { useState, useEffect } from "react";

function CurrencyToggle({ currency, onChange }: { currency: "USD" | "ZAR"; onChange: (c: "USD" | "ZAR") => void }) {
  return (
    <div className="inline-flex items-center rounded-lg border bg-background p-1 shadow-sm">
      {(["USD", "ZAR"] as const).map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
            currency === c ? "bg-primary text-primary-foreground" : "text-muted-foreground hover-elevate"
          }`}
          data-testid={`button-currency-${c.toLowerCase()}`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

export default function Membership() {
  const [currency, setCurrency] = useState<"USD" | "ZAR">("USD");
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    async function detectCurrency() {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.country_code === 'ZA') {
          setCurrency('ZAR');
        } else {
          setCurrency('USD');
        }
      } catch (error) {
        console.log('Currency detection failed, defaulting to USD');
        setCurrency('USD');
      } finally {
        setIsDetecting(false);
      }
    }

    detectCurrency();
  }, []);

  const tiers = [
    {
      name: "Free Access",
      icon: Sparkles,
      priceUSD: "$0",
      priceZAR: "R0",
      period: "forever",
      description: "Begin your spiritual journey with foundational wisdom",
      features: [
        "5 chat sessions with Rapha Lumina",
        "Access to core philosophical wisdom",
        "Socratic dialogue method",
        "Basic spiritual guidance",
        "Community forum access"
      ],
      cta: "Start Free",
      highlighted: false,
      chatLimit: 5,
      funnelUrlUSD: "/chat",
      funnelUrlZAR: "/chat"
    },
    {
      name: "Premium Wisdom",
      icon: Zap,
      priceUSD: "$20",
      priceZAR: "R290",
      period: "per month",
      description: "Deepen your practice with advanced features and personalized support. 7-day free trial before billing.",
      features: [
        "10 chat sessions per month with Rapha Lumina",
        "Voice interaction enabled",
        "Priority response times",
        "Advanced wisdom content library",
        "Personalized spiritual guidance",
        "Monthly group meditation sessions",
        "Downloadable contemplation exercises",
        "Email support"
      ],
      cta: "Upgrade to Premium",
      highlighted: true,
      chatLimit: 10,
      funnelUrlUSD: "/contact",
      funnelUrlZAR: "/contact"
    },
    {
      name: "Transformation Package",
      icon: Crown,
      priceUSD: "$470",
      priceZAR: "R4970",
      period: "one-time",
      description: "Complete awakening program with comprehensive support and resources. One-time investment, lifetime access.",
      features: [
        "Unlimited chat sessions with Rapha Lumina AI chatbot",
        "12-week guided transformation program",
        "Weekly 1-on-1 spiritual coaching calls",
        "Complete eBook collection (5 books)",
        "Full course access (all 3 courses)",
        "Private community access",
        "Lifetime updates and content",
        "Personalized meditation practices",
        "Integration of your unique path"
      ],
      cta: "Begin Transformation",
      highlighted: false,
      chatLimit: null,
      funnelUrlUSD: "/contact",
      funnelUrlZAR: "/contact"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-primary/10 to-background py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
              <div className="text-center md:text-left">
                <h1 className="font-display text-5xl sm:text-6xl mb-3">
                  Choose Your Path
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  From free exploration to complete transformation, find the level of support that resonates with your journey.
                </p>
              </div>
              <div className="flex justify-center md:justify-end">
                <CurrencyToggle currency={currency} onChange={setCurrency} />
              </div>
            </div>
          </div>
        </div>

        {/* Membership Tiers */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {tiers.map((tier, index) => (
              <Card 
                key={index}
                className={`flex flex-col ${tier.highlighted ? 'border-primary shadow-lg scale-105' : ''}`}
                data-testid={`card-tier-${tier.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <tier.icon className={`w-6 h-6 ${tier.highlighted ? 'text-primary' : 'text-muted-foreground'}`} />
                    <CardTitle className="text-2xl font-serif">{tier.name}</CardTitle>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold">{currency === "USD" ? tier.priceUSD : tier.priceZAR}</span>
                    <span className="text-muted-foreground">/ {tier.period}</span>
                  </div>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={tier.highlighted ? "default" : "outline"}
                    size="lg"
                    onClick={() => {
                      const funnelUrl = currency === "USD" ? tier.funnelUrlUSD : tier.funnelUrlZAR;
                      window.location.href = funnelUrl;
                    }}
                    data-testid={`button-select-${tier.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {tier.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-muted/30 py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl mb-4">Not Sure Which Path?</h2>
            <p className="text-muted-foreground mb-6">
              Start with our free access to explore the wisdom of Rapha Lumina. 
              You can always upgrade as your journey deepens.
            </p>
            <Button variant="outline" size="lg" asChild>
              <a href="/chat" data-testid="link-start-free-chat">
                Start a Free Conversation
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
