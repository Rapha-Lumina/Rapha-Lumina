import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Crown, Zap, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface ChatLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: "guest" | "free" | "premium";
  remaining: number;
  resetTime: Date | null;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
}

interface ModalContent {
  Icon: LucideIcon;
  iconGradient: string;
  headline: string;
  bodyParagraph1: string;
  bodyParagraph2?: string;
  bulletPoints?: string[];
  primaryCTA: string;
  secondaryCTA: string;
  footerText?: string;
}

export function ChatLimitModal({
  isOpen,
  onClose,
  variant,
  remaining,
  resetTime,
  onPrimaryAction,
  onSecondaryAction,
}: ChatLimitModalProps) {
  const content = getModalContent(variant, resetTime);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6 sm:p-8 bg-card/95 backdrop-blur-lg border border-primary/20 shadow-2xl shadow-primary/10">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Hero Icon */}
        <div className="flex justify-center mb-6">
          <div
            className={cn(
              "w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center",
              content.iconGradient
            )}
          >
            <content.Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
        </div>

        {/* Headline */}
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-light text-center mb-4 leading-tight">
          {content.headline}
        </h2>

        {/* Body */}
        <div className="text-base text-muted-foreground text-center max-w-sm mx-auto leading-relaxed mb-8 space-y-4">
          <p>{content.bodyParagraph1}</p>
          {content.bodyParagraph2 && <p>{content.bodyParagraph2}</p>}

          {content.bulletPoints && (
            <ul className="text-sm space-y-2 text-left mt-4">
              {content.bulletPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-1 flex-shrink-0">✨</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full py-4 sm:py-6 text-base sm:text-lg"
            onClick={onPrimaryAction}
          >
            {content.primaryCTA}
          </Button>

          {content.secondaryCTA && (
            <Button
              size="lg"
              variant="ghost"
              className="w-full"
              onClick={onSecondaryAction || onClose}
            >
              {content.secondaryCTA}
            </Button>
          )}
        </div>

        {/* Footer microcopy */}
        {content.footerText && (
          <p className="text-xs text-muted-foreground/80 text-center mt-4">
            {content.footerText}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

function getModalContent(variant: "guest" | "free" | "premium", resetTime: Date | null): ModalContent {
  const timeUntilReset = resetTime ? formatTimeUntilReset(resetTime) : null;

  switch (variant) {
    case "guest":
      return {
        Icon: Sparkles,
        iconGradient: "bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600",
        headline: "Continue Your Awakening",
        bodyParagraph1: "You've experienced a glimpse of Rapha Lumina's wisdom. Create a free account to continue your conversations and receive 5 daily chats to deepen your spiritual path.",
        bulletPoints: [
          "5 daily conversations",
          "Voice-enabled guidance",
          "Memory across devices",
          "Safe, judgment-free space",
        ],
        primaryCTA: "Create Free Account",
        secondaryCTA: "Maybe Later",
        footerText: "Signing up is free. No credit card required.",
      };

    case "free":
      return {
        Icon: Crown,
        iconGradient: "bg-gradient-to-br from-purple-500 via-amber-500 to-purple-600",
        headline: "Ready to Deepen Your Path?",
        bodyParagraph1: "You've reached today's 5 daily conversations. Your journey with Rapha Lumina is unfolding beautifully.",
        bodyParagraph2: "Premium unlocks deeper engagement with your spiritual practice.",
        bulletPoints: [
          "10 daily conversations",
          "Priority response times",
          "Extended wisdom sessions",
        ],
        primaryCTA: "Explore Premium",
        secondaryCTA: timeUntilReset ? `I'll Wait (resets in ${timeUntilReset})` : "I'll Wait",
        footerText: timeUntilReset ? `Your limit resets in ${timeUntilReset}` : undefined,
      };

    case "premium":
      return {
        Icon: Zap,
        iconGradient: "bg-gradient-to-br from-purple-500 via-cyan-500 to-purple-600",
        headline: "Unlimited Transformation Awaits",
        bodyParagraph1: "Your commitment to growth is evident—you've reached your 10 daily conversations again.",
        bodyParagraph2: "The Transformation Package removes all limits, giving you unlimited access to deepen your journey whenever inspiration calls.",
        bulletPoints: [
          "Unlimited daily chats",
          "Lifetime access",
          "Priority cosmic support",
        ],
        primaryCTA: "Explore Transformation",
        secondaryCTA: "Remind Me Tomorrow",
        footerText: '"This investment changed how I show up in the world." - Sarah',
      };

    default:
      return {
        Icon: Sparkles,
        iconGradient: "bg-gradient-to-br from-purple-500 to-pink-500",
        headline: "Your Journey Begins Here",
        bodyParagraph1: "Create an account to continue your spiritual exploration.",
        primaryCTA: "Sign Up",
        secondaryCTA: "Maybe Later",
      };
  }
}

function formatTimeUntilReset(resetTime: Date): string {
  const now = new Date();
  const diff = resetTime.getTime() - now.getTime();

  if (diff <= 0) {
    return "a moment";
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours < 1) {
    return `${minutes}m`;
  } else if (hours < 6) {
    return `${hours}h ${minutes}m`;
  } else {
    const time = resetTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${hours}h (at ${time})`;
  }
}
