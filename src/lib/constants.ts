/**
 * Bellas Glamour - Application Constants
 * =====================================
 * Central configuration for the platform
 */

// Application Info
export const APP_NAME = 'Bellas Glamour';
export const APP_TAGLINE = 'Elegance Meets Desire';
export const APP_DESCRIPTION = 'Premium adult content platform featuring exclusive models and creators';
export const APP_VERSION = '1.0.0';

// Legal Requirements
export const MINIMUM_AGE = 18;
export const AGE_VERIFICATION_COOKIE_NAME = 'bg_age_verified';
export const AGE_VERIFICATION_EXPIRY_DAYS = 30;

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MODEL: 'model',
  SUBSCRIBER: 'subscriber',
  VISITOR: 'visitor',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Profile Status
export const PROFILE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  SUSPENDED: 'suspended',
  REJECTED: 'rejected',
} as const;

// Verification Status
export const VERIFICATION_STATUS = {
  UNVERIFIED: 'unverified',
  PENDING_ID: 'pending_id',
  VERIFIED: 'verified',
} as const;

// Media Types
export const MEDIA_TYPES = {
  PHOTO: 'photo',
  VIDEO: 'video',
  GIF: 'gif',
} as const;

// Moderation Status
export const MODERATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  FLAGGED: 'flagged',
} as const;

// Subscription Status
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  CANCELED: 'canceled',
  PAST_DUE: 'past_due',
  PAUSED: 'paused',
  EXPIRED: 'expired',
} as const;

// Transaction Types
export const TRANSACTION_TYPES = {
  SUBSCRIPTION: 'subscription',
  TIP: 'tip',
  PPV_UNLOCK: 'ppv_unlock',
  PAYOUT: 'payout',
  REFUND: 'refund',
} as const;

// Transaction Status
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

// Age Verification Methods
export const AGE_VERIFICATION_METHODS = {
  CREDIT_CARD: 'credit_card',
  ID_DOCUMENT: 'id_document',
  THIRD_PARTY: 'third_party',
} as const;

// Document Types for Verification
export const DOCUMENT_TYPES = {
  PASSPORT: 'passport',
  DRIVER_LICENSE: 'driver_license',
  NATIONAL_ID: 'national_id',
} as const;

// Content Warnings
export const CONTENT_WARNINGS = {
  EXPLICIT: 'explicit',
  ARTISTIC_NUDITY: 'artistic_nudity',
  SUGGESTIVE: 'suggestive',
  MATURE_THEMES: 'mature_themes',
} as const;

// Pricing
export const DEFAULT_SUBSCRIPTION_PRICE = 9.99;
export const MIN_SUBSCRIPTION_PRICE = 4.99;
export const MAX_SUBSCRIPTION_PRICE = 99.99;
export const PLATFORM_FEE_PERCENTAGE = 20; // 20% platform fee

// Geoblocking - Restricted Countries (ISO 3166-1 alpha-2 codes)
export const RESTRICTED_COUNTRIES = [
  // Add countries as needed for compliance
  // Example: 'XX' for demonstration
];

// Rate Limiting
export const RATE_LIMITS = {
  UPLOADS_PER_HOUR: 50,
  MESSAGES_PER_HOUR: 100,
  API_REQUESTS_PER_MINUTE: 60,
  LOGIN_ATTEMPTS_PER_HOUR: 10,
} as const;

// File Upload Limits
export const UPLOAD_LIMITS = {
  PHOTO_MAX_SIZE_MB: 10,
  VIDEO_MAX_SIZE_MB: 500,
  ALLOWED_PHOTO_FORMATS: ['jpg', 'jpeg', 'png', 'webp'],
  ALLOWED_VIDEO_FORMATS: ['mp4', 'mov', 'webm'],
  MAX_FILES_PER_UPLOAD: 20,
} as const;

// Navigation Links
export const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#models', label: 'Models' },
  { href: '#featured', label: 'Featured' },
  { href: '#categories', label: 'Categories' },
] as const;

// Social Platforms for Model Profiles
export const SOCIAL_PLATFORMS = [
  { id: 'twitter', label: 'Twitter/X', icon: 'twitter' },
  { id: 'instagram', label: 'Instagram', icon: 'instagram' },
  { id: 'tiktok', label: 'TikTok', icon: 'tiktok' },
  { id: 'onlyfans', label: 'OnlyFans', icon: 'heart' },
  { id: 'snapchat', label: 'Snapchat', icon: 'snapchat' },
] as const;

// Eye Color Options
export const EYE_COLORS = [
  'Brown',
  'Blue',
  'Green',
  'Hazel',
  'Gray',
  'Amber',
  'Other',
] as const;

// Hair Color Options
export const HAIR_COLORS = [
  'Black',
  'Brown',
  'Blonde',
  'Red',
  'Auburn',
  'Gray',
  'White',
  'Colorful',
  'Other',
] as const;

// Ethnicity Options
export const ETHNICITIES = [
  'Asian',
  'Black',
  'Hispanic',
  'Middle Eastern',
  'Native American',
  'Pacific Islander',
  'White',
  'Mixed',
  'Other',
  'Prefer not to say',
] as const;

// Interest Categories
export const INTEREST_CATEGORIES = [
  'Fitness',
  'Fashion',
  'Art',
  'Music',
  'Travel',
  'Gaming',
  'Photography',
  'Dance',
  'Cooking',
  'Reading',
  'Movies',
  'Nature',
  'Sports',
  'Technology',
  'Other',
] as const;

// Dashboard Metrics Periods
export const METRICS_PERIODS = {
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
  ALL_TIME: 'all_time',
} as const;

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
} as const;

// SEO Meta Tags
export const SEO_DEFAULTS = {
  title: `${APP_NAME} - ${APP_TAGLINE}`,
  description: APP_DESCRIPTION,
  keywords: [
    'premium content',
    'exclusive models',
    'adult entertainment',
    'glamour',
    'luxury',
  ],
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image',
} as const;

// Legal Page Slugs
export const LEGAL_PAGES = {
  TERMS: 'terms-of-service',
  PRIVACY: 'privacy-policy',
  COOKIE: 'cookie-policy',
  DMCA: 'dmca',
  COMPLIANCE_2257: '2257-compliance',
  ACCEPTABLE_USE: 'acceptable-use-policy',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  NEW_SUBSCRIBER: 'new_subscriber',
  TIP_RECEIVED: 'tip_received',
  NEW_MESSAGE: 'new_message',
  MEDIA_UNLOCKED: 'media_unlocked',
  SUBSCRIPTION_EXPIRING: 'subscription_expiring',
  SUBSCRIPTION_EXPIRED: 'subscription_expired',
  CONTENT_APPROVED: 'content_approved',
  CONTENT_REJECTED: 'content_rejected',
  VERIFICATION_APPROVED: 'verification_approved',
  VERIFICATION_REJECTED: 'verification_rejected',
  PAYOUT_PROCESSED: 'payout_processed',
} as const;

// Theme Colors (for reference)
export const THEME_COLORS = {
  GOLD: '#D4AF37',
  GOLD_LIGHT: '#F5D76E',
  GOLD_DARK: '#8B6914',
  BLACK: '#0A0A0A',
  DARK_GRAY: '#1A1A1A',
  MEDIUM_GRAY: '#2A2A2A',
  WHITE_SMOKE: '#F5F5F5',
  ACCENT_RED: '#8B0000',
} as const;
