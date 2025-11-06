import { 
  type Message, type InsertMessage, 
  type User, type UpsertUser, 
  type NewsletterSubscriber, type InsertNewsletterSubscriber,
  type Subscription, type InsertSubscription,
  type Course, type InsertCourse,
  type Module, type InsertModule,
  type Lesson, type InsertLesson,
  type StudentProgress, type InsertStudentProgress,
  type Enrollment, type InsertEnrollment,
  type Flashcard, type InsertFlashcard,
  type MeditationTrack, type InsertMeditationTrack,
  type MusicTrack, type InsertMusicTrack,
  type BlogPost, type InsertBlogPost,
  type ForumPost, type InsertForumPost,
  type ForumReply, type InsertForumReply,
  type ForumLike, type InsertForumLike,
  messages, users, newsletterSubscribers, subscriptions,
  courses, modules, lessons, studentProgress, enrollments,
  flashcards, meditationTracks, musicTracks, blogPosts,
  forumPosts, forumReplies, forumLikes
} from "../shared/schema.ts";
import { db } from "./db.ts";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations (required for email/password auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserTestStatus(userId: string, isTestUser: "true" | "false"): Promise<User>;
  updateUserPassword(userId: string, hashedPassword: string): Promise<void>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  updateResetToken(userId: string, token: string, expires: Date): Promise<void>;
  clearResetToken(userId: string): Promise<void>;
  getUserByVerificationToken(token: string): Promise<User | undefined>;
  updateVerificationToken(userId: string, token: string, expires: Date): Promise<void>;
  clearVerificationToken(userId: string): Promise<void>;
  markEmailAsVerified(userId: string): Promise<void>;
  
  // Message operations
  getMessagesByUser(userId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  deleteMessagesByUser(userId: string): Promise<void>;
  
  // Newsletter operations
  addNewsletterSubscriber(email: string): Promise<NewsletterSubscriber>;
  getNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  updateSubscriberTestStatus(subscriberId: string, isTestUser: "true" | "false"): Promise<NewsletterSubscriber>;
  
  // Subscription operations
  getUserSubscription(userId: string): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscriptionTier(userId: string, tier: "free" | "premium" | "transformation", chatLimit: string): Promise<Subscription>;
  getAllSubscriptions(): Promise<Subscription[]>;
  
  // LMS operations - Courses
  getAllCourses(): Promise<Course[]>;
  getCourse(id: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // LMS operations - Modules
  getModulesByCourse(courseId: string): Promise<Module[]>;
  createModule(module: InsertModule): Promise<Module>;
  
  // LMS operations - Lessons
  getLessonsByCourse(courseId: string): Promise<Lesson[]>;
  getLessonsByModule(moduleId: string): Promise<Lesson[]>;
  getLesson(id: string): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  
  // LMS operations - Enrollments
  enrollUserInCourse(enrollment: InsertEnrollment): Promise<Enrollment>;
  getUserEnrollments(userId: string): Promise<Enrollment[]>;
  getEnrollment(userId: string, courseId: string): Promise<Enrollment | undefined>;
  updateEnrollmentStatus(id: string, status: string, completedAt?: Date): Promise<Enrollment>;
  
  // LMS operations - Progress
  getStudentProgress(userId: string, courseId: string): Promise<StudentProgress[]>;
  getLessonProgress(userId: string, lessonId: string): Promise<StudentProgress | undefined>;
  updateLessonProgress(progress: InsertStudentProgress): Promise<StudentProgress>;
  
  // Academy operations - Flashcards
  getFlashcardsByCourse(courseId: string): Promise<Flashcard[]>;
  getFlashcardsByLesson(lessonId: string): Promise<Flashcard[]>;
  createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard>;
  
  // Academy operations - Meditation
  getAllMeditationTracks(): Promise<MeditationTrack[]>;
  getMeditationTrack(id: string): Promise<MeditationTrack | undefined>;
  createMeditationTrack(track: InsertMeditationTrack): Promise<MeditationTrack>;
  
  // Academy operations - Music
  getAllMusicTracks(): Promise<MusicTrack[]>;
  getMusicTrack(id: string): Promise<MusicTrack | undefined>;
  createMusicTrack(track: InsertMusicTrack): Promise<MusicTrack>;
  
  // Blog operations
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  
  // Forum operations - Posts
  getAllForumPosts(): Promise<ForumPost[]>;
  getForumPost(id: string): Promise<ForumPost | undefined>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  incrementForumPostReplyCount(postId: string): Promise<void>;
  toggleForumPostLike(postId: string, increment: boolean): Promise<void>;
  
  // Forum operations - Replies
  getForumRepliesByPost(postId: string): Promise<ForumReply[]>;
  createForumReply(reply: InsertForumReply): Promise<ForumReply>;
  toggleForumReplyLike(replyId: string, increment: boolean): Promise<void>;
  
  // Forum operations - Likes
  getUserLikeForPost(userId: string, postId: string): Promise<ForumLike | undefined>;
  getUserLikeForReply(userId: string, replyId: string): Promise<ForumLike | undefined>;
  createForumLike(like: InsertForumLike): Promise<ForumLike>;
  deleteForumLike(likeId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // First try to find existing user by ID
    if (userData.id) {
      const existing = await this.getUser(userData.id);
      if (existing) {
        // Update existing user - preserve ID, only update mutable fields
        const [updated] = await db
          .update(users)
          .set({
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            location: userData.location,
            age: userData.age,
            profileImageUrl: userData.profileImageUrl,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userData.id))
          .returning();
        return updated;
      }
    }
    
    // If no ID or user not found, try to find by email
    if (userData.email) {
      const [existingByEmail] = await db
        .select()
        .from(users)
        .where(eq(users.email, userData.email));
      
      if (existingByEmail) {
        // Update existing user found by email - PRESERVE existing ID
        const [updated] = await db
          .update(users)
          .set({
            // DO NOT update id - preserve existing user's ID
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            location: userData.location,
            age: userData.age,
            profileImageUrl: userData.profileImageUrl,
            updatedAt: new Date(),
          })
          .where(eq(users.id, existingByEmail.id))
          .returning();
        return updated;
      }
    }
    
    // No existing user found, insert new one
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(users.createdAt);
  }

  async updateUserTestStatus(userId: string, isTestUser: "true" | "false"): Promise<User> {
    const [updated] = await db
      .update(users)
      .set({ isTestUser, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return updated;
  }

  async updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.resetPasswordToken, token));
    return user;
  }

  async updateResetToken(userId: string, token: string, expires: Date): Promise<void> {
    await db
      .update(users)
      .set({ 
        resetPasswordToken: token, 
        resetPasswordExpires: expires,
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId));
  }

  async clearResetToken(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        resetPasswordToken: null, 
        resetPasswordExpires: null,
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId));
  }

  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.verificationToken, token));
    return user;
  }

  async updateVerificationToken(userId: string, token: string, expires: Date): Promise<void> {
    await db
      .update(users)
      .set({ 
        verificationToken: token, 
        verificationTokenExpires: expires,
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId));
  }

  async clearVerificationToken(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        verificationToken: null, 
        verificationTokenExpires: null,
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId));
  }

  async markEmailAsVerified(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        emailVerified: "true",
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId));
  }

  // Message operations
  async getMessagesByUser(userId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.userId, userId))
      .orderBy(messages.timestamp);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async deleteMessagesByUser(userId: string): Promise<void> {
    await db
      .delete(messages)
      .where(eq(messages.userId, userId));
  }

  // Newsletter operations
  async addNewsletterSubscriber(email: string): Promise<NewsletterSubscriber> {
    const [subscriber] = await db
      .insert(newsletterSubscribers)
      .values({ email })
      .onConflictDoNothing()
      .returning();
    
    // If onConflictDoNothing returned nothing, fetch the existing subscriber
    if (!subscriber) {
      const [existing] = await db
        .select()
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.email, email));
      return existing;
    }
    
    return subscriber;
  }

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return await db
      .select()
      .from(newsletterSubscribers)
      .orderBy(newsletterSubscribers.subscribedAt);
  }

  async updateSubscriberTestStatus(subscriberId: string, isTestUser: "true" | "false"): Promise<NewsletterSubscriber> {
    const [updated] = await db
      .update(newsletterSubscribers)
      .set({ isTestUser })
      .where(eq(newsletterSubscribers.id, subscriberId))
      .returning();
    return updated;
  }

  // Subscription operations
  async getUserSubscription(userId: string): Promise<Subscription | undefined> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));
    return subscription;
  }

  async createSubscription(subscriptionData: InsertSubscription): Promise<Subscription> {
    const [subscription] = await db
      .insert(subscriptions)
      .values(subscriptionData)
      .returning();
    return subscription;
  }

  async updateSubscriptionTier(
    userId: string, 
    tier: "free" | "premium" | "transformation", 
    chatLimit: string
  ): Promise<Subscription> {
    // First check if subscription exists
    const existing = await this.getUserSubscription(userId);
    
    if (!existing) {
      // Create new subscription
      return await this.createSubscription({
        userId,
        tier,
        chatLimit,
        chatsUsed: "0",
        status: "active",
      });
    }
    
    // Update existing subscription
    const [subscription] = await db
      .update(subscriptions)
      .set({
        tier,
        chatLimit,
        status: "active",
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.userId, userId))
      .returning();
    return subscription;
  }

  async getAllSubscriptions(): Promise<Subscription[]> {
    return await db
      .select()
      .from(subscriptions)
      .orderBy(desc(subscriptions.createdAt));
  }

  // LMS operations - Courses
  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses).orderBy(courses.createdAt);
  }

  async getCourse(id: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createCourse(courseData: InsertCourse): Promise<Course> {
    const [course] = await db.insert(courses).values(courseData).returning();
    return course;
  }

  // LMS operations - Modules
  async getModulesByCourse(courseId: string): Promise<Module[]> {
    return await db
      .select()
      .from(modules)
      .where(eq(modules.courseId, courseId))
      .orderBy(modules.order);
  }

  async createModule(moduleData: InsertModule): Promise<Module> {
    const [module] = await db.insert(modules).values(moduleData).returning();
    return module;
  }

  // LMS operations - Lessons
  async getLessonsByCourse(courseId: string): Promise<Lesson[]> {
    return await db
      .select()
      .from(lessons)
      .where(eq(lessons.courseId, courseId))
      .orderBy(lessons.order);
  }

  async getLessonsByModule(moduleId: string): Promise<Lesson[]> {
    return await db
      .select()
      .from(lessons)
      .where(eq(lessons.moduleId, moduleId))
      .orderBy(lessons.order);
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson;
  }

  async createLesson(lessonData: InsertLesson): Promise<Lesson> {
    const [lesson] = await db.insert(lessons).values(lessonData).returning();
    return lesson;
  }

  // LMS operations - Enrollments
  async enrollUserInCourse(enrollmentData: InsertEnrollment): Promise<Enrollment> {
    const [enrollment] = await db
      .insert(enrollments)
      .values(enrollmentData)
      .returning();
    return enrollment;
  }

  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    return await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.userId, userId))
      .orderBy(desc(enrollments.enrolledAt));
  }

  async getEnrollment(userId: string, courseId: string): Promise<Enrollment | undefined> {
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(and(
        eq(enrollments.userId, userId),
        eq(enrollments.courseId, courseId)
      ));
    return enrollment;
  }

  async updateEnrollmentStatus(id: string, status: "active" | "completed" | "cancelled", completedAt?: Date): Promise<Enrollment> {
    const [enrollment] = await db
      .update(enrollments)
      .set({ status, completedAt })
      .where(eq(enrollments.id, id))
      .returning();
    return enrollment;
  }

  // LMS operations - Progress
  async getStudentProgress(userId: string, courseId: string): Promise<StudentProgress[]> {
    return await db
      .select()
      .from(studentProgress)
      .where(and(
        eq(studentProgress.userId, userId),
        eq(studentProgress.courseId, courseId)
      ));
  }

  async getLessonProgress(userId: string, lessonId: string): Promise<StudentProgress | undefined> {
    const [progress] = await db
      .select()
      .from(studentProgress)
      .where(and(
        eq(studentProgress.userId, userId),
        eq(studentProgress.lessonId, lessonId)
      ));
    return progress;
  }

  async updateLessonProgress(progressData: InsertStudentProgress): Promise<StudentProgress> {
    const [progress] = await db
      .insert(studentProgress)
      .values(progressData)
      .onConflictDoUpdate({
        target: [studentProgress.userId, studentProgress.lessonId],
        set: {
          ...progressData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return progress;
  }

  // Academy operations - Flashcards
  async getFlashcardsByCourse(courseId: string): Promise<Flashcard[]> {
    return await db
      .select()
      .from(flashcards)
      .where(eq(flashcards.courseId, courseId))
      .orderBy(flashcards.order);
  }

  async getFlashcardsByLesson(lessonId: string): Promise<Flashcard[]> {
    return await db
      .select()
      .from(flashcards)
      .where(eq(flashcards.lessonId, lessonId))
      .orderBy(flashcards.order);
  }

  async createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard> {
    const [created] = await db.insert(flashcards).values(flashcard).returning();
    return created;
  }

  // Academy operations - Meditation
  async getAllMeditationTracks(): Promise<MeditationTrack[]> {
    return await db
      .select()
      .from(meditationTracks)
      .orderBy(meditationTracks.order);
  }

  async getMeditationTrack(id: string): Promise<MeditationTrack | undefined> {
    const [track] = await db
      .select()
      .from(meditationTracks)
      .where(eq(meditationTracks.id, id));
    return track;
  }

  async createMeditationTrack(track: InsertMeditationTrack): Promise<MeditationTrack> {
    const [created] = await db.insert(meditationTracks).values(track).returning();
    return created;
  }

  // Academy operations - Music
  async getAllMusicTracks(): Promise<MusicTrack[]> {
    return await db
      .select()
      .from(musicTracks)
      .orderBy(musicTracks.order);
  }

  async getMusicTrack(id: string): Promise<MusicTrack | undefined> {
    const [track] = await db
      .select()
      .from(musicTracks)
      .where(eq(musicTracks.id, id));
    return track;
  }

  async createMusicTrack(track: InsertMusicTrack): Promise<MusicTrack> {
    const [created] = await db.insert(musicTracks).values(track).returning();
    return created;
  }

  // Blog operations
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.publishedAt));
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [created] = await db.insert(blogPosts).values(post).returning();
    return created;
  }

  // Forum operations - Posts
  async getAllForumPosts(): Promise<ForumPost[]> {
    return await db
      .select()
      .from(forumPosts)
      .orderBy(desc(forumPosts.isPinned), desc(forumPosts.createdAt));
  }

  async getForumPost(id: string): Promise<ForumPost | undefined> {
    const [post] = await db
      .select()
      .from(forumPosts)
      .where(eq(forumPosts.id, id));
    return post;
  }

  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const [created] = await db.insert(forumPosts).values(post).returning();
    return created;
  }

  async incrementForumPostReplyCount(postId: string): Promise<void> {
    const post = await this.getForumPost(postId);
    if (post) {
      const currentCount = parseInt(post.replyCount || "0");
      await db
        .update(forumPosts)
        .set({ replyCount: String(currentCount + 1) })
        .where(eq(forumPosts.id, postId));
    }
  }

  async toggleForumPostLike(postId: string, increment: boolean): Promise<void> {
    const post = await this.getForumPost(postId);
    if (post) {
      const currentCount = parseInt(post.likeCount || "0");
      const newCount = increment ? currentCount + 1 : Math.max(0, currentCount - 1);
      await db
        .update(forumPosts)
        .set({ likeCount: String(newCount) })
        .where(eq(forumPosts.id, postId));
    }
  }

  // Forum operations - Replies
  async getForumRepliesByPost(postId: string): Promise<ForumReply[]> {
    return await db
      .select()
      .from(forumReplies)
      .where(eq(forumReplies.postId, postId))
      .orderBy(forumReplies.createdAt);
  }

  async createForumReply(reply: InsertForumReply): Promise<ForumReply> {
    const [created] = await db.insert(forumReplies).values(reply).returning();
    await this.incrementForumPostReplyCount(reply.postId);
    return created;
  }

  async toggleForumReplyLike(replyId: string, increment: boolean): Promise<void> {
    const [reply] = await db
      .select()
      .from(forumReplies)
      .where(eq(forumReplies.id, replyId));
    
    if (reply) {
      const currentCount = parseInt(reply.likeCount || "0");
      const newCount = increment ? currentCount + 1 : Math.max(0, currentCount - 1);
      await db
        .update(forumReplies)
        .set({ likeCount: String(newCount) })
        .where(eq(forumReplies.id, replyId));
    }
  }

  // Forum operations - Likes
  async getUserLikeForPost(userId: string, postId: string): Promise<ForumLike | undefined> {
    const [like] = await db
      .select()
      .from(forumLikes)
      .where(and(
        eq(forumLikes.userId, userId),
        eq(forumLikes.postId, postId)
      ));
    return like;
  }

  async getUserLikeForReply(userId: string, replyId: string): Promise<ForumLike | undefined> {
    const [like] = await db
      .select()
      .from(forumLikes)
      .where(and(
        eq(forumLikes.userId, userId),
        eq(forumLikes.replyId, replyId)
      ));
    return like;
  }

  async createForumLike(like: InsertForumLike): Promise<ForumLike> {
    const [created] = await db.insert(forumLikes).values(like).returning();
    return created;
  }

  async deleteForumLike(likeId: string): Promise<void> {
    await db.delete(forumLikes).where(eq(forumLikes.id, likeId));
  }
}

export const storage = new DatabaseStorage();
