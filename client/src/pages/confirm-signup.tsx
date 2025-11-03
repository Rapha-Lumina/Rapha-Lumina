import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, LogIn, UserPlus } from "lucide-react";
import logo from "@assets/Rapha Lumina_1761161536763.png";

export default function ConfirmSignup() {
  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <img src={logo} alt="Rapha Lumina" className="h-20 w-20" />
            </div>
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-display">
              Ready to Begin Your Journey?
            </CardTitle>
            <CardDescription className="text-base">
              Join our community of seekers exploring ancient wisdom and quantum consciousness
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Button
              size="lg"
              className="w-full text-lg py-6"
              asChild
            >
              <a 
                href="#" 
                className="systeme-show-popup-21189482 inline-flex items-center justify-center"
                data-testid="button-join-now"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Join Now
              </a>
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Already a member?
                </span>
              </div>
            </div>
            
            <Button
              size="lg"
              variant="outline"
              className="w-full text-lg py-6"
              onClick={handleLogin}
              data-testid="button-login"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Log In
            </Button>

            <div className="pt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Start with our free tier or explore our membership options
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

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
