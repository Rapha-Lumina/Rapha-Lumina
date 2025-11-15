import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Types
export interface LimitInfo {
  tier: "guest" | "free" | "premium" | "transformation";
  remaining: number | "unlimited";
  total: number | "unlimited";
  resetTime: Date | null;
  allowed: boolean;
}

interface ChatLimitContextValue {
  limitInfo: LimitInfo | null;
  isLoading: boolean;
  showLimitModal: boolean;
  modalVariant: "guest" | "free" | "premium" | null;
  refreshLimitInfo: () => Promise<void>;
  incrementUsage: () => void;
  closeModal: () => void;
  guestChatCount: number;
}

// Create context
const ChatLimitContext = createContext<ChatLimitContextValue | undefined>(undefined);

// Provider props
interface ChatLimitProviderProps {
  children: ReactNode;
  initialData?: Partial<LimitInfo>;
}

// localStorage key for guest chat tracking
const GUEST_CHATS_KEY = "rapha_lumina_guest_chats";

export function ChatLimitProvider({ children, initialData }: ChatLimitProviderProps) {
  const [limitInfo, setLimitInfo] = useState<LimitInfo | null>(
    initialData ? {
      tier: "guest",
      remaining: 2,
      total: 2,
      resetTime: null,
      allowed: true,
      ...initialData
    } : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [modalVariant, setModalVariant] = useState<"guest" | "free" | "premium" | null>(null);
  const [guestChatCount, setGuestChatCount] = useState(0);

  // Load guest chat count from localStorage on mount
  useEffect(() => {
    const storedCount = localStorage.getItem(GUEST_CHATS_KEY);
    if (storedCount) {
      try {
        setGuestChatCount(parseInt(storedCount, 10) || 0);
      } catch (error) {
        console.error("Failed to parse guest chat count:", error);
        setGuestChatCount(0);
      }
    }
  }, []);

  // Fetch limit info from API
  const refreshLimitInfo = async () => {
    setIsLoading(true);
    try {
      // Include guest chat count in request if applicable
      const response = await fetch("/api/chat/limit-check", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Parse reset time if provided
        const resetTime = data.resetTime ? new Date(data.resetTime) : null;

        setLimitInfo({
          tier: data.tier || "guest",
          remaining: data.remaining ?? "unlimited",
          total: data.dailyLimit ?? "unlimited",
          resetTime,
          allowed: data.allowed ?? true,
        });
      } else if (response.status === 429) {
        // Limit reached - extract info from response
        const data = await response.json();
        const resetTime = data.resetTime ? new Date(data.resetTime) : null;

        setLimitInfo({
          tier: data.tier || "guest",
          remaining: 0,
          total: data.dailyLimit ?? 2,
          resetTime,
          allowed: false,
        });

        // Show appropriate modal based on tier
        const variant = data.tier === "premium" ? "premium" : data.tier === "free" ? "free" : "guest";
        setModalVariant(variant);
        setShowLimitModal(true);
      } else {
        console.error("Failed to fetch limit info:", response.statusText);
        // Fail open - don't block users on API errors
      }
    } catch (error) {
      console.error("Error fetching limit info:", error);
      // Fail open - don't block users on network errors
    } finally {
      setIsLoading(false);
    }
  };

  // Increment usage count (for guests, update localStorage)
  const incrementUsage = () => {
    if (limitInfo?.tier === "guest") {
      const newCount = guestChatCount + 1;
      setGuestChatCount(newCount);
      localStorage.setItem(GUEST_CHATS_KEY, newCount.toString());

      // Update limit info to reflect new remaining count
      setLimitInfo(prev => prev ? {
        ...prev,
        remaining: Math.max(0, 2 - newCount),
      } : null);

      // Show modal if guest has hit the limit
      if (newCount >= 2) {
        setModalVariant("guest");
        setShowLimitModal(true);
      }
    } else {
      // For authenticated users, refresh from API
      refreshLimitInfo();
    }
  };

  // Close modal
  const closeModal = () => {
    setShowLimitModal(false);
    setModalVariant(null);
  };

  // Fetch limit info on mount
  useEffect(() => {
    refreshLimitInfo();
  }, []);

  const value: ChatLimitContextValue = {
    limitInfo,
    isLoading,
    showLimitModal,
    modalVariant,
    refreshLimitInfo,
    incrementUsage,
    closeModal,
    guestChatCount,
  };

  return (
    <ChatLimitContext.Provider value={value}>
      {children}
    </ChatLimitContext.Provider>
  );
}

// Custom hook to use the context
export function useChatLimit() {
  const context = useContext(ChatLimitContext);
  if (context === undefined) {
    throw new Error("useChatLimit must be used within a ChatLimitProvider");
  }
  return context;
}
