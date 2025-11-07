import xmlrpc from 'xmlrpc';

interface OdooConfig {
  url: string;
  db: string;
  username: string;
  apiKey: string;
}

interface OdooPartner {
  name: string;
  email: string;
  phone?: string;
  street?: string;
  comment?: string;
  customer_rank?: number;
  supplier_rank?: number;
  [key: string]: any;
}

class OdooService {
  private config: OdooConfig | null = null;
  private uid: number | null = null;
  private commonClient: any = null;
  private objectClient: any = null;

  constructor() {
    const url = process.env.ODOO_URL;
    const db = process.env.ODOO_DB;
    const username = process.env.ODOO_USERNAME;
    const apiKey = process.env.ODOO_API_KEY;

    if (!url || !db || !username || !apiKey) {
      console.warn('[Odoo] Configuration incomplete - Odoo integration disabled');
      console.warn('[Odoo] Required: ODOO_URL, ODOO_DB, ODOO_USERNAME, ODOO_API_KEY');
      return;
    }

    this.config = { url, db, username, apiKey };
    this.initializeClients();
  }

  private initializeClients() {
    if (!this.config) return;

    try {
      const urlObj = new URL(this.config.url);
      
      this.commonClient = xmlrpc.createSecureClient({
        host: urlObj.hostname,
        port: parseInt(urlObj.port) || 443,
        path: '/xmlrpc/2/common',
      });

      this.objectClient = xmlrpc.createSecureClient({
        host: urlObj.hostname,
        port: parseInt(urlObj.port) || 443,
        path: '/xmlrpc/2/object',
      });

      console.log('[Odoo] Clients initialized successfully');
    } catch (error) {
      console.error('[Odoo] Failed to initialize clients:', error);
      this.config = null;
    }
  }

  async authenticate(): Promise<boolean> {
    if (!this.config || !this.commonClient) {
      return false;
    }

    try {
      const uid = await new Promise<number>((resolve, reject) => {
        this.commonClient.methodCall(
          'authenticate',
          [this.config!.db, this.config!.username, this.config!.apiKey, {}],
          (err: Error | null, value: number) => {
            if (err) reject(err);
            else resolve(value);
          }
        );
      });

      if (uid) {
        this.uid = uid;
        console.log('[Odoo] Authentication successful, UID:', uid);
        return true;
      }

      console.error('[Odoo] Authentication failed - invalid credentials');
      return false;
    } catch (error) {
      console.error('[Odoo] Authentication error:', error);
      return false;
    }
  }

  private async executeKw(model: string, method: string, args: any[], kwargs: any = {}): Promise<any> {
    if (!this.config || !this.objectClient || !this.uid) {
      throw new Error('Odoo not configured or not authenticated');
    }

    return new Promise((resolve, reject) => {
      this.objectClient.methodCall(
        'execute_kw',
        [this.config!.db, this.uid, this.config!.apiKey, model, method, args, kwargs],
        (err: Error | null, value: any) => {
          if (err) reject(err);
          else resolve(value);
        }
      );
    });
  }

  async searchPartner(email: string): Promise<number | null> {
    try {
      const partners = await this.executeKw(
        'res.partner',
        'search',
        [[['email', '=', email]]],
        { limit: 1 }
      );

      return partners.length > 0 ? partners[0] : null;
    } catch (error) {
      console.error('[Odoo] Error searching partner:', error);
      return null;
    }
  }

  async createPartner(partnerData: OdooPartner): Promise<number | null> {
    try {
      const partnerId = await this.executeKw(
        'res.partner',
        'create',
        [partnerData]
      );

      console.log('[Odoo] Created partner:', partnerId);
      return partnerId;
    } catch (error) {
      console.error('[Odoo] Error creating partner:', error);
      return null;
    }
  }

  async updatePartner(partnerId: number, partnerData: Partial<OdooPartner>): Promise<boolean> {
    try {
      await this.executeKw(
        'res.partner',
        'write',
        [[partnerId], partnerData]
      );

      console.log('[Odoo] Updated partner:', partnerId);
      return true;
    } catch (error) {
      console.error('[Odoo] Error updating partner:', error);
      return false;
    }
  }

  async syncCustomer(userData: {
    email: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    dateOfBirth?: string;
    subscriptionTier?: string;
  }): Promise<{ success: boolean; partnerId?: number; error?: string }> {
    try {
      if (!this.config) {
        return { success: false, error: 'Odoo not configured' };
      }

      if (!this.uid) {
        const authenticated = await this.authenticate();
        if (!authenticated) {
          return { success: false, error: 'Authentication failed' };
        }
      }

      const existingPartnerId = await this.searchPartner(userData.email);

      const partnerData: OdooPartner = {
        name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email,
        email: userData.email,
        customer_rank: 1,
      };

      if (userData.address) {
        partnerData.street = userData.address;
      }

      if (userData.subscriptionTier) {
        partnerData.comment = `Rapha Lumina - ${userData.subscriptionTier} Subscription`;
      }

      if (userData.dateOfBirth) {
        partnerData.comment = (partnerData.comment || '') + ` | DOB: ${userData.dateOfBirth}`;
      }

      if (existingPartnerId) {
        const updated = await this.updatePartner(existingPartnerId, partnerData);
        return {
          success: updated,
          partnerId: existingPartnerId,
          error: updated ? undefined : 'Update failed'
        };
      } else {
        const partnerId = await this.createPartner(partnerData);
        return {
          success: !!partnerId,
          partnerId: partnerId || undefined,
          error: partnerId ? undefined : 'Create failed'
        };
      }
    } catch (error: any) {
      console.error('[Odoo] Sync customer error:', error);
      return { success: false, error: error.message || 'Unknown error' };
    }
  }

  isConfigured(): boolean {
    return this.config !== null;
  }
}

export const odooService = new OdooService();
