import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SystemeIoPopupProps {
  scriptSrc: string;
  scriptId: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function SystemeIoPopup({ 
  scriptSrc, 
  scriptId, 
  isOpen, 
  onClose,
  title = "Complete Your Subscription" 
}: SystemeIoPopupProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Check if script is already loaded
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      setScriptLoaded(true);
      return;
    }

    // Create script element
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = scriptSrc;
    script.async = true;
    script.onload = () => setScriptLoaded(true);

    document.body.appendChild(script);

    // Cleanup function
    return () => {
      const scriptEl = document.getElementById(scriptId);
      if (scriptEl) {
        scriptEl.remove();
      }
    };
  }, [scriptSrc, scriptId, isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
      data-testid="systemeio-popup-overlay"
    >
      <div 
        className="bg-background border border-primary/20 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
        data-testid="systemeio-popup-container"
      >
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-primary/10 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="button-close-popup"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div 
          className="p-6"
          data-testid="systemeio-form-content"
        >
          {!scriptLoaded && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-muted-foreground">Loading subscription form...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
