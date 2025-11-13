import { storage } from "../storage";
import type { Subscription } from "../../shared/schema";

/**
 * Tier configuration defining daily chat limits
 */
const TIER_LIMITS = {
  free: 5,
  premium: 10,
  transformation: -1, // -1 means unlimited
} as const;

/**
 * Guest user limit (no account)
 */
const GUEST_LIMIT = 2;

/**
 * Result of checking chat limits
 */
export interface LimitCheckResult {
  allowed: boolean;
  tier: string;
  dailyLimit: number | string;
  used: number;
  remaining: number | string;
  resetTime: Date | null;
  upgradeMessage?: string;
  upgradeUrl?: string;
}

/**
 * ChatLimitService
 *
 * Handles chat limit enforcement for authenticated users and guests.
 * - Checks if user can send a chat message
 * - Increments usage counters
 * - Resets daily limits at UTC midnight
 * - Provides upgrade prompts when limits are reached
 */
export class ChatLimitService {
  /**
   * Check if an authenticated user can send a chat message
   * Automatically resets daily usage if a new day has started
   *
   * @param userId - The user's ID
   * @param tier - The user's subscription tier
   * @returns LimitCheckResult with allowed status and usage info
   */
  async checkLimit(userId: string, tier: string): Promise<LimitCheckResult> {
    try {
      // Get user's subscription
      let subscription = await storage.getUserSubscription(userId);

      // If no subscription exists, create a free tier subscription
      if (!subscription) {
        subscription = await this.createDefaultSubscription(userId);
      }

      // Check if we need to reset daily usage (new day)
      if (this.shouldResetDailyUsage(subscription.lastResetDate)) {
        subscription = await this.resetDailyUsage(subscription.id);
      }

      // Get tier limit configuration
      const tierKey = tier as keyof typeof TIER_LIMITS;
      const dailyLimit = TIER_LIMITS[tierKey] || TIER_LIMITS.free;

      // Unlimited tier (transformation) always allowed
      if (dailyLimit === -1) {
        return {
          allowed: true,
          tier,
          dailyLimit: "unlimited",
          used: parseInt(subscription.dailyChatsUsed),
          remaining: "unlimited",
          resetTime: this.getNextResetTime(),
        };
      }

      // Parse current usage
      const used = parseInt(subscription.dailyChatsUsed);
      const remaining = Math.max(0, dailyLimit - used);
      const allowed = used < dailyLimit;

      // Build result
      const result: LimitCheckResult = {
        allowed,
        tier,
        dailyLimit,
        used,
        remaining,
        resetTime: this.getNextResetTime(),
      };

      // Add upgrade prompt if limit exceeded
      if (!allowed) {
        result.upgradeMessage = this.getUpgradeMessage(tier);
        result.upgradeUrl = this.getUpgradeUrl(tier);
      }

      return result;
    } catch (error) {
      // FAIL-OPEN: If limit check fails, log error but allow chat
      console.error("ChatLimitService.checkLimit failed (fail-open):", error);
      return {
        allowed: true,
        tier: tier || "free",
        dailyLimit: "unknown",
        used: 0,
        remaining: "unknown",
        resetTime: null,
      };
    }
  }

  /**
   * Increment the daily chat usage counter for a user
   *
   * @param userId - The user's ID
   */
  async incrementUsage(userId: string): Promise<void> {
    try {
      const subscription = await storage.getUserSubscription(userId);
      if (!subscription) {
        console.warn(`incrementUsage: No subscription found for user ${userId}`);
        return;
      }

      // Don't increment for unlimited tier (optional: can track for analytics)
      if (subscription.tier === "transformation") {
        return;
      }

      // Increment daily usage counter
      const newUsage = parseInt(subscription.dailyChatsUsed) + 1;
      await storage.updateSubscription(subscription.id, {
        dailyChatsUsed: newUsage.toString(),
        updatedAt: new Date(),
      });
    } catch (error) {
      // Non-critical error: log but don't fail the chat
      console.error("ChatLimitService.incrementUsage failed (non-critical):", error);
    }
  }

  /**
   * Reset daily usage counter if a new day has started
   *
   * @param subscriptionId - The subscription ID to reset
   * @returns Updated subscription object
   */
  private async resetDailyUsage(subscriptionId: string): Promise<Subscription> {
    const subscription = await storage.getSubscription(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    // Reset daily usage and update last reset date
    const updated = await storage.updateSubscription(subscriptionId, {
      dailyChatsUsed: "0",
      lastResetDate: new Date(),
      updatedAt: new Date(),
    });

    return updated;
  }

  /**
   * Check if daily usage should be reset based on last reset date
   *
   * @param lastResetDate - The last time daily usage was reset
   * @returns true if a new day has started (UTC)
   */
  private shouldResetDailyUsage(lastResetDate: Date | null): boolean {
    if (!lastResetDate) {
      return true; // Never reset before, needs reset
    }

    // Compare dates in UTC
    const now = new Date();
    const lastReset = new Date(lastResetDate);

    const nowDateUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const lastResetDateUTC = Date.UTC(
      lastReset.getUTCFullYear(),
      lastReset.getUTCMonth(),
      lastReset.getUTCDate()
    );

    // If current date is different from last reset date, we need to reset
    return nowDateUTC > lastResetDateUTC;
  }

  /**
   * Calculate the next reset time (midnight UTC tomorrow)
   *
   * @returns Date object for next UTC midnight
   */
  private getNextResetTime(): Date {
    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);
    return tomorrow;
  }

  /**
   * Create a default free tier subscription for a user
   *
   * @param userId - The user's ID
   * @returns Created subscription object
   */
  private async createDefaultSubscription(userId: string): Promise<Subscription> {
    return await storage.createSubscription({
      userId,
      tier: "free",
      chatLimit: "5",
      chatsUsed: "0",
      dailyChatsUsed: "0",
      status: "active",
    });
  }

  /**
   * Get tier-specific upgrade message when limit is exceeded
   *
   * @param tier - Current subscription tier
   * @returns Upgrade message string
   */
  private getUpgradeMessage(tier: string): string {
    switch (tier) {
      case "free":
        return "Daily limit reached. Upgrade to Premium for 10 daily chats.";
      case "premium":
        return "Daily limit reached. Upgrade to Transformation for unlimited chats.";
      default:
        return "Chat limit reached. Please upgrade your subscription.";
    }
  }

  /**
   * Get tier-specific upgrade URL with tracking parameters
   *
   * @param tier - Current subscription tier
   * @returns Upgrade URL string
   */
  private getUpgradeUrl(tier: string): string {
    const source = "chat_limit_prompt";
    switch (tier) {
      case "free":
        return `/pricing?source=${source}&tier=free`;
      case "premium":
        return `/pricing?source=${source}&tier=premium`;
      default:
        return `/pricing?source=${source}`;
    }
  }

  /**
   * Get usage status for an authenticated user
   *
   * @param userId - The user's ID
   * @returns LimitCheckResult with current usage info
   */
  async getUsageStatus(userId: string): Promise<LimitCheckResult> {
    const subscription = await storage.getUserSubscription(userId);
    if (!subscription) {
      return {
        allowed: true,
        tier: "free",
        dailyLimit: TIER_LIMITS.free,
        used: 0,
        remaining: TIER_LIMITS.free,
        resetTime: this.getNextResetTime(),
      };
    }

    return await this.checkLimit(userId, subscription.tier);
  }

  /**
   * Check guest user limit (frontend handles localStorage, backend validates)
   *
   * @param guestChatCount - Number of chats the guest has used (from frontend)
   * @returns Information about guest limit status
   */
  checkGuestLimit(guestChatCount: number): {
    allowed: boolean;
    limit: number;
    used: number;
    remaining: number;
    signupPrompt?: string;
    signupUrl?: string;
  } {
    const allowed = guestChatCount < GUEST_LIMIT;
    const remaining = Math.max(0, GUEST_LIMIT - guestChatCount);

    return {
      allowed,
      limit: GUEST_LIMIT,
      used: guestChatCount,
      remaining,
      signupPrompt: allowed
        ? undefined
        : "You've used your 2 free chats! Sign up for 5 daily chats.",
      signupUrl: allowed ? undefined : "/signup?source=guest_limit",
    };
  }
}

// Export singleton instance
export const chatLimitService = new ChatLimitService();
