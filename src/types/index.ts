/**
 * Bellas Glamour - TypeScript Type Definitions
 * ============================================
 * Comprehensive type definitions for the platform
 */

import { 
  USER_ROLES, 
  PROFILE_STATUS, 
  VERIFICATION_STATUS,
  MEDIA_TYPES,
  MODERATION_STATUS,
  SUBSCRIPTION_STATUS,
  TRANSACTION_TYPES,
  TRANSACTION_STATUS,
} from '@/lib/constants';

// ============================================================================
// User Types
// ============================================================================

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type ProfileStatus = typeof PROFILE_STATUS[keyof typeof PROFILE_STATUS];
export type VerificationStatus = typeof VERIFICATION_STATUS[keyof typeof VERIFICATION_STATUS];
export type MediaType = typeof MEDIA_TYPES[keyof typeof MEDIA_TYPES];
export type ModerationStatus = typeof MODERATION_STATUS[keyof typeof MODERATION_STATUS];
export type SubscriptionStatus = typeof SUBSCRIPTION_STATUS[keyof typeof SUBSCRIPTION_STATUS];
export type TransactionType = typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES];
export type TransactionStatus = typeof TRANSACTION_STATUS[keyof typeof TRANSACTION_STATUS];

export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
  emailVerified: boolean;
  ageVerified: boolean;
  ageVerificationMethod?: string | null;
  ageVerificationDate?: Date | null;
  countryCode?: string | null;
  isBanned: boolean;
  banReason?: string | null;
  bannedAt?: Date | null;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date | null;
}

export interface UserWithProfile extends User {
  profile?: Profile | null;
}

// ============================================================================
// Profile Types
// ============================================================================

export interface SocialLinks {
  twitter?: string;
  instagram?: string;
  tiktok?: string;
  onlyfans?: string;
  snapchat?: string;
  website?: string;
}

export interface Profile {
  id: string;
  userId: string;
  stageName: string;
  slug: string;
  displayName?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  height?: string | null;
  weight?: string | null;
  eyeColor?: string | null;
  hairColor?: string | null;
  measurements?: string | null;
  ethnicity?: string | null;
  interests?: string[] | null;
  languages?: string[] | null;
  location?: string | null;
  birthdate?: Date | null;
  socialLinks?: SocialLinks | null;
  status: ProfileStatus;
  statusReason?: string | null;
  verificationStatus: VerificationStatus;
  idDocumentType?: string | null;
  modelReleaseSigned: boolean;
  subscriptionPrice: number;
  subscriptionDiscount?: number | null;
  hasFreeTrial: boolean;
  trialDays: number;
  earningsTotal: number;
  earningsPending: number;
  earningsWithdrawn: number;
  subscribersCount: number;
  viewsCount: number;
  likesCount: number;
  isFeatured: boolean;
  featuredUntil?: Date | null;
  featuredOrder?: number | null;
  approvedAt?: Date | null;
  approvedBy?: string | null;
  rejectedAt?: Date | null;
  rejectedBy?: string | null;
  rejectionReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileWithUser extends Profile {
  user: User;
}

export interface ProfileWithMedia extends Profile {
  media: Media[];
}

export interface ProfileWithStats extends Profile {
  mediaCount: number;
  photosCount: number;
  videosCount: number;
  recentEarnings: number;
}

// ============================================================================
// Media Types
// ============================================================================

export interface Media {
  id: string;
  profileId: string;
  type: MediaType;
  title?: string | null;
  description?: string | null;
  tags?: string[] | null;
  originalUrl: string;
  url: string;
  thumbnailUrl?: string | null;
  watermarkedUrl?: string | null;
  previewUrl?: string | null;
  fileSize?: number | null;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  format?: string | null;
  isPremium: boolean;
  isPpv: boolean;
  price?: number | null;
  isPinned: boolean;
  isArchived: boolean;
  moderationStatus: ModerationStatus;
  moderationNotes?: string | null;
  moderationFlags?: string[] | null;
  moderatedBy?: string | null;
  moderatedAt?: Date | null;
  exifRemoved: boolean;
  contentWarnings?: string[] | null;
  aiScanned: boolean;
  aiScanResult?: string | null;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  unlockCount: number;
  scheduledAt?: Date | null;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaWithProfile extends Media {
  profile: Profile;
}

export interface MediaUpload {
  file: File;
  type: MediaType;
  title?: string;
  description?: string;
  tags?: string[];
  isPremium: boolean;
  isPpv: boolean;
  price?: number;
  contentWarnings?: string[];
}

// ============================================================================
// Subscription Types
// ============================================================================

export interface Subscription {
  id: string;
  subscriberId: string;
  profileId: string;
  stripeSubscriptionId?: string | null;
  stripeCustomerId?: string | null;
  status: SubscriptionStatus;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date | null;
  cancellationReason?: string | null;
  currentPeriodStart?: Date | null;
  currentPeriodEnd?: Date | null;
  amount: number;
  currency: string;
  isTrial: boolean;
  trialEndsAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionWithDetails extends Subscription {
  subscriber: User;
  profile: Profile;
}

// ============================================================================
// Transaction Types
// ============================================================================

export interface Transaction {
  id: string;
  userId: string;
  profileId?: string | null;
  amount: number;
  currency: string;
  type: TransactionType;
  status: TransactionStatus;
  stripePaymentIntentId?: string | null;
  stripeChargeId?: string | null;
  stripeTransferId?: string | null;
  platformFee?: number | null;
  creatorAmount?: number | null;
  referenceType?: string | null;
  referenceId?: string | null;
  description?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date | null;
}

// ============================================================================
// Tip Types
// ============================================================================

export interface Tip {
  id: string;
  senderId: string;
  profileId: string;
  amount: number;
  currency: string;
  message?: string | null;
  isPrivate: boolean;
  status: string;
  stripePaymentIntentId?: string | null;
  createdAt: Date;
}

// ============================================================================
// Engagement Types
// ============================================================================

export interface MediaLike {
  id: string;
  userId: string;
  mediaId: string;
  createdAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  mediaId: string;
  content: string;
  isPinned: boolean;
  isHidden: boolean;
  hiddenReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaUnlock {
  id: string;
  userId: string;
  mediaId: string;
  amount: number;
  currency: string;
  stripePaymentIntentId?: string | null;
  createdAt: Date;
}

// ============================================================================
// Message Types
// ============================================================================

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content?: string | null;
  mediaUrl?: string | null;
  isRead: boolean;
  readAt?: Date | null;
  tipId?: string | null;
  createdAt: Date;
}

export interface MessageWithSender extends Message {
  sender: User;
}

// ============================================================================
// Notification Types
// ============================================================================

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  content?: string | null;
  referenceType?: string | null;
  referenceId?: string | null;
  isRead: boolean;
  readAt?: Date | null;
  createdAt: Date;
}

// ============================================================================
// Audit Types
// ============================================================================

export interface AuditLog {
  id: string;
  userId?: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  details?: Record<string, unknown> | null;
  createdAt: Date;
}

export interface AgeVerificationLog {
  id: string;
  profileId: string;
  verificationMethod: string;
  documentType?: string | null;
  documentNumber?: string | null;
  documentCountry?: string | null;
  documentExpiration?: Date | null;
  status: string;
  documentStoragePath?: string | null;
  verificationDate?: Date | null;
  expirationDate?: Date | null;
  verifiedBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// DMCA Types
// ============================================================================

export interface DMCATakedown {
  id: string;
  complainantName: string;
  complainantEmail: string;
  complainantAddress?: string | null;
  contentUrl: string;
  mediaId?: string | null;
  originalWorkUrl?: string | null;
  description: string;
  status: string;
  reviewedBy?: string | null;
  reviewedAt?: Date | null;
  resolution?: string | null;
  removedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Dashboard & Analytics Types
// ============================================================================

export interface DashboardStats {
  totalSubscribers: number;
  activeSubscribers: number;
  newSubscribersToday: number;
  newSubscribersThisWeek: number;
  newSubscribersThisMonth: number;
  totalEarnings: number;
  earningsToday: number;
  earningsThisWeek: number;
  earningsThisMonth: number;
  pendingPayout: number;
  totalViews: number;
  viewsToday: number;
  totalLikes: number;
  likesToday: number;
  mediaCount: number;
  photosCount: number;
  videosCount: number;
}

export interface EarningsData {
  date: string;
  amount: number;
  subscriptions: number;
  tips: number;
  ppv: number;
}

export interface SubscriberGrowth {
  date: string;
  total: number;
  new: number;
  churned: number;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

// ============================================================================
// Filter Types
// ============================================================================

export interface ModelFilters {
  search?: string;
  eyeColor?: string;
  hairColor?: string;
  ethnicity?: string;
  minPrice?: number;
  maxPrice?: number;
  hasFreeTrial?: boolean;
  isFeatured?: boolean;
  sortBy?: 'newest' | 'popular' | 'price_low' | 'price_high' | 'name';
}

export interface MediaFilters {
  type?: MediaType;
  isPremium?: boolean;
  isPpv?: boolean;
  moderationStatus?: ModerationStatus;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: 'newest' | 'oldest' | 'popular' | 'likes';
}

// ============================================================================
// Form Types
// ============================================================================

export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
  role: UserRole;
  acceptTerms: boolean;
  ageConfirmation: boolean;
}

export interface ProfileForm {
  stageName: string;
  displayName?: string;
  bio?: string;
  height?: string;
  weight?: string;
  eyeColor?: string;
  hairColor?: string;
  measurements?: string;
  ethnicity?: string;
  interests?: string[];
  languages?: string[];
  location?: string;
  socialLinks?: SocialLinks;
  subscriptionPrice: number;
  hasFreeTrial: boolean;
  trialDays: number;
}

export interface AgeVerificationForm {
  birthDate: Date;
  confirmation: boolean;
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface ModelCardProps {
  profile: Profile;
  showSubscribeButton?: boolean;
  variant?: 'default' | 'compact' | 'featured';
}

export interface MediaCardProps {
  media: Media;
  showOwner?: boolean;
  isPreview?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
}
