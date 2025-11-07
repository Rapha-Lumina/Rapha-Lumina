// =========================================
// INSERT THIS CODE INTO YOUR server/routes.ts FILE
// Add it after line 1791 (after the music tracks route)
// =========================================

  // POST /api/contact - Submit contact form (PUBLIC - no authentication required)
  app.post("/api/contact", async (req: any, res) => {
    try {
      const { name, email, subject, message } = req.body;

      // Validate required fields
      if (!name || !email || !message) {
        return res.status(400).json({ 
          error: "Name, email, and message are required" 
        });
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          error: "Please provide a valid email address" 
        });
      }

      // Create lead in Odoo
      const leadId = await odooService.createLead({
        name: subject || `Contact from ${name}`,
        contact_name: name,
        email_from: email,
        description: message,
      });

      if (leadId) {
        console.log(`[Contact Form] Successfully created Odoo lead #${leadId} for ${email}`);
        res.json({ 
          success: true, 
          message: "Thank you for contacting us. We'll be in touch soon!",
          leadId: leadId 
        });
      } else {
        // Odoo failed but don't expose technical details to user
        console.error('[Contact Form] Failed to create Odoo lead, but returning success to user');
        res.json({ 
          success: true, 
          message: "Thank you for contacting us. We'll be in touch soon!"
        });
      }

    } catch (error) {
      console.error("[Contact Form] Error:", error);
      res.status(500).json({ 
        error: "Something went wrong. Please try again." 
      });
    }
  });

// =========================================
// After adding this, your routes.ts should look like:
// Line 1791: }) closing bracket for music route
// Line 1792: blank line
// Line 1793: // POST /api/contact... (your new route starts here)
// ...
// Line 1847: }) closing bracket for contact route
// Line 1848: blank line
// Line 1849: // GET /api/forum/posts... (existing forum route continues)
// =========================================
