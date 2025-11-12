import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, LogIn } from "lucide-react";
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
          <CardHeader className="text-center space-y-6">
            <div className="flex justify-center">
              <img src={logo} alt="Rapha Lumina" className="h-24 w-24" />
            </div>
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-display">
              Thank You for Confirming Your Email!
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground mb-6">
              Your email has been successfully verified. You can now log in to access your account and begin your spiritual journey.
            </p>
            
            <Button
              size="lg"
              className="w-full text-lg py-6"
              onClick={handleLogin}
              data-testid="button-login"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Log In to Your Account
            </Button>
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
