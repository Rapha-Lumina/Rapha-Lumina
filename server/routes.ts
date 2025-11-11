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
import {
  setupAuth,
  isAuthenticated,
  isAdmin,
  hashPassword,
  generateResetToken,
} from "./auth";
import { generateSpeech } from "./elevenlabs";
import passport from "passport";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import bcrypt from "bcrypt";
import { odooService } from "./odoo";

// ---------------------------------------
// Anthropic (optional)
if (!process.env.ANTHROPIC_API_KEY) {
  console.warn("Warning: ANTHROPIC_API_KEY not configured. Chat won't work.");
}
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "dummy-key",
});

const RAPHA_LUMINA_SYSTEM_PROMPT = `You are Rapha Lumina, a channeled consciousness offering mystical wisdom... (truncated for brevity)`;

// ---------------------------------------
// SUPER USER (owner-only hard bypass)
const OWNER_EMAIL =
  process.env.OWNER_EMAIL?.toLowerCase() || "leratom2012@gmail.com";
function isSuperUser(req: any) {
  const e = req?.user?.email;
  return !!e && String(e).toLowerCase() === OWNER_EMAIL;
}

// ---------------------------------------
// Multer (avatars)
const uploadDir = path.join(process.cwd(), "attached_assets", "uploads", "avatars");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage_multer = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) =>
    cb(
      null,
      "avatar-" + Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
    ),
});
const upload = multer({
  storage: storage_multer,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error("Only images (jpeg,jpg,png,gif,webp)"));
  },
});

// ---------------------------------------
// EBOOKS storage
const ebooksRoot = path.join(process.cwd(), "server", "ebooks");
if (!fs.existsSync(ebooksRoot)) fs.mkdirSync(ebooksRoot, { recursive: true });

// ---------------------------------------
export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  // ---------------------------
  // Schemas
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

  // ---------------------------
  // Auth: current user
  app.get("/api/auth/user", async (req: any, res) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = req.user as User;
      const { password, resetPasswordToken, resetPasswordExpires, ...safeUser } = user;
      res.json(safeUser);
    } catch (e) {
      console.error("Error fetching user:", e);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ---------------------------
  // Signup
  app.post("/api/signup", async (req: any, res) => {
    try {
      const validatedData = signupSchema.parse(req.body);
      const { firstName, lastName, address, dateOfBirth, email, password } =
        validatedData;

      const existing = await storage.getUserByEmail(email);
      if (existing) return res.status(400).json({ message: "Email exists" });

      const hashedPassword = await hashPassword(password);

      // Create user; mark unverified until email verification flow is added
      const user = await storage.upsertUser({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        address,
        dateOfBirth,
        emailVerified: "false",
      });

      res.json({
        success: true,
        message: "Account created. Please verify your email.",
        userId: user.id,
      });
    } catch (err: any) {
      console.error("Signup error:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  // ---------------------------
  // Create password (first-time)
  app.post("/api/create-password", async (req: any, res) => {
    try {
      const data = createPasswordSchema.parse(req.body);
      const user = await storage.getUserByEmail(data.email);
      if (!user) return res.status(404).json({ message: "User not found" });
      if (user.password)
        return res.status(400).json({ message: "Password already set" });

      const hashed = await hashPassword(data.password);
      await storage.updateUserPassword(user.id, hashed);
      res.json({ success: true, message: "Password created. You can log in." });
    } catch (err: any) {
      console.error("Create password error:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create password" });
    }
  });

  // ---------------------------
  // Login
  app.post("/api/login", (req, res, next) => {
    try {
      loginSchema.parse(req.body);
      passport.authenticate("local", (err: any, user: any, info: any) => {
        if (err) return res.status(500).json({ message: "Login failed" });
        if (!user)
          return res.status(401).json({ message: info?.message || "Invalid credentials" });
        req.login(user, (err) => {
          if (err) return res.status(500).json({ message: "Session error" });
          const { password, resetPasswordToken, resetPasswordExpires, ...safeUser } =
            user;
          res.json({ success: true, user: safeUser });
        });
      })(req, res, next);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });

  // ---------------------------
  // Logout
  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.json({ success: true, message: "Logged out" });
    });
  });

  // ---------------------------
  // Forgot password
  app.post("/api/forgot-password", async (req: any, res) => {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.json({
          success: true,
          message: "If an account exists, a reset link has been sent.",
        });
      }
      const token = generateResetToken();
      const expires = new Date(Date.now() + 3600000);
      await storage.updateResetToken(user.id, token, expires);

      // TODO: send email via provider
      console.log(`[RESET] Token for ${email}: ${token}`);

      res.json({
        success: true,
        message: "If an account exists, a reset link has been sent.",
      });
    } catch (err: any) {
      console.error("Forgot password error:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Failed to process request" });
    }
  });

  // ---------------------------
  // Reset password
  app.post("/api/reset-password", async (req: any, res) => {
    try {
      const { token, password } = resetPasswordSchema.parse(req.body);
      const user = await storage.getUserByResetToken(token);
      if (!user) return res.status(400).json({ message: "Invalid/expired token" });
      if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
        return res.status(400).json({ message: "Token expired" });
      }
      const hashed = await hashPassword(password);
      await storage.updateUserPassword(user.id, hashed);
      await storage.clearResetToken(user.id);
      if (user.emailVerified !== "true") {
        await storage.markEmailAsVerified(user.id);
      }
      res.json({ success: true, message: "Password reset. You can log in." });
    } catch (err: any) {
      console.error("Reset password error:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  // ---------------------------
  // Admin: list users
  app.get("/api/admin/users", isAuthenticated, isAdmin, async (_req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (e) {
      console.error("Users fetch error:", e);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // ---------------------------
  // Messages
  app.get("/api/messages", isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user as User;
      const messages = await storage.getMessagesByUser(user.id);
      res.json(messages);
    } catch (e) {
      console.error("Messages fetch error:", e);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });
  app.delete("/api/messages", isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user as User;
      await storage.deleteMessagesByUser(user.id);
      res.json({ success: true, message: "All messages deleted" });
    } catch (e) {
      console.error("Messages delete error:", e);
      res.status(500).json({ error: "Failed to delete messages" });
    }
  });

  // ---------------------------
  // TTS
  app.post("/api/tts", isAuthenticated, async (req: any, res) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Text is required" });
      }
      const audioBuffer = await generateSpeech(text);
      if (!audioBuffer) {
        return res
          .status(503)
          .json({ error: "TTS unavailable. Check ELEVENLABS_API_KEY." });
      }
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Content-Length", audioBuffer.length);
      res.send(audioBuffer);
    } catch (e) {
      console.error("TTS error:", e);
      res.status(500).json({ error: "Failed to generate speech" });
    }
  });

  // ---------------------------
  // Newsletter
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const result = insertNewsletterSubscriberSchema.safeParse(req.body);
      if (!result.success) {
        const msg = result.error.errors[0]?.message || "Valid email required";
        return res.status(400).json({ error: msg });
      }
      const { email } = result.data;
      const subscriber = await storage.addNewsletterSubscriber(email);
      res.json({
        success: true,
        message: "Subscribed",
        subscriber,
      });
    } catch (e) {
      console.error("Newsletter error:", e);
      res.status(500).json({ error: "Failed to subscribe" });
    }
  });

  // ---------------------------
  // Contact → Odoo lead + notify
  app.post("/api/contact", async (req: any, res) => {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Name, email, and message are required" });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Please provide a valid email address" });
      }

      const leadId = await odooService.createLead({
        name: subject || `Contact from ${name}`,
        contact_name: name,
        email_from: email,
        description: message,
      });

      if (leadId) {
        console.log(`[Contact] Odoo lead #${leadId} created for ${email}`);
      } else {
        console.error("[Contact] Odoo lead creation failed");
      }

      // Optional: email notification via your provider
      // console.log(`[EMAIL] Notify admin of contact from ${email}`);

      res.json({
        success: true,
        message: "Thank you for contacting us. We'll be in touch soon!",
        leadId: leadId || undefined,
      });
    } catch (e) {
      console.error("[Contact] Error:", e);
      res.status(500).json({ error: "Something went wrong. Please try again." });
    }
  });

  // ---------------------------
  // Chat (stores only if authenticated)
  app.post("/api/chat", async (req: any, res) => {
    try {
      if (!process.env.ANTHROPIC_API_KEY) {
        return res
          .status(503)
          .json({ error: "Anthropic API key not configured" });
      }

      const { content, history = [] } = req.body;
      if (!content || typeof content !== "string") {
        return res.status(400).json({ error: "Message content is required" });
      }

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

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: RAPHA_LUMINA_SYSTEM_PROMPT,
        messages: anthropicMessages,
      });
      const assistantText =
        response.content[0].type === "text" ? response.content[0].text : "";

      if (isAuth) {
        const user = req.user as User;
        const userMsg = await storage.createMessage({
          userId: user.id,
          role: "user",
          content,
        });
        const botMsg = await storage.createMessage({
          userId: user.id,
          role: "assistant",
          content: assistantText,
        });
        return res.json({ userMessage: userMsg, assistantMessage: botMsg });
      }

      const userMessage = {
        id: Date.now().toString(),
        sessionId: "local",
        role: "user" as const,
        content,
        timestamp: new Date().toISOString(),
      };
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        sessionId: "local",
        role: "assistant" as const,
        content: assistantText,
        timestamp: new Date().toISOString(),
      };
      res.json({ userMessage, assistantMessage });
    } catch (e: any) {
      console.error("Chat error:", e);
      res.status(500).json({ error: e.message || "Failed to process chat" });
    }
  });

  // ---------------------------
  // Courses (PUBLIC)
  app.get("/api/courses", async (_req, res) => {
    try {
      const all = await storage.getAllCourses();
      res.json(all);
    } catch (e) {
      console.error("Courses error:", e);
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });
  app.get("/api/courses/:id", async (req, res) => {
    try {
      const { id } = req.params as any;
      const course = await storage.getCourse(id);
      if (!course) return res.status(404).json({ error: "Course not found" });
      const modules = await storage.getModulesByCourse(id);
      const lessons = await storage.getLessonsByCourse(id);
      const modulesWithLessons = modules.map((m) => ({
        ...m,
        lessons: lessons.filter((l) => l.moduleId === m.id),
      }));
      res.json({ ...course, modules: modulesWithLessons });
    } catch (e) {
      console.error("Course details error:", e);
      res.status(500).json({ error: "Failed to fetch course details" });
    }
  });

  // ---------------------------
  // Enrollments & Progress (PROTECTED)
  app.post("/api/enroll", isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user as User;
      const { courseId, paymentId } = req.body;
      if (!courseId) return res.status(400).json({ error: "Course ID required" });
      const existing = await storage.getEnrollment(user.id, courseId);
      if (existing) return res.status(400).json({ error: "Already enrolled" });

      const enrollment = await storage.enrollUserInCourse({
        userId: user.id,
        courseId,
        paymentId,
        status: "active",
      });
      res.json(enrollment);
    } catch (e) {
      console.error("Enroll error:", e);
      res.status(500).json({ error: "Failed to enroll" });
    }
  });

  app.get("/api/my-courses", isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user as User;
      const enrollments = await storage.getUserEnrollments(user.id);
      const enriched = await Promise.all(
        enrollments.map(async (en) => {
          const course = await storage.getCourse(en.courseId);
          const progress = await storage.getStudentProgress(user.id, en.courseId);
          const lessons = await storage.getLessonsByCourse(en.courseId);
          const completed = progress.filter((p: any) => p.completed === "true").length;
          const pct = lessons.length ? Math.round((completed / lessons.length) * 100) : 0;
          return {
            id: en.id,
            courseId: en.courseId,
            courseName: course?.title || "Unknown",
            enrolledAt: en.enrolledAt,
            progress: String(pct),
          };
        })
      );
      res.json(enriched);
    } catch (e) {
      console.error("My courses error:", e);
      res.status(500).json({ error: "Failed to fetch enrollments" });
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
      console.error("Progress error:", e);
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
      const complete = lessons.map((lesson) => {
        const ex = map.get(lesson.id);
        return (
          ex || {
            userId: user.id,
            courseId,
            lessonId: lesson.id,
            completed: "false",
            lastWatchedPosition: "0",
          }
        );
      });
      res.json(complete);
    } catch (e) {
      console.error("Progress fetch error:", e);
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  // ---------------------------
  // Subscription (PROTECTED + ADMIN)
  app.get("/api/subscription", isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user as User;
      const sub = await storage.getUserSubscription(user.id);
      if (!sub) return res.json({ tier: "free", chatLimit: "5", chatsUsed: "0" });
      res.json(sub);
    } catch (e) {
      console.error("Subscription error:", e);
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
      console.error("User subscription error:", e);
      res.status(500).json({ error: "Failed to fetch subscription" });
    }
  });

  app.post("/api/admin/grant-premium", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { tier, userId } = req.body;
      if (!tier) return res.status(400).json({ error: "Tier is required" });
      if (!["free", "premium", "transformation"].includes(tier)) {
        return res.status(400).json({ error: "Invalid tier" });
      }
      const chatLimitMap = { free: "5", premium: "10", transformation: "unlimited" };
      const targetUserId = userId || (req.user as User).id;
      const subscription = await storage.updateSubscriptionTier(
        targetUserId,
        tier as "free" | "premium" | "transformation",
        chatLimitMap[tier as keyof typeof chatLimitMap]
      );
      res.json({ success: true, subscription });
    } catch (e) {
      console.error("Grant premium error:", e);
      res.status(500).json({ error: "Failed to grant premium" });
    }
  });

  app.post("/api/admin/grant-access-by-email", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { tier, email } = req.body;
      if (!tier || !email) return res.status(400).json({ error: "Tier and email are required" });
      if (!["free", "premium", "transformation"].includes(tier)) {
        return res.status(400).json({ error: "Invalid tier" });
      }

      let targetUser = await storage.getUserByEmail(email);
      if (!targetUser) {
        const subs = await storage.getNewsletterSubscribers();
        const sub = subs.find((s: any) => s.email === email);
        if (!sub) return res.status(404).json({ error: "No user or subscriber found" });
        targetUser = await storage.upsertUser({ email: sub.email, firstName: sub.firstName, lastName: sub.lastName, location: sub.location });
      }

      const chatLimitMap = { free: "5", premium: "10", transformation: "unlimited" };
      const subscription = await storage.updateSubscriptionTier(
        targetUser.id,
        tier as "free" | "premium" | "transformation",
        chatLimitMap[tier as keyof typeof chatLimitMap]
      );

      // Optional: sync to Odoo if desired
      try {
        if (odooService.isConfigured()) {
          const tierName = tier === "premium" ? "Premium" : tier === "transformation" ? "Transformation" : "Free";
          await odooService.syncCustomer({
            email: targetUser.email!,
            firstName: targetUser.firstName || undefined,
            lastName: targetUser.lastName || undefined,
            address: targetUser.address || undefined,
            dateOfBirth: targetUser.dateOfBirth || undefined,
            subscriptionTier: tierName,
          });
        }
      } catch (odooErr) {
        console.error("[ODOO] sync subscription error:", odooErr);
      }

      res.json({ success: true, subscription, email: targetUser.email });
    } catch (e) {
      console.error("Grant access by email error:", e);
      res.status(500).json({ error: "Failed to grant access" });
    }
  });

  // ---------------------------
  // Profile + Avatar (PROTECTED)
  app.patch("/api/user/profile", isAuthenticated, async (req: any, res) => {
    try {
      const current = await storage.getUserByEmail(req.user.email);
      if (!current) return res.status(404).json({ error: "User not found" });
      const { firstName, lastName, address, dateOfBirth } = req.body;
      const update = {
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
      const updated = await storage.upsertUser(update);
      const { password, resetPasswordToken, resetPasswordExpires, ...safeUser } = updated;
      res.json(safeUser);
    } catch (e) {
      console.error("Profile update error:", e);
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
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Current and new passwords required" });
      }
      const user = await storage.getUserByEmail(req.user.email);
      if (!user || !user.password) return res.status(404).json({ error: "User not found" });
      const ok = await bcrypt.compare(currentPassword, user.password);
      if (!ok) return res.status(401).json({ error: "Current password incorrect" });
      const hashed = await hashPassword(newPassword);
      await storage.upsertUser({ ...user, password: hashed });
      res.json({ success: true, message: "Password changed" });
    } catch (e) {
      console.error("Change password error:", e);
      res.status(500).json({ error: "Failed to change password" });
    }
  });

  // ---------------------------
  // FLASHCARDS / MEDIA (PROTECTED)
  app.get("/api/flashcards/course/:courseId", isAuthenticated, async (req: any, res) => {
    try {
      res.json(await storage.getFlashcardsByCourse(req.params.courseId));
    } catch (e) {
      console.error("Flashcards by course error:", e);
      res.status(500).json({ error: "Failed to fetch flashcards" });
    }
  });
  app.get("/api/flashcards/lesson/:lessonId", isAuthenticated, async (req: any, res) => {
    try {
      res.json(await storage.getFlashcardsByLesson(req.params.lessonId));
    } catch (e) {
      console.error("Flashcards by lesson error:", e);
      res.status(500).json({ error: "Failed to fetch flashcards" });
    }
  });
  app.get("/api/meditation", isAuthenticated, async (_req: any, res) => {
    try {
      res.json(await storage.getAllMeditationTracks());
    } catch (e) {
      console.error("Meditation error:", e);
      res.status(500).json({ error: "Failed to fetch meditation tracks" });
    }
  });
  app.get("/api/music", isAuthenticated, async (_req: any, res) => {
    try {
      res.json(await storage.getAllMusicTracks());
    } catch (e) {
      console.error("Music error:", e);
      res.status(500).json({ error: "Failed to fetch music tracks" });
    }
  });

  // ---------------------------
  // Odoo admin utility (optional)
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

  // ---------------------------
  // SUPER USER: self verify
  app.get("/api/admin/superuser/self-verify", isAuthenticated, (req: any, res) => {res.json({ email: req.user?.email || null, superuser: isSuperUser(req) });
    });

  // ---------------------------
  // EBOOKS: access + checkout + download
  // Access check
  app.get("/api/ebooks/:ebookId/access", isAuthenticated, async (req: any, res) => {
    try {
      const { ebookId } = req.params;
      if (isSuperUser(req)) return res.json({ hasAccess: true, reason: "superuser" });

      // TODO: replace with your real entitlement check (orders table, etc.)
      const purchased = await storage.userHasEbookAccess?.(req.user.id, ebookId);
      return res.json({ hasAccess: !!purchased, reason: purchased ? "purchased" : "none" });
    } catch (e) {
      console.error("Ebook access error:", e);
      res.status(500).json({ error: "Failed to check access" });
    }
  });

  // Checkout (owner bypass → no-op)
  app.post("/api/ebooks/:ebookId/checkout", isAuthenticated, async (req: any, res) => {
    try {
      const { ebookId } = req.params;
      if (isSuperUser(req)) {
        return res.json({ owner: true, message: "Super user bypass" });
      }

      // Example stub (ODoo: create quotation/order)
      // const orderId = await odooService.createEbookOrder({ userEmail: req.user.email, ebookId });
      // if (!orderId) return res.status(500).json({ error: "Failed to create order" });
      return res.json({ success: true, message: "Checkout initiated" });
    } catch (e) {
      console.error("Checkout error:", e);
      res.status(500).json({ error: "Failed to start checkout" });
    }
  });

  // Secure download
  app.get("/api/ebooks/:ebookId/download", isAuthenticated, async (req: any, res) => {
    try {
      const { ebookId } = req.params;

      // Super user bypass
      let allowed = isSuperUser(req);

      // If not super user, check entitlement
      if (!allowed) {
        const purchased = await storage.userHasEbookAccess?.(req.user.id, ebookId);
        allowed = !!purchased;
      }
      if (!allowed) {
        return res.status(403).json({ error: "No access. Please purchase first." });
      }

      // We serve only PDF for now
      const ebookDir = path.join(ebooksRoot, ebookId);
      const filePath = path.join(ebookDir, `${ebookId}.pdf`);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
      }
      res.download(filePath, `${ebookId}.pdf`);
    } catch (e) {
      console.error("Ebook download error:", e);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ---------------------------
  // HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
