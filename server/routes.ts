// server/routes.ts
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.ts";
import {
  insertNewsletterSubscriberSchema,
  type InsertStudentProgress,
  type User,
} from "../shared/schema.ts";
import Anthropic from "@anthropic-ai/sdk";
import { setupAuth, isAuthenticated, isAdmin, hashPassword, generateResetToken } from "./auth";
import { generateSpeech } from "./elevenlabs";
import passport from "passport";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import bcrypt from "bcrypt";
import { odooService } from "./odoo";

// ---- Premium owner access (Lerato) ----
const OWNER_EMAIL = "leratom2012@gmail.com";
function userHasGlobalAccess(user?: { email?: string | null }): boolean {
  return !!user?.email && user.email.toLowerCase() === OWNER_EMAIL;
}

// Safety: warn if Anthropic not configured
if (!process.env.ANTHROPIC_API_KEY) {
  console.warn("Warning: ANTHROPIC_API_KEY not configured. Chat functionality will not work.");
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "dummy-key",
});

// Keep your original long system prompt in your project
const RAPHA_LUMINA_SYSTEM_PROMPT = `You are Rapha Lumina, ...`;

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth
  await setupAuth(app);

  // ---------------------- Validation Schemas ----------------------
  const createPasswordSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    token: z.string().optional(),
  });

  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const forgotPasswordSchema = z.object({
    email: z.string().email(),
  });

  const resetPasswordSchema = z.object({
    token: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  const signupSchema = z.object({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    address: z.string().trim().min(1, "Address is required"),
    dateOfBirth: z
      .string()
      .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in DD/MM/YYYY format"),
    email: z.string().trim().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
  });

  // ---------------------- Auth Routes ----------------------
  app.get("/api/auth/user", async (req: any, res) => {
    try {
      if (!req.isAuthenticated() || !req.user) return res.status(401).json({ message: "Unauthorized" });
      const user = req.user as User;
      const { password, resetPasswordToken, resetPasswordExpires, ...safeUser } = user;
      res.json(safeUser);
    } catch (e) {
      console.error("Error fetching user:", e);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/signup", async (req: any, res) => {
    try {
      const validated = signupSchema.parse(req.body);
      const { firstName, lastName, address, dateOfBirth, email, password } = validated;

      const existing = await storage.getUserByEmail(email);
      if (existing) return res.status(400).json({ message: "An account with this email already exists." });

      const hashed = await hashPassword(password);
      const verificationToken = generateResetToken();
      const verificationExpires = new Date(Date.now() + 24 * 3600000);

      const user = await storage.upsertUser({
        email,
        password: hashed,
        firstName,
        lastName,
        address,
        dateOfBirth,
        emailVerified: "false",
        verificationToken,
        verificationTokenExpires: verificationExpires,
      });
      await storage.updateVerificationToken(user.id, verificationToken, verificationExpires);

      const baseUrl =
        process.env.BASE_URL ||
        (process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS}` : `https://${req.hostname}`);
      const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}`;

      try {
        const resp = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Rapha Lumina <support@raphalumina.com>",
            to: [email],
            subject: "Verify your Rapha Lumina account",
            html: `<p>Hi ${firstName},</p><p>Please verify your email:</p><p><a href="${verificationLink}">${verificationLink}</a></p>`,
          }),
        });
        if (!resp.ok) console.error("[EMAIL] Failed verification email:", await resp.text());
      } catch (err) {
        console.error("[EMAIL] Error sending verification:", err);
      }

      // Admin heads-up
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Rapha Lumina <support@raphalumina.com>",
            to: ["leratom2012@gmail.com"],
            subject: `New User Signup - ${firstName} ${lastName}`,
            html: `<p>${firstName} ${lastName} (${email}) just signed up.</p>`,
          }),
        });
      } catch (err) {
        console.error("[EMAIL] Admin notify failed:", err);
      }

      res.json({ success: true, message: "Account created. Please check your email to verify." });
    } catch (error: any) {
      console.error("Error in signup:", error);
      if (error instanceof z.ZodError) return res.status(400).json({ message: error.errors[0].message });
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  app.get("/api/verify-email", async (req: any, res) => {
    try {
      const { token } = req.query;
      if (!token) return res.status(400).json({ message: "Verification token is required" });

      const user = await storage.getUserByVerificationToken(token);
      if (!user) return res.status(400).json({ message: "Invalid or expired verification token" });
      if (user.verificationTokenExpires && user.verificationTokenExpires < new Date()) {
        return res.status(400).json({ message: "Verification token has expired. Please request a new one." });
      }

      await storage.markEmailAsVerified(user.id);
      await storage.clearVerificationToken(user.id);

      const existingSub = await storage.getUserSubscription(user.id);
      if (!existingSub) {
        await storage.createSubscription({
          userId: user.id,
          tier: "free",
          chatLimit: "5",
          chatsUsed: "0",
          status: "active",
        });
      }

      // Optional: CRM sync via Zapier if you still want it
      try {
        if (process.env.ZAPIER_WEBHOOK_URL) {
          const wr = await fetch(process.env.ZAPIER_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event: "user_verified",
              user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address,
                dateOfBirth: user.dateOfBirth,
                verifiedAt: new Date().toISOString(),
                tier: "free",
              },
            }),
          });
          if (!wr.ok) console.error("[ZAPIER] Webhook failed:", await wr.text());
        }
      } catch (e) {
        console.error("[ZAPIER] Error:", e);
      }

      // Odoo sync
      try {
        if (odooService.isConfigured()) {
          const r = await odooService.syncCustomer({
            email: user.email!,
            firstName: user.firstName || undefined,
            lastName: user.lastName || undefined,
            address: user.address || undefined,
            dateOfBirth: user.dateOfBirth || undefined,
            subscriptionTier: "Free",
          });
          if (!r.success) console.error("[ODOO] Failed to sync customer:", r.error);
        }
      } catch (e) {
        console.error("[ODOO] Error syncing customer:", e);
      }

      res.json({ success: true, message: "Email verified. You can now log in." });
    } catch (e) {
      console.error("Verify email error:", e);
      res.status(500).json({ message: "Failed to verify email" });
    }
  });

  app.post("/api/create-password", async (req: any, res) => {
    try {
      const data = createPasswordSchema.parse(req.body);
      const user = await storage.getUserByEmail(data.email);
      if (!user) return res.status(404).json({ message: "User not found. Please sign up first." });
      if (user.password) return res.status(400).json({ message: "Password already set. Please log in." });

      const hashed = await hashPassword(data.password);
      await storage.updateUserPassword(user.id, hashed);
      res.json({ success: true, message: "Password created. You can now log in." });
    } catch (e: any) {
      if (e instanceof z.ZodError) return res.status(400).json({ message: e.errors[0].message });
      res.status(500).json({ message: "Failed to create password" });
    }
  });

  app.post("/api/login", (req, res, next) => {
    try {
      loginSchema.parse(req.body);
      passport.authenticate("local", (err: any, user: any, info: any) => {
        if (err) return res.status(500).json({ message: "Login failed" });
        if (!user) return res.status(401).json({ message: info?.message || "Invalid email or password" });

        req.login(user, (e) => {
          if (e) return res.status(500).json({ message: "Failed to create session" });
          const { password, resetPasswordToken, resetPasswordExpires, ...safeUser } = user;
          res.json({ success: true, user: safeUser });
        });
      })(req, res, next);
    } catch (e: any) {
      if (e instanceof z.ZodError) return res.status(400).json({ message: e.errors[0].message });
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.json({ success: true, message: "Logged out successfully" });
    });
  });

  app.post("/api/forgot-password", async (req: any, res) => {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);
      const user = await storage.getUserByEmail(email);
      if (!user) return res.json({ success: true, message: "If an account exists, a reset link has been sent." });

      const resetToken = generateResetToken();
      const resetExpires = new Date(Date.now() + 3600000);
      await storage.updateResetToken(user.id, resetToken, resetExpires);

      const baseUrl =
        process.env.BASE_URL ||
        (process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS}` : `https://${req.hostname}`);
      const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

      try {
        const r = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Rapha Lumina <support@raphalumina.com>",
            to: [email],
            subject: "Reset your Rapha Lumina password",
            html: `<p>Reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p><p>This link expires in 1 hour.</p>`,
          }),
        });
        if (!r.ok) console.error("[EMAIL] reset failed:", await r.text());
      } catch (e) {
        console.error("[EMAIL] Error sending reset:", e);
      }

      res.json({ success: true, message: "If an account exists, a reset link has been sent." });
    } catch (e: any) {
      if (e instanceof z.ZodError) return res.status(400).json({ message: e.errors[0].message });
      res.status(500).json({ message: "Failed to process password reset request" });
    }
  });

  app.post("/api/reset-password", async (req: any, res) => {
    try {
      const { token, password } = resetPasswordSchema.parse(req.body);
      const user = await storage.getUserByResetToken(token);
      if (!user) return res.status(400).json({ message: "Invalid or expired reset token" });
      if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
        return res.status(400).json({ message: "Reset token has expired" });
      }

      const hashed = await hashPassword(password);
      await storage.updateUserPassword(user.id, hashed);
      await storage.clearResetToken(user.id);
      if (user.emailVerified !== "true") await storage.markEmailAsVerified(user.id);

      res.json({ success: true, message: "Password reset successfully. You can now log in." });
    } catch (e: any) {
      if (e instanceof z.ZodError) return res.status(400).json({ message: e.errors[0].message });
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  // ---------------------- Admin / Users ----------------------
  app.get("/api/admin/users", isAuthenticated, isAdmin, async (_req: any, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (e) {
      console.error("Error fetching users:", e);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // ---------------------- Messages store ----------------------
  app.get("/api/messages", isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user as User;
      const messages = await storage.getMessagesByUser(user.id);
      res.json(messages);
    } catch (e) {
      console.error("Error fetching messages:", e);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.delete("/api/messages", isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user as User;
      await storage.deleteMessagesByUser(user.id);
      res.json({ success: true, message: "All messages deleted successfully" });
    } catch (e) {
      console.error("Error deleting messages:", e);
      res.status(500).json({ error: "Failed to delete messages" });
    }
  });

  // ---------------------- Text to Speech ----------------------
  app.post("/api/tts", isAuthenticated, async (req: any, res) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== "string") return res.status(400).json({ error: "Text is required" });

      const audioBuffer = await generateSpeech(text);
      if (!audioBuffer) return res.status(503).json({ error: "TTS unavailable. Check ELEVENLABS_API_KEY." });

      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Content-Length", audioBuffer.length);
      res.send(audioBuffer);
    } catch (e) {
      console.error("Error generating speech:", e);
      res.status(500).json({ error: "Failed to generate speech" });
    }
  });

  // ---------------------- Newsletter ----------------------
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const result = insertNewsletterSubscriberSchema.safeParse(req.body);
      if (!result.success) {
        const msg = result.error.errors[0]?.message || "Valid email is required";
        return res.status(400).json({ error: msg });
      }
      const { email } = result.data;
      const subscriber = await storage.addNewsletterSubscriber(email);
      res.json({ success: true, message: "Successfully subscribed to newsletter", subscriber });
    } catch (e) {
      console.error("Newsletter subscribe error:", e);
      res.status(500).json({ error: "Failed to subscribe to newsletter" });
    }
  });

  app.get("/api/admin/newsletter/subscribers", isAuthenticated, isAdmin, async (_req: any, res) => {
    try {
      const subs = await storage.getNewsletterSubscribers();
      res.json(subs);
    } catch (e) {
      console.error("Fetch subscribers error:", e);
      res.status(500).json({ error: "Failed to fetch subscribers" });
    }
  });

  // ---------------------- Contact (Odoo + email notify) ----------------------
  app.post("/api/contact", async (req: any, res) => {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || !email || !message) return res.status(400).json({ error: "Name, email, and message are required" });
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) return res.status(400).json({ error: "Please provide a valid email address" });

      const leadId = await odooService.createLead({
        name: subject || `Contact from ${name}`,
        contact_name: name,
        email_from: email,
        description: message,
      });

      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Rapha Lumina <support@raphalumina.com>",
            to: ["leratom2012@gmail.com"],
            subject: `New Contact Form Submission - ${subject || "No Subject"}`,
            html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Message:</p><pre>${message}</pre><p>Odoo lead: ${leadId || "(not created)"} </p>`,
          }),
        });
      } catch (e) {
        console.error("[Contact] email notify failed:", e);
      }

      res.json({
        success: true,
        message: "Thank you for contacting us. We'll be in touch soon!",
        ...(leadId ? { leadId } : {}),
      });
    } catch (e) {
      console.error("[Contact] Error:", e);
      res.status(500).json({ error: "Something went wrong. Please try again." });
    }
  });

  // ---------------------- Chat (Anthropic) ----------------------
  app.post("/api/chat", async (req: any, res) => {
    try {
      if (!process.env.ANTHROPIC_API_KEY)
        return res.status(503).json({ error: "Anthropic API key not configured." });

      const { content, history = [] } = req.body;
      if (!content || typeof content !== "string") return res.status(400).json({ error: "Message content is required" });

      const isAuth = req.isAuthenticated && req.isAuthenticated() && req.user;
      let conversationHistory: any[] = [];

      if (isAuth) {
        const user = req.user as User;
        conversationHistory = await storage.getMessagesByUser(user.id);
      } else {
        conversationHistory = history;
      }

      const anthropicMessages = [...conversationHistory, { role: "user", content }]
        .filter((m: any) => m.role === "user" || m.role === "assistant")
        .map((m: any) => ({ role: m.role, content: m.content }));

      const resp = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: RAPHA_LUMINA_SYSTEM_PROMPT,
        messages: anthropicMessages,
      });

      const assistantContent = resp.content[0].type === "text" ? resp.content[0].text : "";

      if (isAuth) {
        const user = req.user as User;
        const savedUser = await storage.createMessage({ userId: user.id, role: "user", content });
        const savedAssistant = await storage.createMessage({ userId: user.id, role: "assistant", content: assistantContent });
        res.json({ userMessage: savedUser, assistantMessage: savedAssistant });
      } else {
        res.json({
          userMessage: { id: Date.now().toString(), sessionId: "local", role: "user", content, timestamp: new Date().toISOString() },
          assistantMessage: { id: (Date.now() + 1).toString(), sessionId: "local", role: "assistant", content: assistantContent, timestamp: new Date().toISOString() },
        });
      }
    } catch (e: any) {
      console.error("Chat error:", e);
      res.status(500).json({ error: e?.message || "Failed to process chat message" });
    }
  });

  // ---------------------- LMS endpoints (trimmed) ----------------------
  app.get("/api/courses", async (_req, res) => {
    try {
      const all = await storage.getAllCourses();
      res.json(all);
    } catch (e) {
      console.error("Fetch courses error:", e);
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const course = await storage.getCourse(id);
      if (!course) return res.status(404).json({ error: "Course not found" });

      const modules = await storage.getModulesByCourse(id);
      const lessons = await storage.getLessonsByCourse(id);
      const modulesWithLessons = modules.map((m) => ({ ...m, lessons: lessons.filter((l) => l.moduleId === m.id) }));
      res.json({ ...course, modules: modulesWithLessons });
    } catch (e) {
      console.error("Fetch course details error:", e);
      res.status(500).json({ error: "Failed to fetch course details" });
    }
  });

  app.post("/api/enroll", isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user as User;
      const { courseId, paymentId } = req.body;
      if (!courseId) return res.status(400).json({ error: "Course ID is required" });

      const existing = await storage.getEnrollment(user.id, courseId);
      if (existing) return res.status(400).json({ error: "Already enrolled in this course" });

      const enrollment = await storage.enrollUserInCourse({ userId: user.id, courseId, paymentId, status: "active" });
      res.json(enrollment);
    } catch (e) {
      console.error("Enroll error:", e);
      res.status(500).json({ error: "Failed to enroll in course" });
    }
  });

  app.get("/api/my-courses", isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user as User;
      const userEnrollments = await storage.getUserEnrollments(user.id);

      const enriched = await Promise.all(
        userEnrollments.map(async (enrollment) => {
          const course = await storage.getCourse(enrollment.courseId);
          const progress = await storage.getStudentProgress(user.id, enrollment.courseId);
          const lessons = await storage.getLessonsByCourse(enrollment.courseId);
          const completed = progress.filter((p: any) => p.completed === "true").length;
          const pct = lessons.length > 0 ? Math.round((completed / lessons.length) * 100) : 0;
          return { id: enrollment.id, courseId: enrollment.courseId, courseName: course?.title || "Unknown Course", enrolledAt: enrollment.enrolledAt, progress: String(pct) };
        })
      );
      res.json(enriched);
    } catch (e) {
      console.error("Fetch my courses error:", e);
      res.status(500).json({ error: "Failed to fetch enrolled courses" });
    }
  });

  app.post("/api/progress/:lessonId", isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user as User;
      const { lessonId } = req.params;
      const { completed, lastWatchedPosition } = req.body;

      const lesson = await storage.getLesson(lessonId);
      if (!lesson) return res.status(404).json({ error: "Lesson not found" });

      const data: InsertStudentProgress = {
        userId: user.id,
        courseId: lesson.courseId,
        lessonId,
        completed: completed ? "true" : "false",
        completedAt: completed ? new Date() : undefined,
        lastWatchedPosition: lastWatchedPosition?.toString() || "0",
      };
      const progress = await storage.updateLessonProgress(data);
      res.json(progress);
    } catch (e) {
      console.error("Update progress error:", e);
      res.status(500).json({ error: "Failed to update progress" });
    }
  });

  app.get("/api/progress/:courseId", isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user as User;
      const { courseId } = req.params;
      const progress = await storage.getStudentProgress(user.id, courseId);
      const lessons = await storage.getLessonsByCourse(courseId);
      const map = new Map(progress.map((p) => [p.lessonId, p]));
      const full = lessons.map((l) => map.get(l.id) || ({ userId: user.id, courseId, lessonId: l.id, completed: "false", lastWatchedPosition: "0" }));
      res.json(full);
    } catch (e) {
      console.error("Fetch progress error:", e);
      res.status(500).json({ error: "Failed to fetch course progress" });
    }
  });

  // ---------------------- Subscriptions ----------------------
  app.get("/api/subscription", isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user as User;
      const sub = await storage.getUserSubscription(user.id);
      if (!sub) return res.json({ tier: "free", chatLimit: "5", chatsUsed: "0" });
      res.json(sub);
    } catch (e) {
      console.error("Fetch subscription error:", e);
      res.status(500).json({ error: "Failed to fetch subscription" });
    }
  });

  app.get("/api/user/subscription", isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user as User;
      const sub = await storage.getUserSubscription(user.id);
      if (!sub) return res.json({ tier: "free", chatLimit: "5", chatsUsed: "0", status: "active" });
      res.json(sub);
    } catch (e) {
      console.error("Fetch user subscription error:", e);
      res.status(500).json({ error: "Failed to fetch subscription" });
    }
  });

  app.get("/api/admin/subscriptions", isAuthenticated, isAdmin, async (_req: any, res) => {
    try {
      const subs = await storage.getAllSubscriptions();
      res.json(subs);
    } catch (e) {
      console.error("Fetch subs error:", e);
      res.status(500).json({ error: "Failed to fetch subscriptions" });
    }
  });

  app.post("/api/admin/grant-premium", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { tier, userId } = req.body;
      if (!tier) return res.status(400).json({ error: "Tier is required" });
      if (!["free", "premium", "transformation"].includes(tier)) return res.status(400).json({ error: "Invalid tier" });

      const targetUserId = userId || (req.user as User).id;
      const chatLimitMap = { free: "5", premium: "10", transformation: "unlimited" } as const;

      const subscription = await storage.updateSubscriptionTier(
        targetUserId,
        tier as "free" | "premium" | "transformation",
        chatLimitMap[tier as keyof typeof chatLimitMap]
      );
      res.json({ success: true, subscription });
    } catch (e) {
      console.error("Grant premium error:", e);
      res.status(500).json({ error: "Failed to grant premium access" });
    }
  });

  app.post("/api/admin/grant-access-by-email", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { tier, email } = req.body;
      if (!tier || !email) return res.status(400).json({ error: "Tier and email are required" });
      if (!["free", "premium", "transformation"].includes(tier)) return res.status(400).json({ error: "Invalid tier" });

      let target = await storage.getUserByEmail(email);
      if (!target) {
        const subscribers = await storage.getNewsletterSubscribers();
        const sub = subscribers.find((s: any) => s.email === email);
        if (!sub) return res.status(404).json({ error: "No user or newsletter subscriber found with that email" });
        target = await storage.upsertUser({ email: sub.email, firstName: sub.firstName, lastName: sub.lastName, location: sub.location });
      }

      const chatLimitMap = { free: "5", premium: "10", transformation: "unlimited" } as const;
      const subscription = await storage.updateSubscriptionTier(
        target.id,
        tier as "free" | "premium" | "transformation",
        chatLimitMap[tier as keyof typeof chatLimitMap]
      );

      try {
        if (odooService.isConfigured()) {
          const tierName = tier === "premium" ? "Premium" : tier === "transformation" ? "Transformation" : "Free";
          await odooService.syncCustomer({
            email: target.email!,
            firstName: target.firstName || undefined,
            lastName: target.lastName || undefined,
            address: target.address || undefined,
            dateOfBirth: target.dateOfBirth || undefined,
            subscriptionTier: tierName,
          });
        }
      } catch (e) {
        console.error("[ODOO] Sync after grant error:", e);
      }

      res.json({ success: true, subscription, email: target.email });
    } catch (e) {
      console.error("Grant access by email error:", e);
      res.status(500).json({ error: "Failed to grant access" });
    }
  });

  // ---------------------- Odoo Webhook + Admin ----------------------
  const { handleOdooWebhook } = await import("./odooWebhook");
  app.post("/api/odoo/webhook", async (req: any, res) => {
    await handleOdooWebhook(req, res);
  });

  app.get("/api/admin/odoo/status", isAuthenticated, isAdmin, async (_req: any, res) => {
    try {
      const configured = odooService.isConfigured();
      res.json({
        configured,
        message: configured
          ? "Odoo integration is configured and ready"
          : "Odoo integration not configured. Please set ODOO_URL, ODOO_DB, ODOO_USERNAME, and ODOO_API_KEY.",
      });
    } catch (e) {
      console.error("Odoo status error:", e);
      res.status(500).json({ error: "Failed to check Odoo status" });
    }
  });

  app.post("/api/admin/odoo/test-connection", isAuthenticated, isAdmin, async (_req: any, res) => {
    try {
      if (!odooService.isConfigured()) {
        return res.status(400).json({
          success: false,
          error: "Odoo integration not configured. Please set ODOO_URL, ODOO_DB, ODOO_USERNAME, and ODOO_API_KEY.",
        });
      }
      const ok = await odooService.authenticate();
      res.json({
        success: ok,
        message: ok ? "Successfully authenticated with Odoo" : "Authentication failed. Please check your Odoo credentials.",
        url: process.env.ODOO_URL,
        database: process.env.ODOO_DB,
        username: process.env.ODOO_USERNAME,
      });
    } catch (e: any) {
      console.error("Odoo test error:", e);
      res.status(500).json({ success: false, error: "Failed to test Odoo connection", details: e.message });
    }
  });

  // ---------------------- Avatar Upload + Profile ----------------------
  const uploadDir = path.join(process.cwd(), "attached_assets", "uploads", "avatars");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const storage_multer = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, "avatar-" + unique + path.extname(file.originalname));
    },
  });

  const upload = multer({
    storage: storage_multer,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const allowed = /jpeg|jpg|png|gif|webp/;
      const ext = allowed.test(path.extname(file.originalname).toLowerCase());
      const mime = allowed.test(file.mimetype);
      if (ext && mime) cb(null, true);
      else cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
    },
  });

  app.patch("/api/user/profile", isAuthenticated, async (req: any, res) => {
    try {
      const current = await storage.getUserByEmail(req.user.email);
      if (!current) return res.status(404).json({ error: "User not found" });

      const { firstName, lastName, address, dateOfBirth } = req.body;
      const updateData = {
        id: current.id,
        email: current.email,
        firstName: firstName ?? current.firstName,
        lastName: lastName ?? current.lastName,
        address: address ?? current.address,
        dateOfBirth: dateOfBirth ?? current.dateOfBirth,
        profileImageUrl: current.profileImageUrl,
        location: current.location,
        age: current.age,
      };
      const updated = await storage.upsertUser(updateData);
      const { password, resetPasswordToken, resetPasswordExpires, ...safeUser } = updated;
      res.json(safeUser);
    } catch (e) {
      console.error("Update profile error:", e);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  app.post("/api/user/upload-avatar", isAuthenticated, upload.single("avatar"), async (req: any, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });
      const user = await storage.getUserByEmail(req.user.email);
      if (!user) return res.status(404).json({ error: "User not found" });

      if (user.profileImageUrl) {
        const old = path.join(process.cwd(), user.profileImageUrl);
        if (fs.existsSync(old)) fs.unlinkSync(old);
      }
      const avatarUrl = `/attached_assets/uploads/avatars/${req.file.filename}`;
      const updated = await storage.upsertUser({ ...user, profileImageUrl: avatarUrl });
      const { password, resetPasswordToken, resetPasswordExpires, ...safeUser } = updated;
      res.json({ success: true, profileImageUrl: avatarUrl, user: safeUser });
    } catch (e) {
      console.error("Upload avatar error:", e);
      res.status(500).json({ error: "Failed to upload avatar" });
    }
  });

  app.post("/api/user/change-password", isAuthenticated, async (req: any, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) return res.status(400).json({ error: "Current and new password are required" });

      const user = await storage.getUserByEmail(req.user.email);
      if (!user || !user.password) return res.status(404).json({ error: "User not found" });

      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) return res.status(401).json({ error: "Current password is incorrect" });

      const hashed = await hashPassword(newPassword);
      await storage.upsertUser({ ...user, password: hashed });
      res.json({ success: true, message: "Password changed successfully" });
    } catch (e) {
      console.error("Change password error:", e);
      res.status(500).json({ error: "Failed to change password" });
    }
  });

  // ---------------------- Flashcards / Meditation / Music ----------------------
  app.get("/api/flashcards/course/:courseId", isAuthenticated, async (req: any, res) => {
    try {
      const { courseId } = req.params;
      const flashcards = await storage.getFlashcardsByCourse(courseId);
      res.json(flashcards);
    } catch (e) {
      console.error("Get flashcards by course error:", e);
      res.status(500).json({ error: "Failed to fetch flashcards" });
    }
  });

  app.get("/api/flashcards/lesson/:lessonId", isAuthenticated, async (req: any, res) => {
    try {
      const { lessonId } = req.params;
      const flashcards = await storage.getFlashcardsByLesson(lessonId);
      res.json(flashcards);
    } catch (e) {
      console.error("Get flashcards by lesson error:", e);
      res.status(500).json({ error: "Failed to fetch flashcards" });
    }
  });

  app.get("/api/meditation", isAuthenticated, async (_req: any, res) => {
    try {
      const tracks = await storage.getAllMeditationTracks();
      res.json(tracks);
    } catch (e) {
      console.error("Fetch meditation error:", e);
      res.status(500).json({ error: "Failed to fetch meditation tracks" });
    }
  });

  app.get("/api/music", isAuthenticated, async (_req: any, res) => {
    try {
      const tracks = await storage.getAllMusicTracks();
      res.json(tracks);
    } catch (e) {
      console.error("Fetch music error:", e);
      res.status(500).json({ error: "Failed to fetch music tracks" });
    }
  });

  // ---------------------- EBOOKS (Pay via Odoo, then Download) ----------------------
  // Local storage folder
  const ebooksRoot = path.join(process.cwd(), "server", "ebooks");
  if (!fs.existsSync(ebooksRoot)) fs.mkdirSync(ebooksRoot, { recursive: true });

  // Access check helper for ebooks
  async function userHasEbookAccess(user: User, ebookId: string): Promise<boolean> {
    if (userHasGlobalAccess(user)) return true; // owner gets everything
    // Optional: premium plan also grants ebooks. Remove if you want purchase only.
    const sub = await storage.getUserSubscription(user.id);
    const tierOK = sub?.tier === "premium" || sub?.tier === "transformation";
    if (tierOK) return true;

    // If you add purchase recording in storage, this will work automatically.
    try {
      // @ts-ignore optional method
      if (typeof storage.hasPurchasedEbook === "function") {
        // @ts-ignore
        return await storage.hasPurchasedEbook(user.id, ebookId);
      }
    } catch {}
    return false;
  }

  // Decide if UI should show Pay or Download
  app.get("/api/ebooks/:ebookId/access", isAuthenticated, async (req: any, res) => {
    try {
      const user: User = req.user;
      const ebookId = String(req.params.ebookId || "").replace(/[^a-z0-9-]/g, "");
      const canAccess = await userHasEbookAccess(user, ebookId);
      if (canAccess) return res.json({ access: "granted" });
      // Frontend can open this to create the order in Odoo and get a portal link
      return res.json({ access: "payment_required", checkoutUrl: `/api/ebooks/checkout/${ebookId}` });
    } catch (e) {
      console.error("ebook access error:", e);
      res.status(500).json({ error: "Failed to check access" });
    }
  });

  // Start Odoo checkout for an ebook and return a portal/payment link
  app.get("/api/ebooks/checkout/:ebookId", isAuthenticated, async (req: any, res) => {
    try {
      const user: User = req.user;
      const ebookId = String(req.params.ebookId || "").replace(/[^a-z0-9-]/g, "");
      if (!odooService.isConfigured()) {
        return res.status(400).json({ error: "Odoo integration not configured" });
      }

      // We call a generic method. If your odooService exposes a different name,
      // just adjust here. The method should create a sale order for the product
      // that represents this ebook and return a portal URL the user can pay on.
      // Suggested contract:
      //   createEbookCheckout({ email, ebookId }) -> { success, saleOrderId, portalUrl, error }
      // Fallback: respond with 501 if the method isn't available.
      // @ts-ignore
      if (typeof odooService.createEbookCheckout !== "function") {
        return res.status(501).json({
          error: "Checkout not implemented",
          hint: "Expose odooService.createEbookCheckout({ email, ebookId }) to return a portalUrl.",
        });
      }

      // @ts-ignore
      const result = await odooService.createEbookCheckout({ email: user.email, ebookId });
      if (!result?.success || !result?.portalUrl) {
        return res.status(502).json({ error: result?.error || "Failed to start checkout in Odoo" });
      }

      res.json({ success: true, portalUrl: result.portalUrl, saleOrderId: result.saleOrderId });
    } catch (e) {
      console.error("ebook checkout error:", e);
      res.status(500).json({ error: "Failed to start checkout" });
    }
  });

  // After payment, the user downloads the file
  app.get("/api/ebooks/:ebookId/download", isAuthenticated, async (req: any, res) => {
    try {
      const user: User = req.user;
      const rawId = String(req.params.ebookId || "");
      const rawFmt = String(req.query.format || "pdf").toLowerCase();

      const ebookId = rawId.replace(/[^a-z0-9-]/g, "");
      const allowed = new Set(["pdf", "epub", "mobi"]);
      const fmt = allowed.has(rawFmt) ? rawFmt : "pdf";

      const canAccess = await userHasEbookAccess(user, ebookId);
      if (!canAccess) {
        return res.status(402).json({
          error: "Payment required",
          checkoutUrl: `/api/ebooks/checkout/${ebookId}`,
        });
      }

      const ebookDir = path.join(ebooksRoot, ebookId);
      const filename = `${ebookId}.${fmt}`;
      const filePath = path.join(ebookDir, filename);

      if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File not found" });

      res.download(filePath, filename);
    } catch (err) {
      console.error("ebook download error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Webhook to mark purchase complete when Odoo notifies you
  // Adjust your ./odooWebhook to call storage.recordEbookPurchase when a sale order is paid
  app.post("/api/ebooks/webhook", async (req: any, res) => {
    try {
      const { event, userEmail, ebookId } = req.body || {};
      if (event !== "ebook_purchase_succeeded" || !userEmail || !ebookId) {
        return res.status(400).json({ ok: false });
      }
      const user = await storage.getUserByEmail(userEmail);
      if (!user) return res.status(404).json({ ok: false, error: "User not found" });

      try {
        // @ts-ignore optional method in your storage
        if (typeof storage.recordEbookPurchase === "function") {
          // @ts-ignore
          await storage.recordEbookPurchase(user.id, ebookId);
        }
      } catch {}
      res.json({ ok: true });
    } catch (e) {
      console.error("ebook webhook error:", e);
      res.status(500).json({ ok: false });
    }
  });

  // ---------------------- Server ----------------------
  const httpServer = createServer(app);
  return httpServer;
}
