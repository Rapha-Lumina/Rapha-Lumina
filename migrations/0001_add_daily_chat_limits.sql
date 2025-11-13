-- Migration: Add daily chat limit tracking to subscriptions table
-- Generated: 2025-11-13
-- Description: Adds dailyChatsUsed and lastResetDate fields for Phase 1 of Chat Limits System

-- Add new columns to subscriptions table
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS daily_chats_used VARCHAR NOT NULL DEFAULT '0',
ADD COLUMN IF NOT EXISTS last_reset_date TIMESTAMP DEFAULT NOW() NOT NULL;

-- Create index for efficient reset queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_last_reset 
ON subscriptions(last_reset_date);

-- Backfill existing data: set lastResetDate to now and dailyChatsUsed to 0
UPDATE subscriptions
SET last_reset_date = NOW(),
    daily_chats_used = '0'
WHERE daily_chats_used IS NULL OR last_reset_date IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN subscriptions.daily_chats_used IS 'Number of chats used today, resets at UTC midnight';
COMMENT ON COLUMN subscriptions.last_reset_date IS 'Timestamp of last daily usage reset (UTC), used to trigger auto-reset';
