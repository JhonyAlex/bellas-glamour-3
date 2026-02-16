'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Eye, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { t } from '@/lib/i18n';
import { Profile } from '@/types';
import { formatCurrency, getPlaceholderImage } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ModelCardProps {
  profile: Partial<Profile> & {
    id: string;
    stageName: string;
    slug: string;
    avatarUrl?: string | null;
    location?: string | null;
    subscriptionPrice?: number;
    subscribersCount?: number;
    viewsCount?: number;
    likesCount?: number;
    isFeatured?: boolean;
  };
  index?: number;
  onClick?: () => void;
}

export function ModelCard({ profile, index = 0, onClick }: ModelCardProps) {
  const imageUrl = profile.avatarUrl || getPlaceholderImage(400, 600, profile.slug);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group relative"
      onClick={onClick}
    >
      <div className="model-card cursor-pointer">
        {/* Featured Badge */}
        {profile.isFeatured && (
          <div className="absolute top-3 left-3 z-10">
              <div className="px-2 py-1 bg-[#D4AF37] text-[#0A0A0A] text-xs font-medium rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" />
              {t('model.featured')}
            </div>
          </div>
        )}

        {/* Image */}
        <img
          src={imageUrl}
          alt={profile.stageName}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent z-10"
        />

        {/* Content */}
        <div className="model-card-content">
          {/* Stage Name */}
          <h3 className="text-lg font-semibold text-[#F5F5F5] mb-1 group-hover:text-[#D4AF37] transition-colors">
            {profile.stageName}
          </h3>

          {/* Location */}
          {profile.location && (
            <div className="flex items-center gap-1 text-xs text-[#A0A0A0] mb-2">
              <MapPin className="w-3 h-3" />
              <span>{profile.location}</span>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 mb-3 text-xs text-[#A0A0A0]">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{profile.viewsCount?.toLocaleString() || '0'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>{profile.likesCount?.toLocaleString() || '0'}</span>
            </div>
          </div>

          {/* Subscribe Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Button
              className="w-full btn-premium btn-shine h-9 text-sm"
              onClick={(e) => {
                e.stopPropagation();
                // Handle subscription
              }}
            >
              {t('model.subscribe', { price: formatCurrency(profile.subscriptionPrice || 9.99) })}
            </Button>
          </motion.div>
        </div>

        {/* Border Glow Effect on Hover */}
        <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-[#D4AF37]/30 transition-colors pointer-events-none" />
      </div>
    </motion.div>
  );
}

// Compact variant for lists
export function ModelCardCompact({ profile, index = 0, onClick }: ModelCardProps) {
  const imageUrl = profile.avatarUrl || getPlaceholderImage(100, 100, profile.slug);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="flex items-center gap-4 p-3 rounded-lg bg-[#1A1A1A] hover:bg-[#2A2A2A] cursor-pointer transition-colors group"
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
        <img
          src={imageUrl}
          alt={profile.stageName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-[#F5F5F5] font-medium truncate group-hover:text-[#D4AF37] transition-colors">
          {profile.stageName}
        </h4>
        <p className="text-xs text-[#A0A0A0]">
          {profile.subscribersCount || 0} subscribers
        </p>
      </div>

      {/* Price */}
      <div className="text-[#D4AF37] font-medium text-sm">
        {formatCurrency(profile.subscriptionPrice || 9.99)}
      </div>
    </motion.div>
  );
}

// Featured variant for hero section
export function ModelCardFeatured({ profile, index = 0, onClick }: ModelCardProps) {
  const imageUrl = profile.avatarUrl || getPlaceholderImage(600, 800, profile.slug);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      {/* Featured Badge */}
      <div className="absolute top-4 left-4 z-20">
        <div className="px-3 py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-[#0A0A0A] text-sm font-semibold rounded-full flex items-center gap-1.5 shadow-gold">
          <Star className="w-4 h-4 fill-current" />
          {t('model.featured_model')}
        </div>
      </div>

      {/* Image */}
      <img
        src={imageUrl}
        alt={profile.stageName}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <h3 className="text-2xl font-serif text-[#F5F5F5] mb-2 group-hover:text-[#D4AF37] transition-colors">
          {profile.stageName}
        </h3>
        
        {profile.location && (
          <div className="flex items-center gap-1 text-sm text-[#A0A0A0] mb-3">
            <MapPin className="w-4 h-4" />
            <span>{profile.location}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-[#D4AF37] font-semibold">
              {formatCurrency(profile.subscriptionPrice || 9.99)}/month
            </div>
            <Button
              className="btn-premium btn-shine"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {t('model.subscribe', { price: formatCurrency(profile.subscriptionPrice || 9.99) })}
            </Button>
        </div>
      </div>

      {/* Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-[#D4AF37]/20 group-hover:border-[#D4AF37]/50 transition-colors pointer-events-none" />
    </motion.div>
  );
}
