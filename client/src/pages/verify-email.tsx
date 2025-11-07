import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function VerifyEmail() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  const token = params.get('token');

  const { data, isLoading, error } = useQuery<{ success: boolean; message: string }>({
    queryKey: ['/api/verify-email', token],
    queryFn: async () => {
      if (!token) {
        throw new Error('No verification token provided');
      }
      return await apiRequest("GET", `/api/verify-email?token=${token}`) as unknown as { success: boolean; message: string };
    },
    retry: false,
    enabled: !!token,
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full text-center">
          {isLoading && (
            <>
              <div className="mb-8 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/30">
                  <Loader2 className="w-12 h-12 text-white animate-spin" />
                </div>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-6">
                Verifying Your Email...
              </h1>
              <p className="text-lg text-muted-foreground">
                Please wait while we verify your account.
              </p>
            </>
          )}

          {data && !error && (
            <>
              <div className="mb-8 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-6">
                Email Verified!
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                {data.message}
              </p>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8 max-w-lg mx-auto">
                <p className="text-sm text-muted-foreground">
                  Your free tier access has been activated with 5 monthly chat messages. You can now log in and begin your spiritual journey.
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="px-12 py-6 text-lg"
                data-testid="button-go-login"
              >
                <Link href="/login">
                  Log In to Your Account
                </Link>
              </Button>
            </>
          )}

          {error && (
            <>
              <div className="mb-8 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                  <XCircle className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-6">
                Verification Failed
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                We couldn't verify your email. The link may have expired or is invalid.
              </p>
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6 mb-8 max-w-lg mx-auto">
                <p className="text-sm text-muted-foreground">
                  If you need a new verification link, please try signing up again or contact support.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  data-testid="button-go-home"
                >
                  <Link href="/">
                    Back to Home
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  data-testid="button-contact"
                >
                  <Link href="/contact">
                    Contact Support
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </main>

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>
    </div>
  );
}
