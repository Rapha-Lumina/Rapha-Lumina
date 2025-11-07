// =========================================
// ADD THIS TO YOUR server/routes.ts FILE
// =========================================

// Make sure you have this import at the top of routes.ts:
// import { odooService } from "./odoo";

// Then add this route with your other POST routes:

app.post("/api/contact", async (req, res) => {
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
