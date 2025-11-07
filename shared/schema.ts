import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, index, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for email/password authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  password: varchar("password"), // bcrypt hashed password
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  address: varchar("address"),
  dateOfBirth: varchar("date_of_birth"),
  location: varchar("location"),
  age: varchar("age"),
  profileImageUrl: varchar("profile_image_url"),
  isAdmin: varchar("is_admin").default("false").notNull(),
  isTestUser: varchar("is_test_user").default("false").notNull(),
  emailVerified: varchar("email_verified").default("false").notNull(),
  verificationToken: varchar("verification_token"),
  verificationTokenExpires: timestamp("verification_token_expires"),
  resetPasswordToken: varchar("reset_password_token"),
  resetPasswordExpires: timestamp("reset_password_expires"),
  odooExternalId: varchar("odoo_external_id"),
  odooRevision: timestamp("odoo_revision"),
  odooLastSyncAt: timestamp("odoo_last_sync_at"),
  odooSource: varchar("odoo_source"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Messages table - now linked to users instead of sessions
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: varchar("role", { enum: ["user", "assistant"] }).notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Newsletter subscribers table
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  location: varchar("location"),
  dateOfBirth: varchar("date_of_birth"),
  isTestUser: varchar("is_test_user").default("false").notNull(),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({
  id: true,
  subscribedAt: true,
}).extend({
  email: z.string().trim().email("Please enter a valid email address"),
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  location: z.string().trim().min(1, "Location is required"),
  dateOfBirth: z.string().optional(),
});

export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

// User subscriptions table - tracks which tier each user has purchased
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  tier: varchar("tier", { enum: ["free", "premium", "transformation"] }).notNull().default("free"),
  chatLimit: varchar("chat_limit").notNull().default("5"), // "5", "10", or "unlimited"
  chatsUsed: varchar("chats_used").notNull().default("0"),
  status: varchar("status", { enum: ["active", "cancelled", "expired"] }).notNull().default("active"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  odooExternalId: varchar("odoo_external_id"),
  odooRevision: timestamp("odoo_revision"),
  odooLastSyncAt: timestamp("odoo_last_sync_at"),
  odooSource: varchar("odoo_source"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

// Chat usage tracking table - detailed logs of each chat session
export const chatUsage = pgTable("chat_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  subscriptionId: varchar("subscription_id").notNull().references(() => subscriptions.id),
  messageCount: varchar("message_count").notNull().default("0"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
});

export const insertChatUsageSchema = createInsertSchema(chatUsage).omit({
  id: true,
  startedAt: true,
});

export type InsertChatUsage = z.infer<typeof insertChatUsageSchema>;
export type ChatUsage = typeof chatUsage.$inferSelect;

// LMS Schema

// Courses table
export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  price: varchar("price").notNull(), // Store as string to preserve formatting like "$97"
  instructor: varchar("instructor").notNull(),
  thumbnail: varchar("thumbnail"),
  duration: varchar("duration"), // e.g., "4 weeks"
  totalLessons: varchar("total_lessons"), // e.g., "15 lessons"
  level: varchar("level"), // e.g., "Beginner", "Intermediate", "Advanced"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

// Modules table
export const modules = pgTable("modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").notNull().references(() => courses.id),
  moduleNumber: varchar("module_number").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  order: varchar("order").notNull(), // Display order
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertModuleSchema = createInsertSchema(modules).omit({
  id: true,
  createdAt: true,
});

export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Module = typeof modules.$inferSelect;

// Lessons table
export const lessons = pgTable("lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").notNull().references(() => courses.id),
  moduleId: varchar("module_id").notNull().references(() => modules.id),
  moduleNumber: varchar("module_number").notNull(),
  lessonNumber: varchar("lesson_number").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  videoUrl: varchar("video_url"),
  duration: varchar("duration"), // e.g., "45 minutes"
  order: varchar("order").notNull(), // Display order within module
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
});

export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessons.$inferSelect;

// Student Progress table
export const studentProgress = pgTable("student_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  courseId: varchar("course_id").notNull().references(() => courses.id),
  lessonId: varchar("lesson_id").notNull().references(() => lessons.id),
  completed: varchar("completed").notNull().default("false"), // "true" or "false"
  completedAt: timestamp("completed_at"),
  lastWatchedPosition: varchar("last_watched_position").default("0"), // Video position in seconds
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertStudentProgressSchema = createInsertSchema(studentProgress).omit({
  id: true,
  updatedAt: true,
});

export type InsertStudentProgress = z.infer<typeof insertStudentProgressSchema>;
export type StudentProgress = typeof studentProgress.$inferSelect;

// Enrollments table
export const enrollments = pgTable("enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  courseId: varchar("course_id").notNull().references(() => courses.id),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  status: varchar("status", { enum: ["active", "completed", "cancelled"] }).notNull().default("active"),
  paymentId: varchar("payment_id"), // For Stripe payment tracking
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  enrolledAt: true,
});

export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = typeof enrollments.$inferSelect;

// Flashcards table
export const flashcards = pgTable("flashcards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").notNull().references(() => courses.id),
  lessonId: varchar("lesson_id").references(() => lessons.id),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: varchar("category"), // e.g., "Vocabulary", "Concepts", "Key Insights"
  order: varchar("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFlashcardSchema = createInsertSchema(flashcards).omit({
  id: true,
  createdAt: true,
});

export type InsertFlashcard = z.infer<typeof insertFlashcardSchema>;
export type Flashcard = typeof flashcards.$inferSelect;

// Meditation Tracks table
export const meditationTracks = pgTable("meditation_tracks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  audioUrl: varchar("audio_url").notNull(),
  duration: varchar("duration"), // e.g., "10 minutes"
  category: varchar("category"), // e.g., "Guided", "Breathwork", "Sleep"
  thumbnail: varchar("thumbnail"),
  isPremium: varchar("is_premium").notNull().default("false"),
  order: varchar("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMeditationTrackSchema = createInsertSchema(meditationTracks).omit({
  id: true,
  createdAt: true,
});

export type InsertMeditationTrack = z.infer<typeof insertMeditationTrackSchema>;
export type MeditationTrack = typeof meditationTracks.$inferSelect;

// Music Tracks table
export const musicTracks = pgTable("music_tracks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  artist: varchar("artist"),
  audioUrl: varchar("audio_url").notNull(),
  duration: varchar("duration"), // e.g., "3:45"
  category: varchar("category"), // e.g., "Ambient", "Focus", "Relaxation"
  thumbnail: varchar("thumbnail"),
  isPremium: varchar("is_premium").notNull().default("false"),
  order: varchar("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMusicTrackSchema = createInsertSchema(musicTracks).omit({
  id: true,
  createdAt: true,
});

export type InsertMusicTrack = z.infer<typeof insertMusicTrackSchema>;
export type MusicTrack = typeof musicTracks.$inferSelect;

// Blog Posts table
export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug").unique().notNull(),
  title: varchar("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: varchar("category").notNull(),
  readTime: varchar("read_time").notNull(), // e.g., "8 min read"
  thumbnail: varchar("thumbnail"),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  publishedAt: true,
  updatedAt: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

// Community Forum Posts table
export const forumPosts = pgTable("forum_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  category: varchar("category", { 
    enum: ["general", "meditation", "philosophy", "guidance", "community"] 
  }).notNull().default("general"),
  likeCount: varchar("like_count").notNull().default("0"),
  replyCount: varchar("reply_count").notNull().default("0"),
  isPinned: varchar("is_pinned").notNull().default("false"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  likeCount: true,
  replyCount: true,
  isPinned: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type ForumPost = typeof forumPosts.$inferSelect;

// Forum Replies table
export const forumReplies = pgTable("forum_replies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull().references(() => forumPosts.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  likeCount: varchar("like_count").notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertForumReplySchema = createInsertSchema(forumReplies).omit({
  id: true,
  likeCount: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertForumReply = z.infer<typeof insertForumReplySchema>;
export type ForumReply = typeof forumReplies.$inferSelect;

// Forum Likes table (tracks who liked what)
export const forumLikes = pgTable("forum_likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  postId: varchar("post_id").references(() => forumPosts.id),
  replyId: varchar("reply_id").references(() => forumReplies.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertForumLikeSchema = createInsertSchema(forumLikes).omit({
  id: true,
  createdAt: true,
});

export type InsertForumLike = z.infer<typeof insertForumLikeSchema>;
export type ForumLike = typeof forumLikes.$inferSelect;
