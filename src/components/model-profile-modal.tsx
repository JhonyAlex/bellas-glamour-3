'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, MapPin, Star, Eye, Heart, MessageCircle, Crown, 
  Lock, Play, ChevronLeft, ChevronRight, Share2, MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { APP_NAME } from '@/lib/constants';
import { formatCurrency, getPlaceholderImage } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { t } from '@/lib/i18n';

interface ModelProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: {
    id: string;
    stageName: string;
    slug: string;
    bio?: string | null;
    avatarUrl?: string | null;
    coverUrl?: string | null;
    location?: string | null;
    height?: string | null;
    eyeColor?: string | null;
    hairColor?: string | null;
    measurements?: string | null;
    ethnicity?: string | null;
    subscriptionPrice?: number;
    subscribersCount?: number;
    viewsCount?: number;
    likesCount?: number;
    isFeatured?: boolean;
  } | null;
}

// Mock media data
const mockMedia = Array.from({ length: 12 }, (_, i) => ({
  id: `media-${i}`,
  type: i % 3 === 0 ? 'video' : 'photo',
  thumbnailUrl: getPlaceholderImage(300, 400, `model-${i}`),
  isPremium: i > 3,
  isPpv: i > 8,
  price: i > 8 ? 4.99 : undefined,
}));

export function ModelProfileModal({ isOpen, onClose, model }: ModelProfileModalProps) {
  const [selectedMedia, setSelectedMedia] = useState<number | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  if (!model) return null;

  const coverImage = model.coverUrl || getPlaceholderImage(1200, 400, `cover-${model.slug}`);
  const avatarImage = model.avatarUrl || getPlaceholderImage(200, 200, model.slug);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] overflow-y-auto bg-[#0A0A0A]/95 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="min-h-screen"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="fixed top-4 right-4 z-50 p-2 bg-[#1A1A1A]/80 backdrop-blur-sm rounded-full text-[#F5F5F5] hover:bg-[#2A2A2A] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Cover Image */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={coverImage}
                alt={model.stageName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
            </div>

            {/* Profile Header */}
            <div className="relative px-4 md:px-8 -mt-20">
              <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#0A0A0A]">
                      <img
                        src={avatarImage}
                        alt={model.stageName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {model.isFeatured && (
                      <div className="absolute -top-2 -right-2 p-1.5 bg-[#D4AF37] rounded-full">
                        <Star className="w-4 h-4 text-[#0A0A0A] fill-current" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 pb-4">
                    <h1 className="text-3xl md:text-4xl font-serif text-[#F5F5F5] mb-2">
                      {model.stageName}
                    </h1>
                    {model.location && (
                      <div className="flex items-center gap-1 text-[#A0A0A0] mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{model.location}</span>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-6 mb-4 text-sm">
                      <div className="flex items-center gap-1 text-[#A0A0A0]">
                        <Eye className="w-4 h-4" />
                        <span>{model.viewsCount?.toLocaleString() || '0'} {t('model.views')}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#A0A0A0]">
                        <Heart className="w-4 h-4" />
                        <span>{model.likesCount?.toLocaleString() || '0'} {t('model.likes')}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#A0A0A0]">
                        <Crown className="w-4 h-4 text-[#D4AF37]" />
                        <span>{model.subscribersCount?.toLocaleString() || '0'} {t('model.subscribers')}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      {!isSubscribed ? (
                        <Button
                          onClick={() => setIsSubscribed(true)}
                          className="btn-premium btn-shine"
                        >
                          <Crown className="w-4 h-4 mr-2" />
                          {t('model.subscribe', { price: formatCurrency(model.subscriptionPrice || 9.99) })}
                        </Button>
                      ) : (
                        <Button className="bg-green-600 hover:bg-green-700 text-white">
                          <Crown className="w-4 h-4 mr-2" />
                          {t('model.subscribed')}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="border-[#333333] text-[#F5F5F5] hover:border-[#D4AF37]"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {t('profile.message')}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-[#333333] text-[#A0A0A0] hover:text-[#F5F5F5] hover:border-[#D4AF37]"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {model.bio && (
                  <p className="mt-6 text-[#A0A0A0] leading-relaxed max-w-3xl">
                    {model.bio}
                  </p>
                )}

                {/* Attributes */}
                <div className="mt-6 flex flex-wrap gap-4">
                  {model.height && (
                    <div className="px-3 py-1.5 bg-[#1A1A1A] rounded-full text-sm">
                      <span className="text-[#666666]">{t('profile.height')}</span>{' '}
                      <span className="text-[#F5F5F5]">{model.height}</span>
                    </div>
                  )}
                  {model.eyeColor && (
                    <div className="px-3 py-1.5 bg-[#1A1A1A] rounded-full text-sm">
                      <span className="text-[#666666]">{t('profile.eyes')}</span>{' '}
                      <span className="text-[#F5F5F5]">{model.eyeColor}</span>
                    </div>
                  )}
                  {model.hairColor && (
                    <div className="px-3 py-1.5 bg-[#1A1A1A] rounded-full text-sm">
                      <span className="text-[#666666]">{t('profile.hair')}</span>{' '}
                      <span className="text-[#F5F5F5]">{model.hairColor}</span>
                    </div>
                  )}
                  {model.ethnicity && (
                    <div className="px-3 py-1.5 bg-[#1A1A1A] rounded-full text-sm">
                      <span className="text-[#666666]">{t('profile.ethnicity')}</span>{' '}
                      <span className="text-[#F5F5F5]">{model.ethnicity}</span>
                    </div>
                  )}
                </div>

                {/* Content Tabs */}
                <div className="mt-8">
                  <Tabs defaultValue="media" className="w-full">
                    <TabsList className="bg-[#1A1A1A] border-b border-[#333333] w-full justify-start rounded-none p-0 h-auto">
                      <TabsTrigger
                        value="media"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#D4AF37] data-[state=active]:bg-transparent px-4 py-3"
                      >
                        {t('profile.media_tab')}
                      </TabsTrigger>
                      <TabsTrigger
                        value="about"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#D4AF37] data-[state=active]:bg-transparent px-4 py-3"
                      >
                        {t('profile.about_tab')}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="media" className="mt-6">
                      {/* Free Content Section */}
                      <div className="mb-8">
                        <h3 className="text-lg font-medium text-[#F5F5F5] mb-4">
                            {t('profile.free_preview')}
                          </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {mockMedia.slice(0, 4).map((media, index) => (
                            <motion.div
                              key={media.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer group"
                              onClick={() => setSelectedMedia(index)}
                            >
                              <img
                                src={media.thumbnailUrl}
                                alt=""
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              />
                              {media.type === 'video' && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-12 h-12 rounded-full bg-[#0A0A0A]/70 flex items-center justify-center">
                                    <Play className="w-6 h-6 text-[#D4AF37]" fill="currentColor" />
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Premium Content Section */}
                      <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-[#F5F5F5] flex items-center gap-2">
                              <Lock className="w-4 h-4 text-[#D4AF37]" />
                              {t('profile.premium_content')}
                            </h3>
                          <span className="text-sm text-[#A0A0A0]">
                            {t('profile.exclusive_count', { count: mockMedia.length - 4 })}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {mockMedia.slice(4).map((media, index) => (
                            <motion.div
                              key={media.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer group"
                            >
                              <img
                                src={media.thumbnailUrl}
                                alt=""
                                className="w-full h-full object-cover blur-md transition-all group-hover:blur-sm"
                              />
                              
                              {/* Lock Overlay */}
                              <div className="absolute inset-0 bg-[#0A0A0A]/60 flex flex-col items-center justify-center">
                                <Lock className="w-8 h-8 text-[#D4AF37] mb-2" />
                                {media.isPpv && (
                                  <span className="text-xs text-[#D4AF37] font-medium">
                                    {formatCurrency(media.price || 0)}
                                  </span>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Subscribe CTA Overlay */}
                        {!isSubscribed && (
                          <div className="mt-6 p-6 bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] rounded-xl border border-[#333333]">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                              <div>
                                <h4 className="text-lg font-medium text-[#F5F5F5] mb-1">
                                  {t('profile.unlock_exclusive')}
                                </h4>
                                <p className="text-[#A0A0A0] text-sm">
                                  {t('profile.subscribe_to_access')}
                                </p>
                              </div>
                              <Button
                                onClick={() => setIsSubscribed(true)}
                                className="btn-premium btn-shine whitespace-nowrap"
                              >
                                {t('model.subscribe', { price: formatCurrency(model.subscriptionPrice || 9.99) })}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="about" className="mt-6">
                      <div className="prose prose-invert max-w-none">
                        <h3 className="text-lg font-medium text-[#F5F5F5] mb-4">{t('profile.about_me')}</h3>
                        <p className="text-[#A0A0A0]">
                          {model.bio || t('profile.no_bio')}
                        </p>

                        {model.measurements && (
                          <>
                            <h4 className="text-md font-medium text-[#F5F5F5] mt-6 mb-2">{t('profile.measurements')}</h4>
                            <p className="text-[#A0A0A0]">{model.measurements}</p>
                          </>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
