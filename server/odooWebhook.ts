import { Request, Response } from 'express';
import { db } from './db';
import { users, subscriptions } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { odooService } from './odoo';

// Webhook secret for validation (should be set in environment variables)
const WEBHOOK_SECRET = process.env.ODOO_WEBHOOK_SECRET || '';

interface OdooWebhookPayload {
  event_type?: string;
  model?: string;
  record_id?: number;
  data?: any;
  write_date?: string;
  create_date?: string;
  origin?: string;
  
  // Odoo native webhook format
  _model?: string;
  _id?: number;
  _action?: string;
  _name?: string;
}

/**
 * Normalize webhook payload to handle both custom and Odoo native formats
 */
function normalizePayload(payload: any): OdooWebhookPayload {
  // If it's already in our custom format, return as-is
  if (payload.event_type && payload.model && payload.record_id) {
    return payload;
  }
  
  // If it's Odoo's native format (has _model and _id), convert it
  if (payload._model && payload._id !== undefined) {
    const normalized: OdooWebhookPayload = {
      event_type: payload._action?.includes('created') ? 'created' : 'updated',
      model: payload._model,
      record_id: payload._id,
      data: payload,
      write_date: payload.write_date,
      create_date: payload.create_date,
    };
    
    // Preserve original fields
    normalized._model = payload._model;
    normalized._id = payload._id;
    normalized._action = payload._action;
    normalized._name = payload._name;
    
    return normalized;
  }
  
  // Return as-is if we can't determine format
  return payload;
}

/**
 * Validate webhook signature/secret to ensure request is from Odoo
 */
function validateWebhookSignature(req: Request): boolean {
  if (!WEBHOOK_SECRET) {
    console.warn('[Odoo Webhook] No ODOO_WEBHOOK_SECRET configured - accepting all requests');
    return true;
  }

  const signature = req.headers['x-odoo-signature'] as string;
  const token = req.query.token as string;

  // Support either header-based or query-based authentication
  if (signature === WEBHOOK_SECRET || token === WEBHOOK_SECRET) {
    return true;
  }

  console.error('[Odoo Webhook] Invalid signature/token');
  return false;
}

/**
 * Check if update originated from Rapha Lumina to prevent sync loops
 */
function isOriginRapha(payload: OdooWebhookPayload): boolean {
  return payload.origin === 'rapha' || payload.data?.origin === 'rapha';
}

/**
 * Handle partner (customer) update events from Odoo
 */
async function handlePartnerUpdated(payload: OdooWebhookPayload): Promise<void> {
  try {
    if (!payload.record_id) {
      console.warn('[Odoo Webhook] No record_id in payload, skipping');
      return;
    }
    
    console.log('[Odoo Webhook] Processing partner update:', payload.record_id);

    // Fetch complete partner data from Odoo
    const partner = await odooService.getPartner(payload.record_id);
    if (!partner || !partner.email) {
      console.warn('[Odoo Webhook] Partner has no email, skipping:', payload.record_id);
      return;
    }

    // Find user by odooExternalId first (handles email changes), then fall back to email
    let existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.odooExternalId, String(payload.record_id)))
      .limit(1);

    if (existingUsers.length === 0) {
      // Fall back to email search
      existingUsers = await db
        .select()
        .from(users)
        .where(eq(users.email, partner.email))
        .limit(1);
    }

    if (existingUsers.length === 0) {
      console.log('[Odoo Webhook] No user found with Odoo ID or email:', payload.record_id, partner.email);
      return;
    }

    const user = existingUsers[0];
    
    // Check if this update originated from Rapha to prevent loops
    if (user.odooSource === 'rapha') {
      const timeSinceLastSync = user.odooLastSyncAt ? Date.now() - new Date(user.odooLastSyncAt).getTime() : Infinity;
      // If we synced less than 10 seconds ago and we were the source, skip to avoid immediate loop
      if (timeSinceLastSync < 10000) {
        console.log('[Odoo Webhook] Skipping update - we just synced this record');
        return;
      }
    }
    const writeDate = partner.write_date ? new Date(partner.write_date) : new Date();

    // Check if Odoo record is newer than our record
    if (user.odooLastSyncAt && new Date(user.odooLastSyncAt) >= writeDate) {
      console.log('[Odoo Webhook] Our record is newer, skipping update for user:', user.id);
      return;
    }

    // Extract name parts
    const nameParts = partner.name?.split(' ') || [];
    const firstName = nameParts[0] || user.firstName;
    const lastName = nameParts.slice(1).join(' ') || user.lastName;

    // Update user with Odoo data
    await db
      .update(users)
      .set({
        firstName,
        lastName,
        address: partner.street || user.address,
        odooExternalId: String(payload.record_id),
        odooRevision: writeDate,
        odooLastSyncAt: new Date(),
        odooSource: 'odoo',
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    console.log('[Odoo Webhook] Updated user from Odoo:', user.id);
  } catch (error) {
    console.error('[Odoo Webhook] Error handling partner update:', error);
    throw error;
  }
}

/**
 * Handle sale order state changes from Odoo
 */
async function handleSaleOrderUpdated(payload: OdooWebhookPayload): Promise<void> {
  try {
    if (!payload.record_id) {
      console.warn('[Odoo Webhook] No record_id in payload, skipping');
      return;
    }
    
    console.log('[Odoo Webhook] Processing sale order update:', payload.record_id);

    // Fetch sale order data from Odoo
    const order = await odooService.getSaleOrder(payload.record_id);
    if (!order) {
      console.warn('[Odoo Webhook] Sale order not found:', payload.record_id);
      return;
    }

    // Extract partner ID from order
    const partnerId = Array.isArray(order.partner_id) ? order.partner_id[0] : order.partner_id;
    
    if (!partnerId) {
      console.warn('[Odoo Webhook] No partner ID in sale order:', payload.record_id);
      return;
    }

    // Find user by odooExternalId first, then fall back to partner lookup
    let existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.odooExternalId, String(partnerId)))
      .limit(1);

    if (existingUsers.length === 0) {
      // Fall back to fetching partner and searching by email
      const partner = await odooService.getPartner(partnerId);
      if (!partner || !partner.email) {
        console.warn('[Odoo Webhook] Partner has no email:', partnerId);
        return;
      }

      existingUsers = await db
        .select()
        .from(users)
        .where(eq(users.email, partner.email))
        .limit(1);
    }

    if (existingUsers.length === 0) {
      console.log('[Odoo Webhook] No user found for sale order partner:', partnerId);
      return;
    }

    const user = existingUsers[0];

    // Handle order state changes (e.g., confirmed, paid)
    if (order.state === 'sale' || order.state === 'done') {
      console.log('[Odoo Webhook] Sale order confirmed/completed for user:', user.id);
      // Future: Update enrollments or grant access based on order items
    }

    console.log('[Odoo Webhook] Processed sale order:', payload.record_id);
  } catch (error) {
    console.error('[Odoo Webhook] Error handling sale order update:', error);
    throw error;
  }
}

/**
 * Handle subscription state changes from Odoo
 */
async function handleSubscriptionUpdated(payload: OdooWebhookPayload): Promise<void> {
  try {
    if (!payload.record_id) {
      console.warn('[Odoo Webhook] No record_id in payload, skipping');
      return;
    }
    
    console.log('[Odoo Webhook] Processing subscription update:', payload.record_id);

    // Fetch subscription data from Odoo
    const subscription = await odooService.getSubscription(payload.record_id);
    if (!subscription) {
      console.warn('[Odoo Webhook] Subscription not found:', payload.record_id);
      return;
    }

    // Extract partner ID
    const partnerId = Array.isArray(subscription.partner_id) 
      ? subscription.partner_id[0] 
      : subscription.partner_id;

    if (!partnerId) {
      console.warn('[Odoo Webhook] No partner ID in subscription:', payload.record_id);
      return;
    }

    // Find user by odooExternalId first, then fall back to partner lookup
    let existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.odooExternalId, String(partnerId)))
      .limit(1);

    if (existingUsers.length === 0) {
      // Fall back to fetching partner and searching by email
      const partner = await odooService.getPartner(partnerId);
      if (!partner || !partner.email) {
        console.warn('[Odoo Webhook] Partner has no email:', partnerId);
        return;
      }

      existingUsers = await db
        .select()
        .from(users)
        .where(eq(users.email, partner.email))
        .limit(1);
    }

    if (existingUsers.length === 0) {
      console.log('[Odoo Webhook] No user found for subscription partner:', partnerId);
      return;
    }

    const user = existingUsers[0];

    // Find user's subscription
    const userSubs = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, user.id))
      .limit(1);

    if (userSubs.length === 0) {
      console.log('[Odoo Webhook] No subscription found for user:', user.id);
      return;
    }

    const userSub = userSubs[0];
    const writeDate = subscription.write_date ? new Date(subscription.write_date) : new Date();

    // Check if Odoo record is newer
    if (userSub.odooLastSyncAt && new Date(userSub.odooLastSyncAt) >= writeDate) {
      console.log('[Odoo Webhook] Our subscription record is newer, skipping update');
      return;
    }

    // Map Odoo subscription state to our status
    let status: 'active' | 'cancelled' | 'expired' = 'active';
    if (subscription.state === 'closed' || subscription.state === 'cancelled') {
      status = 'cancelled';
    } else if (subscription.state === 'expired') {
      status = 'expired';
    }

    // Update subscription
    await db
      .update(subscriptions)
      .set({
        status,
        odooExternalId: String(payload.record_id),
        odooRevision: writeDate,
        odooLastSyncAt: new Date(),
        odooSource: 'odoo',
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, userSub.id));

    console.log('[Odoo Webhook] Updated subscription from Odoo:', userSub.id);
  } catch (error) {
    console.error('[Odoo Webhook] Error handling subscription update:', error);
    throw error;
  }
}

/**
 * Main webhook handler
 */
export async function handleOdooWebhook(req: Request, res: Response): Promise<void> {
  try {
    // Validate webhook signature
    if (!validateWebhookSignature(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Normalize payload to handle both custom and Odoo native formats
    const payload: OdooWebhookPayload = normalizePayload(req.body);

    // Ignore events that originated from Rapha Lumina to prevent loops
    if (isOriginRapha(payload)) {
      console.log('[Odoo Webhook] Ignoring event from Rapha origin, preventing loop');
      res.status(200).json({ status: 'ignored', reason: 'origin_rapha' });
      return;
    }

    console.log('[Odoo Webhook] Received event:', payload.event_type, 'Model:', payload.model);

    // Dispatch to appropriate handler based on event type and model
    if (payload.model === 'res.partner') {
      if (payload.event_type === 'updated' || payload.event_type === 'created') {
        await handlePartnerUpdated(payload);
      }
    } else if (payload.model === 'sale.order') {
      if (payload.event_type === 'updated' || payload.event_type === 'state_changed') {
        await handleSaleOrderUpdated(payload);
      }
    } else if (payload.model === 'sale.subscription') {
      if (payload.event_type === 'updated' || payload.event_type === 'state_changed') {
        await handleSubscriptionUpdated(payload);
      }
    } else {
      console.log('[Odoo Webhook] Unhandled model:', payload.model);
    }

    // Respond quickly to avoid Odoo timeout
    res.status(202).json({ status: 'accepted' });
  } catch (error: any) {
    console.error('[Odoo Webhook] Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
