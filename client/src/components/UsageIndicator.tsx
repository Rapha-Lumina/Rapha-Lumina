import { useState, useEffect } from "react";
import { Sparkles, AlertCircle, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface UsageIndicatorProps {
  remaining: number | "unlimited" | "unknown";
  total: number | "unlimited";
  tier: "guest" | "free" | "premium" | "transformation";
  resetTime: Date | null;
  isLoading?: boolean;
  onUpgradeClick?: () => void;
  onSignupClick?: () => void;
  className?: string;
}

type DisplayState = "normal" | "warning" | "critical";

interface CopyContent {
  primary: string;
  secondary?: string;
  icon: LucideIcon;
}

export function UsageIndicator({
  remaining,
  total,
  tier,
  resetTime,
  isLoading = false,
  onUpgradeClick,
  onSignupClick,
  className,
}: UsageIndicatorProps) {
  const [displayState, setDisplayState] = useState<DisplayState>("normal");
  const [timeUntilReset, setTimeUntilReset] = useState<string>("");

  // Calculate display state based on remaining count
  useEffect(() => {
    if (remaining === "unlimited" || remaining === "unknown") {
      setDisplayState("normal");
    } else if (remaining <= 1) {
      setDisplayState("critical");
    } else if (remaining <= 3) {
      setDisplayState("warning");
    } else {
      setDisplayState("normal");
    }
  }, [remaining]);

  // Update countdown timer
  useEffect(() => {
    if (resetTime) {
      const updateTime = () => {
        setTimeUntilReset(formatTimeUntilReset(resetTime));
      };

      // Initial calculation
      updateTime();

      // Update every minute
      const interval = setInterval(updateTime, 60000);
      return () => clearInterval(interval);
    }
  }, [resetTime]);

  // Don't show indicator for unlimited tier
  if (tier === "transformation" || remaining === "unlimited") {
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center px-4 py-2 rounded-full bg-muted/30 backdrop-blur-sm", className)}>
        <span className="text-sm text-muted-foreground">Checking availability...</span>
      </div>
    );
  }

  const copy = getCopyForState(displayState, remaining, tier, timeUntilReset);

  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-2 rounded-full transition-all duration-300",
        displayState === "normal" && "bg-muted/30 backdrop-blur-sm",
        displayState === "warning" && "bg-amber-50/80 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 shadow-md shadow-amber-500/20",
        displayState === "critical" && "bg-rose-50/80 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-700 shadow-md shadow-rose-500/20",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        <copy.icon
          className={cn(
            "w-4 h-4 flex-shrink-0",
            displayState === "warning" && "text-amber-600 dark:text-amber-400",
            displayState === "critical" && "text-rose-600 dark:text-rose-400",
            displayState === "normal" && "text-primary"
          )}
        />
        <span
          className={cn(
            "text-sm font-medium",
            displayState === "warning" && "text-amber-700 dark:text-amber-400",
            displayState === "critical" && "text-rose-700 dark:text-rose-400",
            displayState === "normal" && "text-muted-foreground"
          )}
        >
          {copy.primary}
        </span>
      </div>

      {copy.secondary && (
        <button
          onClick={tier === "guest" ? onSignupClick : onUpgradeClick}
          className={cn(
            "text-xs font-medium underline decoration-dotted underline-offset-2 hover:text-primary transition-colors flex items-center gap-1",
            displayState === "warning" && "text-amber-700 dark:text-amber-400",
            displayState === "critical" && "text-rose-700 dark:text-rose-400",
            displayState === "normal" && "text-muted-foreground"
          )}
          aria-label={tier === "guest" ? "Sign up for more chats" : "Upgrade for more chats"}
        >
          {copy.secondary}
          <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// Helper function to format time until reset
function formatTimeUntilReset(resetTime: Date): string {
  const now = new Date();
  const diff = resetTime.getTime() - now.getTime();

  if (diff <= 0) {
    return "soon";
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours < 1) {
    return `${minutes}m`;
  } else if (hours < 6) {
    return `${hours}h ${minutes}m`;
  } else {
    return resetTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
}

// Helper function to get copy based on state
function getCopyForState(
  state: DisplayState,
  remaining: number | "unlimited" | "unknown",
  tier: string,
  timeUntilReset: string
): CopyContent {
  // Guest tier copy
  if (tier === "guest") {
    if (remaining === 0) {
      return {
        primary: "Guest limit reached",
        secondary: "Create account to continue",
        icon: Sparkles,
      };
    } else if (remaining === 1) {
      return {
        primary: "1 chat remaining as guest",
        secondary: "Sign up for 5 daily chats",
        icon: Sparkles,
      };
    } else {
      return {
        primary: "2 chats available as guest",
        secondary: undefined,
        icon: Sparkles,
      };
    }
  }

  // Free tier copy
  if (tier === "free") {
    if (state === "critical") {
      return {
        primary: remaining === 0
          ? `Daily limit reached${timeUntilReset ? ` • Resets in ${timeUntilReset}` : ""}`
          : `1 conversation remaining${timeUntilReset ? ` • Resets in ${timeUntilReset}` : ""}`,
        secondary: remaining === 0 ? "Upgrade to Premium" : "Premium: 10 daily chats",
        icon: Clock,
      };
    } else if (state === "warning") {
      return {
        primary: `${remaining} conversations remaining today`,
        secondary: "Premium: 10 daily chats",
        icon: AlertCircle,
      };
    } else {
      return {
        primary: `${remaining} daily chats remaining`,
        secondary: undefined,
        icon: Sparkles,
      };
    }
  }

  // Premium tier copy
  if (tier === "premium") {
    if (state === "critical") {
      return {
        primary: remaining === 0
          ? `Daily limit reached${timeUntilReset ? ` • Resets in ${timeUntilReset}` : ""}`
          : `1 conversation remaining${timeUntilReset ? ` • Resets in ${timeUntilReset}` : ""}`,
        secondary: remaining === 0 ? "Upgrade to Transformation" : "Transformation: Unlimited",
        icon: Clock,
      };
    } else if (state === "warning") {
      return {
        primary: `${remaining} conversations remaining today`,
        secondary: "Transformation: Unlimited chats",
        icon: AlertCircle,
      };
    } else {
      return {
        primary: `${remaining} daily chats remaining`,
        secondary: undefined,
        icon: Sparkles,
      };
    }
  }

  // Default fallback
  return {
    primary: typeof remaining === "number" ? `${remaining} chats remaining` : "Checking...",
    secondary: undefined,
    icon: Sparkles,
  };
}
