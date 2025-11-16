import { sql } from "drizzle-orm";
import { mysqlTable, text, varchar, timestamp, index, json, datetime } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = mysqlTable(
  "sessions",
  {
    sid: varchar("sid", { length: 255 }).primaryKey(),
    sess: json("sess").notNull(),
    expire: datetime("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for email/password authentication
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  email: varchar("email", { length: 255 }).unique(),
  password: varchar("password", { length: 255 }), // bcrypt hashed password
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  address: varchar("address", { length: 500 }),
  dateOfBirth: varchar("date_of_birth", { length: 50 }),
  location: varchar("location", { length: 255 }),
  age: varchar("age", { length: 10 }),
  profileImageUrl: varchar("profile_image_url", { length: 500 }),
  isAdmin: varchar("is_admin", { length: 10 }).default("false").notNull(),
  isTestUser: varchar("is_test_user", { length: 10 }).default("false").notNull(),
  emailVerified: varchar("email_verified", { length: 10 }).default("false").notNull(),
  verificationToken: varchar("verification_token", { length: 255 }),
  verificationTokenExpires: datetime("verification_token_expires"),
  resetPasswordToken: varchar("reset_password_token", { length: 255 }),
  resetPasswordExpires: datetime("reset_password_expires"),
  odooExternalId: varchar("odoo_external_id", { length: 255 }),
  odooRevision: datetime("odoo_revision"),
  odooLastSyncAt: datetime("odoo_last_sync_at"),
  odooSource: varchar("odoo_source", { length: 255 }),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Messages table - now linked to users instead of sessions
export const messages = mysqlTable("messages", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  role: varchar("role", { length: 20, enum: ["user", "assistant"] }).notNull(),
  content: text("content").notNull(),
  timestamp: datetime("timestamp").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Newsletter subscribers table
export const newsletterSubscribers = mysqlTable("newsletter_subscribers", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  email: varchar("email", { length: 255 }).unique().notNull(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  location: varchar("location", { length: 255 }),
  dateOfBirth: varchar("date_of_birth", { length: 50 }),
  isTestUser: varchar("is_test_user", { length: 10 }).default("false").notNull(),
  subscribedAt: datetime("subscribed_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
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
export const subscriptions = mysqlTable("subscriptions", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  tier: varchar("tier", { length: 20, enum: ["free", "premium", "transformation"] }).notNull().default("free"),
  chatLimit: varchar("chat_limit", { length: 20 }).notNull().default("5"), // "5", "10", or "unlimited"
  chatsUsed: varchar("chats_used", { length: 20 }).notNull().default("0"), // DEPRECATED: use dailyChatsUsed instead

  // NEW FIELDS for daily chat limit tracking
  dailyChatsUsed: varchar("daily_chats_used", { length: 20 }).notNull().default("0"), // Current day's usage
  lastResetDate: datetime("last_reset_date").default(sql`CURRENT_TIMESTAMP`).notNull(), // Last time daily usage was reset

  status: varchar("status", { length: 20, enum: ["active", "cancelled", "expired"] }).notNull().default("active"),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  currentPeriodStart: datetime("current_period_start"),
  currentPeriodEnd: datetime("current_period_end"),
  odooExternalId: varchar("odoo_external_id", { length: 255 }),
  odooRevision: datetime("odoo_revision"),
  odooLastSyncAt: datetime("odoo_last_sync_at"),
  odooSource: varchar("odoo_source", { length: 255 }),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

// Chat usage tracking table - detailed logs of each chat session
export const chatUsage = mysqlTable("chat_usage", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  subscriptionId: varchar("subscription_id", { length: 36 }).notNull().references(() => subscriptions.id),
  messageCount: varchar("message_count", { length: 20 }).notNull().default("0"),
  startedAt: datetime("started_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  endedAt: datetime("ended_at"),
});

export const insertChatUsageSchema = createInsertSchema(chatUsage).omit({
  id: true,
  startedAt: true,
});

export type InsertChatUsage = z.infer<typeof insertChatUsageSchema>;
export type ChatUsage = typeof chatUsage.$inferSelect;

// LMS Schema

// Courses table
export const courses = mysqlTable("courses", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: varchar("price", { length: 50 }).notNull(), // Store as string to preserve formatting like "$97"
  instructor: varchar("instructor", { length: 255 }).notNull(),
  thumbnail: varchar("thumbnail", { length: 500 }),
  duration: varchar("duration", { length: 50 }), // e.g., "4 weeks"
  totalLessons: varchar("total_lessons", { length: 50 }), // e.g., "15 lessons"
  level: varchar("level", { length: 50 }), // e.g., "Beginner", "Intermediate", "Advanced"
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

// Modules table
export const modules = mysqlTable("modules", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  courseId: varchar("course_id", { length: 36 }).notNull().references(() => courses.id),
  moduleNumber: varchar("module_number", { length: 20 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  order: varchar("order", { length: 20 }).notNull(), // Display order
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertModuleSchema = createInsertSchema(modules).omit({
  id: true,
  createdAt: true,
});

export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Module = typeof modules.$inferSelect;

// Lessons table
export const lessons = mysqlTable("lessons", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  courseId: varchar("course_id", { length: 36 }).notNull().references(() => courses.id),
  moduleId: varchar("module_id", { length: 36 }).notNull().references(() => modules.id),
  moduleNumber: varchar("module_number", { length: 20 }).notNull(),
  lessonNumber: varchar("lesson_number", { length: 20 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  videoUrl: varchar("video_url", { length: 500 }),
  duration: varchar("duration", { length: 50 }), // e.g., "45 minutes"
  order: varchar("order", { length: 20 }).notNull(), // Display order within module
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
});

export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessons.$inferSelect;

// Student Progress table
export const studentProgress = mysqlTable("student_progress", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  courseId: varchar("course_id", { length: 36 }).notNull().references(() => courses.id),
  lessonId: varchar("lesson_id", { length: 36 }).notNull().references(() => lessons.id),
  completed: varchar("completed", { length: 10 }).notNull().default("false"), // "true" or "false"
  completedAt: datetime("completed_at"),
  lastWatchedPosition: varchar("last_watched_position", { length: 20 }).default("0"), // Video position in seconds
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertStudentProgressSchema = createInsertSchema(studentProgress).omit({
  id: true,
  updatedAt: true,
});

export type InsertStudentProgress = z.infer<typeof insertStudentProgressSchema>;
export type StudentProgress = typeof studentProgress.$inferSelect;

// Enrollments table
export const enrollments = mysqlTable("enrollments", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  courseId: varchar("course_id", { length: 36 }).notNull().references(() => courses.id),
  enrolledAt: datetime("enrolled_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  completedAt: datetime("completed_at"),
  status: varchar("status", { length: 20, enum: ["active", "completed", "cancelled"] }).notNull().default("active"),
  paymentId: varchar("payment_id", { length: 255 }), // For Stripe payment tracking
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  enrolledAt: true,
});

export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = typeof enrollments.$inferSelect;

// Flashcards table
export const flashcards = mysqlTable("flashcards", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  courseId: varchar("course_id", { length: 36 }).notNull().references(() => courses.id),
  lessonId: varchar("lesson_id", { length: 36 }).references(() => lessons.id),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: varchar("category", { length: 100 }), // e.g., "Vocabulary", "Concepts", "Key Insights"
  order: varchar("order", { length: 20 }).notNull(),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertFlashcardSchema = createInsertSchema(flashcards).omit({
  id: true,
  createdAt: true,
});

export type InsertFlashcard = z.infer<typeof insertFlashcardSchema>;
export type Flashcard = typeof flashcards.$inferSelect;

// Meditation Tracks table
export const meditationTracks = mysqlTable("meditation_tracks", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  audioUrl: varchar("audio_url", { length: 500 }).notNull(),
  duration: varchar("duration", { length: 50 }), // e.g., "10 minutes"
  category: varchar("category", { length: 100 }), // e.g., "Guided", "Breathwork", "Sleep"
  thumbnail: varchar("thumbnail", { length: 500 }),
  isPremium: varchar("is_premium", { length: 10 }).notNull().default("false"),
  order: varchar("order", { length: 20 }).notNull(),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertMeditationTrackSchema = createInsertSchema(meditationTracks).omit({
  id: true,
  createdAt: true,
});

export type InsertMeditationTrack = z.infer<typeof insertMeditationTrackSchema>;
export type MeditationTrack = typeof meditationTracks.$inferSelect;

// Music Tracks table
export const musicTracks = mysqlTable("music_tracks", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  title: varchar("title", { length: 255 }).notNull(),
  artist: varchar("artist", { length: 255 }),
  audioUrl: varchar("audio_url", { length: 500 }).notNull(),
  duration: varchar("duration", { length: 50 }), // e.g., "3:45"
  category: varchar("category", { length: 100 }), // e.g., "Ambient", "Focus", "Relaxation"
  thumbnail: varchar("thumbnail", { length: 500 }),
  isPremium: varchar("is_premium", { length: 10 }).notNull().default("false"),
  order: varchar("order", { length: 20 }).notNull(),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertMusicTrackSchema = createInsertSchema(musicTracks).omit({
  id: true,
  createdAt: true,
});

export type InsertMusicTrack = z.infer<typeof insertMusicTrackSchema>;
export type MusicTrack = typeof musicTracks.$inferSelect;

// Blog Posts table
export const blogPosts = mysqlTable("blog_posts", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  readTime: varchar("read_time", { length: 50 }).notNull(), // e.g., "8 min read"
  thumbnail: varchar("thumbnail", { length: 500 }),
  publishedAt: datetime("published_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  publishedAt: true,
  updatedAt: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

// Community Forum Posts table
export const forumPosts = mysqlTable("forum_posts", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", {
    length: 50,
    enum: ["general", "meditation", "philosophy", "guidance", "community"]
  }).notNull().default("general"),
  likeCount: varchar("like_count", { length: 20 }).notNull().default("0"),
  replyCount: varchar("reply_count", { length: 20 }).notNull().default("0"),
  isPinned: varchar("is_pinned", { length: 10 }).notNull().default("false"),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
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
export const forumReplies = mysqlTable("forum_replies", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  postId: varchar("post_id", { length: 36 }).notNull().references(() => forumPosts.id),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  content: text("content").notNull(),
  likeCount: varchar("like_count", { length: 20 }).notNull().default("0"),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
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
export const forumLikes = mysqlTable("forum_likes", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  postId: varchar("post_id", { length: 36 }).references(() => forumPosts.id),
  replyId: varchar("reply_id", { length: 36 }).references(() => forumReplies.id),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertForumLikeSchema = createInsertSchema(forumLikes).omit({
  id: true,
  createdAt: true,
});

export type InsertForumLike = z.infer<typeof insertForumLikeSchema>;
export type ForumLike = typeof forumLikes.$inferSelect;
