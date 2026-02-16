'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { USER_ROLES, AGE_VERIFICATION_COOKIE_NAME } from '@/lib/constants';
import { hash, compare } from 'crypto';
import { SignJWT, jwtVerify } from 'jose';
import { z } from 'zod';

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const secretKey = new TextEncoder().encode(JWT_SECRET);

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required').optional(),
  role: z.enum(['visitor', 'model', 'subscriber']).default('visitor'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Helper to hash password
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Helper to verify password
async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hashed = await hashPassword(password);
  return hashed === hashedPassword;
}

// Generate JWT token
async function generateToken(userId: string, email: string, role: string): Promise<string> {
  return new SignJWT({ userId, email, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

// Verify JWT token
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as { userId: string; email: string; role: string };
  } catch {
    return null;
  }
}

// Get current user from cookies
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  
  if (!token) return null;
  
  const payload = await verifyToken(token);
  if (!payload) return null;
  
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      email_verified: true,
      age_verified: true,
      is_banned: true,
      created_at: true,
      profile: {
        select: {
          id: true,
          stage_name: true,
          slug: true,
          avatar_url: true,
          status: true,
        },
      },
    },
  });
  
  return user;
}

// Register new user
export async function register(formData: FormData) {
  try {
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      name: formData.get('name') as string | undefined,
      role: formData.get('role') as string || 'visitor',
    };
    
    const validatedData = registerSchema.parse(rawData);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    
    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }
    
    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password_hash: hashedPassword,
        name: validatedData.name,
        role: validatedData.role as 'visitor' | 'model' | 'subscriber',
      },
    });
    
    // If registering as model, create profile
    if (validatedData.role === 'model') {
      const baseSlug = validatedData.name?.toLowerCase().replace(/\s+/g, '-') || user.id;
      const slug = `${baseSlug}-${user.id.slice(0, 8)}`;
      
      await prisma.profile.create({
        data: {
          user_id: user.id,
          stage_name: validatedData.name || `Model ${user.id.slice(0, 4)}`,
          slug,
          status: 'pending',
          verification_status: 'unverified',
        },
      });
    }
    
    // Generate token
    const token = await generateToken(user.id, user.email, user.role);
    
    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    revalidatePath('/');
    
    return { success: true, user: { id: user.id, email: user.email, role: user.role } };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Registration failed' };
  }
}

// Login
export async function login(formData: FormData) {
  try {
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };
    
    const validatedData = loginSchema.parse(rawData);
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    
    if (!user || !user.password_hash) {
      return { success: false, error: 'Invalid email or password' };
    }
    
    // Check if banned
    if (user.is_banned) {
      return { success: false, error: 'Account has been suspended' };
    }
    
    // Verify password
    const isValid = await verifyPassword(validatedData.password, user.password_hash);
    if (!isValid) {
      return { success: false, error: 'Invalid email or password' };
    }
    
    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { last_login: new Date() },
    });
    
    // Generate token
    const token = await generateToken(user.id, user.email, user.role);
    
    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    revalidatePath('/');
    
    return { success: true, user: { id: user.id, email: user.email, role: user.role } };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Login failed' };
  }
}

// Logout
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  revalidatePath('/');
  return { success: true };
}

// Verify age (store in cookie)
export async function verifyAge(birthDate: string) {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  if (age < 18) {
    return { success: false, error: 'You must be at least 18 years old' };
  }
  
  const cookieStore = await cookies();
  cookieStore.set(AGE_VERIFICATION_COOKIE_NAME, 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
  
  return { success: true };
}
