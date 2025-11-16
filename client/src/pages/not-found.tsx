import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2 items-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <h1 className="text-2xl font-display text-foreground">404 Page Not Found</h1>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>

            <Link href="/">
              <Button className="mt-6 w-full" data-testid="button-home">
                <Home className="w-4 h-4 mr-2" />
                Return Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
