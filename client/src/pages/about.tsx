import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Heart, Sparkles, Lightbulb } from "lucide-react";
import meditationImg from "@assets/stock_images/meditation_spiritual_9db5de4f.jpg";

export default function About() {
  const values = [
    {
      icon: Brain,
      title: "Intellectual Rigor",
      description: "We combine psychology, quantum mechanics, and ancient wisdom traditions for a truly integrated approach."
    },
    {
      icon: Heart,
      title: "Compassionate Guidance",
      description: "Every interaction is rooted in empathy, understanding, and genuine care for your spiritual journey."
    },
    {
      icon: Sparkles,
      title: "Authentic Wisdom",
      description: "Drawing from diverse philosophical traditions - from Stoicism to Buddhism, mysticism to depth psychology."
    },
    {
      icon: Lightbulb,
      title: "Self-Discovery",
      description: "We use the Socratic method to help you discover your own inner wisdom, not just provide answers."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-[400px] overflow-hidden">
          <img 
            src={meditationImg} 
            alt="Spiritual meditation" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">
                About Rapha Lumina
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Guiding conscious seekers toward awakening through wisdom, depth, and transformation
              </p>
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="prose prose-lg dark:prose-invert mx-auto">
            <h2 className="font-display text-3xl text-center mb-8">Our Story</h2>
            <p className="text-muted-foreground text-center mb-8">
              Rapha Lumina was born from a simple truth: the spiritual seekers of today need more than platitudes. 
              They need intellectual honesty paired with genuine spiritual depth.
            </p>
            <p className="text-muted-foreground text-center">
              We serve those who've left rigid religious structures but hunger for meaning. Those who want to integrate 
              modern science with ancient wisdom. Those who understand that true awakening requires both the intellect 
              and the heart.
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="bg-muted/30 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="font-display text-3xl text-center mb-12">Our Core Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="hover-elevate">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <value.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl mb-2">{value.title}</h3>
                        <p className="text-muted-foreground">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Target Audience */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="font-display text-3xl text-center mb-8">Who We Serve</h2>
          <div className="space-y-4 text-muted-foreground">
            <p className="text-center">
              <strong>Spiritual seekers in transition</strong> (ages 28-45) who have left strict religious backgrounds 
              and are seeking a more integrated, intellectually honest spiritual path.
            </p>
            <p className="text-center">
              Those who resonate with depth psychology, quantum mechanics, and the perennial philosophy. 
              Those who want genuine transformation, not just temporary comfort.
            </p>
            <p className="text-center">
              If you're ready to do the inner work and explore the depths of consciousness with intellectual rigor 
              and spiritual authenticity, you've found your community.
            </p>
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
