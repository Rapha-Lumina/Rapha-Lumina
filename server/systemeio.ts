import type { User } from "../shared/schema.ts";

const SYSTEME_IO_API_KEY = process.env.SYSTEME_IO_API_KEY;
const SYSTEME_IO_BASE_URL = "https://api.systeme.io/api";

interface SystemeIoContact {
  email: string;
  firstName?: string;
  lastName?: string;
  fields?: {
    location?: string;
    age?: string;
  };
}

interface SystemeIoTag {
  name: string;
}

export class SystemeIoClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || SYSTEME_IO_API_KEY || "";
    this.baseUrl = SYSTEME_IO_BASE_URL;

    if (!this.apiKey) {
      console.warn("SYSTEME_IO_API_KEY not configured. Systeme.io integration disabled.");
    }
  }

  private async makeRequest(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    data?: any
  ) {
    if (!this.apiKey) {
      console.warn("Systeme.io API key not configured. Skipping API call.");
      return null;
    }

    try {
      const url = `${this.baseUrl}/${endpoint}`;
      const headers: Record<string, string> = {
        "x-api-key": this.apiKey,
        "Content-Type": "application/json",
      };

      const options: RequestInit = {
        method,
        headers,
      };

      if (data && (method === "POST" || method === "PUT")) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Systeme.io API error (${response.status}):`, errorText);
        throw new Error(`Systeme.io API error: ${response.status}`);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Error making Systeme.io API request:", error);
      throw error;
    }
  }

  async createOrUpdateContact(contact: SystemeIoContact) {
    try {
      // Use PUT to create or update contact
      const result = await this.makeRequest("contacts", "PUT", contact);
      console.log("Created/updated contact in Systeme.io:", contact.email);
      return result;
    } catch (error) {
      console.error("Failed to create/update contact in Systeme.io:", error);
      throw error;
    }
  }

  async createContact(contact: SystemeIoContact) {
    try {
      const result = await this.makeRequest("contacts", "POST", contact);
      console.log("Created contact in Systeme.io:", contact.email);
      return result;
    } catch (error) {
      console.error("Failed to create contact in Systeme.io:", error);
      throw error;
    }
  }

  async getContactByEmail(email: string) {
    try {
      const contacts = await this.makeRequest(`contacts?email=${encodeURIComponent(email)}`);
      if (contacts && contacts.length > 0) {
        return contacts[0];
      }
      return null;
    } catch (error) {
      console.error("Failed to get contact from Systeme.io:", error);
      return null;
    }
  }

  async createTag(tagName: string) {
    try {
      const result = await this.makeRequest("tags", "POST", { name: tagName });
      console.log("Created tag in Systeme.io:", tagName);
      return result;
    } catch (error) {
      console.error("Failed to create tag in Systeme.io:", error);
      throw error;
    }
  }

  async getTags() {
    try {
      return await this.makeRequest("tags");
    } catch (error) {
      console.error("Failed to get tags from Systeme.io:", error);
      return [];
    }
  }

  async getOrCreateTag(tagName: string) {
    try {
      const tags = await this.getTags();
      const existingTag = tags?.find((tag: any) => tag.name === tagName);
      
      if (existingTag) {
        return existingTag;
      }
      
      return await this.createTag(tagName);
    } catch (error) {
      console.error("Failed to get or create tag:", error);
      throw error;
    }
  }

  async addTagToContact(contactId: string, tagId: string) {
    try {
      const result = await this.makeRequest(`contacts/${contactId}/tags`, "POST", { tagId });
      console.log("Added tag to contact in Systeme.io");
      return result;
    } catch (error) {
      console.error("Failed to add tag to contact in Systeme.io:", error);
      throw error;
    }
  }

  async removeTagFromContact(contactId: string, tagId: string) {
    try {
      const result = await this.makeRequest(`contacts/${contactId}/tags/${tagId}`, "DELETE");
      console.log("Removed tag from contact in Systeme.io");
      return result;
    } catch (error) {
      console.error("Failed to remove tag from contact in Systeme.io:", error);
      throw error;
    }
  }

  async syncNewsletterSubscriber(email: string) {
    try {
      const contact = await this.createOrUpdateContact({ email });
      
      if (contact && contact.id) {
        const newsletterTag = await this.getOrCreateTag("Newsletter Subscriber");
        if (newsletterTag && newsletterTag.id) {
          await this.addTagToContact(contact.id, newsletterTag.id);
        }
      }
      
      return contact;
    } catch (error) {
      console.error("Failed to sync newsletter subscriber:", error);
    }
  }

  async syncUserRegistration(user: User) {
    try {
      if (!user.email) {
        console.warn("Cannot sync user without email to Systeme.io");
        return;
      }

      const contactData: SystemeIoContact = {
        email: user.email,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        fields: {
          location: user.location || undefined,
          age: user.age || undefined,
        },
      };

      const contact = await this.createOrUpdateContact(contactData);
      
      if (contact && contact.id) {
        const registeredTag = await this.getOrCreateTag("Registered User");
        if (registeredTag && registeredTag.id) {
          await this.addTagToContact(contact.id, registeredTag.id);
        }
      }
      
      return contact;
    } catch (error) {
      console.error("Failed to sync user registration:", error);
    }
  }

  async syncSubscriptionTier(email: string, tier: "free" | "premium" | "transformation") {
    try {
      const contact = await this.getContactByEmail(email);
      
      if (!contact || !contact.id) {
        console.warn("Contact not found in Systeme.io for tier sync:", email);
        return;
      }

      const tierTags = {
        free: "Free User",
        premium: "Premium User",
        transformation: "Transformation User",
      };

      const allTierTags = await Promise.all([
        this.getOrCreateTag("Free User"),
        this.getOrCreateTag("Premium User"),
        this.getOrCreateTag("Transformation User"),
      ]);

      for (const tag of allTierTags) {
        if (tag && tag.id && tag.name !== tierTags[tier]) {
          try {
            await this.removeTagFromContact(contact.id, tag.id);
          } catch (error) {
            console.log("Tag might not exist on contact, continuing...");
          }
        }
      }

      const newTierTag = await this.getOrCreateTag(tierTags[tier]);
      if (newTierTag && newTierTag.id) {
        await this.addTagToContact(contact.id, newTierTag.id);
      }

      console.log(`Synced ${tier} tier for ${email} to Systeme.io`);
    } catch (error) {
      console.error("Failed to sync subscription tier:", error);
    }
  }
}

export const systemeIoClient = new SystemeIoClient();
