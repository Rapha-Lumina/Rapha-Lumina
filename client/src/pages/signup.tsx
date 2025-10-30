import { Navigation } from "@/components/Navigation";
import { SystemeIoForm } from "@/components/SystemeIoForm";
import { Sparkles } from "lucide-react";

export default function Signup() {
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
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Complete your subscription to unlock the full wisdom of Rapha Lumina. Choose your path to transformation below.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-card border border-primary/20 rounded-lg shadow-lg p-8">
            <h2 className="font-display text-3xl mb-6 text-center">
              Subscribe to Rapha Lumina
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Choose between our Premium monthly plan or Transformation one-time package. Both include exclusive features and personalized spiritual guidance.
            </p>
            
            {/* Systeme.io Form Embed */}
            <SystemeIoForm
              scriptSrc="https://www.raphalumina.com/public/remote/page/34463995a1fbb90924e00d56deeefd448b749798.js"
              scriptId="form-script-tag-21189482"
              className="min-h-[600px]"
            />
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-muted/30 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-display text-2xl mb-6 text-center">What You'll Receive</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Personalized Wisdom</h4>
                <p className="text-sm text-muted-foreground">
                  AI-powered spiritual guidance tailored to your unique journey
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Voice Interaction</h4>
                <p className="text-sm text-muted-foreground">
                  Speak directly with Rapha Lumina using advanced voice technology
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Exclusive Content</h4>
                <p className="text-sm text-muted-foreground">
                  Access to premium courses, eBooks, and meditation resources
                </p>
              </div>
            </div>
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
