// Email/Password authentication system
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { storage } from "./storage";
import type { User } from "../shared/schema";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Get session secret (required)
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    throw new Error('SESSION_SECRET environment variable is required for authentication');
  }

  // Use PostgreSQL store if DATABASE_URL is available, otherwise use memory store
  let sessionStore;
  const databaseUrl = process.env.DATABASE_URL;
  
  if (databaseUrl) {
    const pgStore = connectPg(session);
    sessionStore = new pgStore({
      conString: databaseUrl,
      createTableIfMissing: false,
      ttl: sessionTtl,
      tableName: "sessions",
    });
    console.log('[Auth] Using PostgreSQL session store');
  } else {
    // Fallback to memory store for development
    console.warn('[Auth] DATABASE_URL not found, using in-memory session store (not suitable for production)');
    sessionStore = new session.MemoryStore();
  }

  return session({
    secret: sessionSecret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction, // Only use secure cookies in production (HTTPS required)
      sameSite: 'lax', // CSRF protection
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Local strategy for email/password login
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        
        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        if (!user.password) {
          return done(null, false, { message: 'Please create a password first' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((user: any, cb) => {
    cb(null, user.id);
  });

  passport.deserializeUser(async (id: string, cb) => {
    try {
      const user = await storage.getUser(id);
      cb(null, user);
    } catch (error) {
      cb(error);
    }
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return next();
};

// SECURITY: Only this email can access admin features
const ADMIN_EMAIL = "leratom2012@gmail.com";

export const isAdmin: RequestHandler = async (req: any, res, next) => {
  const user = req.user as User;
  
  if (!user || !user.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  // CRITICAL SECURITY: Only the hardcoded admin email can access admin features
  if (user.email !== ADMIN_EMAIL) {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }
  
  return next();
};

// Helper function to hash passwords
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Helper function to generate reset token
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Helper function to check password strength (min 8 characters with complexity requirements)
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  // Check for mixed case (at least one uppercase and one lowercase)
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  return { valid: true };
}
