import { Sparkles } from "lucide-react";

export function LoadingIndicator() {
  return (
    <div className="flex items-center gap-3 p-6" data-testid="loading-indicator">
      <div className="relative">
        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        <div className="absolute inset-0 h-5 w-5 text-primary animate-ping opacity-30">
          <Sparkles className="h-5 w-5" />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground font-wisdom italic">
          Thinking
        </span>
        <span className="inline-flex gap-1">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </span>
      </div>
    </div>
  );
}
