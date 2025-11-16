import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, X, Share, MoreVertical } from "lucide-react";

export function AddToHomeScreen() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if user is on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isIOSDevice = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroidDevice = /Android/i.test(navigator.userAgent);
    
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    
    // Check if user has dismissed the prompt before
    const hasSeenPrompt = localStorage.getItem('addToHomeScreenPromptDismissed');
    
    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);

    // Show prompt only if:
    // - User is on mobile
    // - App is not installed
    // - User hasn't dismissed it before
    if (isMobile && !isStandalone && !isIOSStandalone && !hasSeenPrompt) {
      // Delay showing prompt by 3 seconds for better UX
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }

    // Listen for beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android/Chrome - use native install prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowPrompt(false);
        localStorage.setItem('addToHomeScreenPromptDismissed', 'true');
      }
      
      setDeferredPrompt(null);
    }
    // For iOS, instructions are shown in the card
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('addToHomeScreenPromptDismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300"
      data-testid="add-to-homescreen-overlay"
    >
      <Card className="w-full max-w-md border-primary/20 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <img 
                  src="/icon-192.png" 
                  alt="Rapha Lumina" 
                  className="w-10 h-10 rounded-lg"
                />
              </div>
              <div>
                <CardTitle className="text-lg">Install Rapha Lumina</CardTitle>
                <CardDescription className="text-xs">
                  Add to your home screen for quick access
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 h-8 w-8"
              onClick={handleDismiss}
              data-testid="button-dismiss-install"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isIOS ? (
            // iOS Instructions
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Install this app on your iPhone:
              </p>
              <ol className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-semibold shrink-0">1.</span>
                  <span>
                    Tap the <Share className="w-4 h-4 inline mx-1 text-primary" /> 
                    <strong>Share</strong> button at the bottom of Safari
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-semibold shrink-0">2.</span>
                  <span>
                    Scroll down and tap <strong>"Add to Home Screen"</strong> 
                    <Download className="w-4 h-4 inline ml-1 text-primary" />
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-semibold shrink-0">3.</span>
                  <span>
                    Tap <strong>"Add"</strong> in the top right corner
                  </span>
                </li>
              </ol>
              <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
                💡 The Rapha Lumina icon will appear on your home screen with instant access to your spiritual guidance.
              </p>
            </div>
          ) : isAndroid ? (
            // Android Instructions
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Install this app for the best experience:
              </p>
              
              {deferredPrompt ? (
                <Button 
                  className="w-full gap-2" 
                  size="lg"
                  onClick={handleInstallClick}
                  data-testid="button-install-android"
                >
                  <Download className="w-5 h-5" />
                  Add to Home Screen
                </Button>
              ) : (
                <ol className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold shrink-0">1.</span>
                    <span>
                      Tap the <MoreVertical className="w-4 h-4 inline mx-1 text-primary" /> 
                      <strong>Menu</strong> button (three dots)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold shrink-0">2.</span>
                    <span>
                      Select <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold shrink-0">3.</span>
                    <span>
                      Tap <strong>"Add"</strong> or <strong>"Install"</strong>
                    </span>
                  </li>
                </ol>
              )}
              
              <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
                💡 Access Rapha Lumina instantly from your home screen like a native app.
              </p>
            </div>
          ) : (
            // Generic mobile instructions
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Add Rapha Lumina to your home screen for quick access to spiritual guidance.
              </p>
              <Button 
                className="w-full gap-2" 
                size="lg"
                onClick={handleDismiss}
                data-testid="button-ok-install"
              >
                Got it
              </Button>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={handleDismiss}
            data-testid="button-maybe-later"
          >
            Maybe Later
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
