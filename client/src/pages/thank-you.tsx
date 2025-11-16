import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function ThankYou() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full text-center">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/30">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-foreground mb-6">
            Thank You for Joining!
          </h1>

          {/* Subtitle */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 text-xl sm:text-2xl text-muted-foreground mb-4">
              <Mail className="w-6 h-6 text-primary" />
              <span>Check Your Email</span>
            </div>
            <p className="text-lg text-muted-foreground/90 leading-relaxed max-w-xl mx-auto">
              We've sent you a verification email. Please click the link in the email to verify your account and activate your free tier access.
            </p>
          </div>

          {/* Important Note */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8 max-w-lg mx-auto">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Don't see it?</span> Check your spam or promotions folder. 
              Make sure to add us to your contacts so you never miss our updates.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="px-12 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              data-testid="button-go-home"
            >
              <Link href="/">
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Additional Info */}
          <p className="mt-12 text-sm text-muted-foreground/70">
            Questions? Feel free to reach out via our{" "}
            <Link href="/contact" className="text-primary hover:text-primary/80 transition-colors">
              contact page
            </Link>
            .
          </p>
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
