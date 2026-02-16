'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Users, Shield, Star, Crown } from 'lucide-react';

// Components
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AgeVerificationProvider } from '@/components/providers/age-verification-provider';
import { AgeGateModal } from '@/components/age-gate-modal';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ModelCard, ModelCardFeatured } from '@/components/model-card';
import { ModelFilters } from '@/components/model-filters';
import { AuthModal } from '@/components/auth-modal';
import { ModelProfileModal } from '@/components/model-profile-modal';
import { ModelDashboard } from '@/components/model-dashboard';
import { AdminPanel } from '@/components/admin-panel';

// Data & Constants
import { APP_NAME, APP_TAGLINE } from '@/lib/constants';
import t from '@/lib/i18n';
import { getPlaceholderImage } from '@/lib/utils';
import { ModelFilters as ModelFiltersType } from '@/types';

// Mock Data for Models
const mockModels = [
  {
    id: '1',
    stageName: 'Isabella Rose',
    slug: 'isabella-rose',
    avatarUrl: getPlaceholderImage(400, 600, 'isabella'),
    location: 'Los Angeles, CA',
    subscriptionPrice: 12.99,
    subscribersCount: 12500,
    viewsCount: 245000,
    likesCount: 89000,
    isFeatured: true,
    bio: 'Professional model and content creator. Love connecting with my fans!',
    height: "5'8\"",
    eyeColor: 'Blue',
    hairColor: 'Blonde',
    ethnicity: 'White',
  },
  {
    id: '2',
    stageName: 'Sofia Martinez',
    slug: 'sofia-martinez',
    avatarUrl: getPlaceholderImage(400, 600, 'sofia'),
    location: 'Miami, FL',
    subscriptionPrice: 14.99,
    subscribersCount: 8900,
    viewsCount: 178000,
    likesCount: 67000,
    isFeatured: true,
    bio: 'Latina beauty with a passion for fitness and lifestyle content.',
    height: "5'6\"",
    eyeColor: 'Brown',
    hairColor: 'Brown',
    ethnicity: 'Hispanic',
  },
  {
    id: '3',
    stageName: 'Emma St Clair',
    slug: 'emma-st-clair',
    avatarUrl: getPlaceholderImage(400, 600, 'emma'),
    location: 'New York, NY',
    subscriptionPrice: 19.99,
    subscribersCount: 15200,
    viewsCount: 312000,
    likesCount: 125000,
    isFeatured: true,
    bio: 'High-fashion model bringing elegance to exclusive content.',
    height: "5'10\"",
    eyeColor: 'Green',
    hairColor: 'Red',
    ethnicity: 'White',
  },
  {
    id: '4',
    stageName: 'Mia Thompson',
    slug: 'mia-thompson',
    avatarUrl: getPlaceholderImage(400, 600, 'mia'),
    location: 'Austin, TX',
    subscriptionPrice: 9.99,
    subscribersCount: 6700,
    viewsCount: 134000,
    likesCount: 45000,
    isFeatured: false,
    bio: 'Southern charm meets modern elegance.',
    height: "5'5\"",
    eyeColor: 'Hazel',
    hairColor: 'Brown',
    ethnicity: 'Mixed',
  },
  {
    id: '5',
    stageName: 'Aria Chen',
    slug: 'aria-chen',
    avatarUrl: getPlaceholderImage(400, 600, 'aria'),
    location: 'San Francisco, CA',
    subscriptionPrice: 15.99,
    subscribersCount: 9800,
    viewsCount: 196000,
    likesCount: 78000,
    isFeatured: false,
    bio: 'Asian beauty sharing lifestyle and exclusive content.',
    height: "5'4\"",
    eyeColor: 'Brown',
    hairColor: 'Black',
    ethnicity: 'Asian',
  },
  {
    id: '6',
    stageName: 'Valentina Noir',
    slug: 'valentina-noir',
    avatarUrl: getPlaceholderImage(400, 600, 'valentina'),
    location: 'Las Vegas, NV',
    subscriptionPrice: 24.99,
    subscribersCount: 21000,
    viewsCount: 456000,
    likesCount: 189000,
    isFeatured: true,
    bio: 'The name says it all. Exclusive, elegant, extraordinary.',
    height: "5'7\"",
    eyeColor: 'Gray',
    hairColor: 'Black',
    ethnicity: 'Mixed',
  },
  {
    id: '7',
    stageName: 'Lily Anderson',
    slug: 'lily-anderson',
    avatarUrl: getPlaceholderImage(400, 600, 'lily'),
    location: 'Seattle, WA',
    subscriptionPrice: 11.99,
    subscribersCount: 5400,
    viewsCount: 98000,
    likesCount: 32000,
    isFeatured: false,
    bio: 'Pacific Northwest natural beauty.',
    height: "5'6\"",
    eyeColor: 'Blue',
    hairColor: 'Blonde',
    ethnicity: 'White',
  },
  {
    id: '8',
    stageName: 'Zara Williams',
    slug: 'zara-williams',
    avatarUrl: getPlaceholderImage(400, 600, 'zara'),
    location: 'Atlanta, GA',
    subscriptionPrice: 13.99,
    subscribersCount: 7800,
    viewsCount: 156000,
    likesCount: 56000,
    isFeatured: false,
    bio: 'Southern belle with a modern twist.',
    height: "5'5\"",
    eyeColor: 'Brown',
    hairColor: 'Black',
    ethnicity: 'Black',
  },
];

function BellasGlamourContent() {
  // State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<typeof mockModels[0] | null>(null);
  const [filters, setFilters] = useState<ModelFiltersType>({});
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [modelDashboardOpen, setModelDashboardOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

  // Handlers
  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleModelClick = (model: typeof mockModels[0]) => {
    setSelectedModel(model);
    setProfileModalOpen(true);
  };

  // Filtered models
  const filteredModels = useMemo(() => {
    let result = [...mockModels];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(m => 
        m.stageName.toLowerCase().includes(search) ||
        m.location?.toLowerCase().includes(search)
      );
    }

    if (filters.eyeColor) {
      result = result.filter(m => m.eyeColor === filters.eyeColor);
    }

    if (filters.hairColor) {
      result = result.filter(m => m.hairColor === filters.hairColor);
    }

    if (filters.ethnicity) {
      result = result.filter(m => m.ethnicity === filters.ethnicity);
    }

    if (filters.minPrice !== undefined) {
      result = result.filter(m => m.subscriptionPrice >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      result = result.filter(m => m.subscriptionPrice <= filters.maxPrice!);
    }

    if (filters.hasFreeTrial) {
      // Mock: assume some have free trials
      result = result.filter(m => m.subscriptionPrice < 15);
    }

    // Sort
    switch (filters.sortBy) {
      case 'popular':
        result.sort((a, b) => b.subscribersCount - a.subscribersCount);
        break;
      case 'price_low':
        result.sort((a, b) => a.subscriptionPrice - b.subscriptionPrice);
        break;
      case 'price_high':
        result.sort((a, b) => b.subscriptionPrice - a.subscriptionPrice);
        break;
      case 'name':
        result.sort((a, b) => a.stageName.localeCompare(b.stageName));
        break;
      default:
        // newest - keep original order
        break;
    }

    return result;
  }, [filters]);

  const featuredModels = mockModels.filter(m => m.isFeatured);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5]">
      {/* Age Gate */}
      <AgeGateModal />

      {/* Navigation */}
      <Navbar 
        onAuthClick={handleAuthClick}
        onModelDashboardClick={() => setModelDashboardOpen(true)}
        onAdminPanelClick={() => setAdminPanelOpen(true)}
      />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] animate-gradient" />
          <div className="absolute inset-0 hero-pattern opacity-30" />
          
          {/* Decorative Gold Elements */}
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: 'linear' 
            }}
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-[#D4AF37]/5 to-transparent rounded-full"
          />
          <motion.div
            animate={{ 
              rotate: -360,
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity, 
              ease: 'linear' 
            }}
            className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-radial from-[#D4AF37]/3 to-transparent rounded-full"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Premium Badge */}
              <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A1A1A] border border-[#D4AF37]/30 mb-6"
            >
              <Crown className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm text-[#D4AF37]">{t('page.premium_badge')}</span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-responsive-hero font-serif font-bold mb-4">
              <span className="text-gradient-gold">{APP_NAME}</span>
            </h1>
            
            <p className="text-responsive-xl text-[#A0A0A0] mb-8 max-w-2xl mx-auto">
              {APP_TAGLINE}. {t('page.featured_desc')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAuthClick('register')}
                className="btn-premium btn-shine px-8 py-4 text-lg flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                {t('page.hero_cta_start')}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.a
                href="#models"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 text-lg border border-[#D4AF37]/50 rounded-lg text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
              >
                {t('page.hero_cta_browse')}
              </motion.a>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-8 mt-12"
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-[#F5F5F5]">{t('page.stat_active_subscribers')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-[#F5F5F5]">{t('page.stat_verified_models')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-[#F5F5F5]">{t('page.stat_secure')}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-[#D4AF37]/50 rounded-full flex items-start justify-center p-1"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-3 bg-[#D4AF37] rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Models Section */}
      <section id="featured" className="py-20 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-4">
              <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm text-[#D4AF37]">{t('page.trending_this_week')}</span>
            </div>
            <h2 className="text-responsive-2xl font-serif text-[#F5F5F5] mb-4">
              {t('page.featured_models')}
            </h2>
            <p className="text-[#A0A0A0] max-w-2xl mx-auto">
              {t('page.featured_desc')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredModels.slice(0, 3).map((model, index) => (
              <ModelCardFeatured
                key={model.id}
                profile={model}
                index={index}
                onClick={() => handleModelClick(model)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* All Models Section */}
      <section id="models" className="py-20 bg-gradient-to-b from-[#0A0A0A] to-[#0F0F0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-responsive-2xl font-serif text-[#F5F5F5] mb-4">
              {t('page.explore_all_models')}
            </h2>
            <p className="text-[#A0A0A0] max-w-2xl mx-auto">
              {t('page.all_models_desc')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-[#1A1A1A] rounded-xl border border-[#333333] p-4">
                <h3 className="text-lg font-medium text-[#F5F5F5] mb-4">{t('page.filters')}</h3>
                <ModelFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  isOpen={filtersOpen}
                  onToggle={() => setFiltersOpen(!filtersOpen)}
                />
              </div>
            </div>

            {/* Models Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <p className="text-[#A0A0A0]">
                  {t('page.showing_models', { count: filteredModels.length })}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filteredModels.map((model, index) => (
                  <ModelCard
                    key={model.id}
                    profile={model}
                    index={index}
                    onClick={() => handleModelClick(model)}
                  />
                ))}
              </div>

              {filteredModels.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-[#A0A0A0]">{t('page.no_models')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1A1A1A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Crown className="w-12 h-12 text-[#D4AF37] mx-auto mb-6" />
            <h2 className="text-responsive-2xl font-serif text-[#F5F5F5] mb-4">
              {t('page.cta_ready_join')}
            </h2>
            <p className="text-[#A0A0A0] mb-8 max-w-2xl mx-auto">
              {t('page.cta_create_account_desc')}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAuthClick('register')}
              className="btn-premium btn-shine px-10 py-4 text-lg"
            >
              {t('page.cta_create_account')}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
      <ModelProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        model={selectedModel}
      />
      <ModelDashboard
        isOpen={modelDashboardOpen}
        onClose={() => setModelDashboardOpen(false)}
      />
      <AdminPanel
        isOpen={adminPanelOpen}
        onClose={() => setAdminPanelOpen(false)}
      />
    </div>
  );
}

export default function Page() {
  return (
    <ThemeProvider>
      <AgeVerificationProvider>
        <BellasGlamourContent />
      </AgeVerificationProvider>
    </ThemeProvider>
  );
}
