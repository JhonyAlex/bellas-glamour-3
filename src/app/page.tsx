'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Users, Shield, Star, Crown, Loader2 } from 'lucide-react';

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
import { useAppStore } from '@/lib/store';
import { logout } from '@/app/actions/auth';

// Map DB profile (snake_case) to component format (camelCase)
function mapProfile(p: any) {
  return {
    id: p.id,
    stageName: p.stage_name,
    slug: p.slug,
    avatarUrl: p.avatar_url || getPlaceholderImage(400, 600, p.stage_name),
    location: p.location,
    subscriptionPrice: p.subscription_price,
    subscribersCount: p.subscribers_count,
    viewsCount: p.views_count,
    likesCount: p.likes_count,
    isFeatured: p.is_featured,
    bio: p.bio,
    height: p.height,
    eyeColor: p.eye_color,
    hairColor: p.hair_color,
    ethnicity: p.ethnicity,
  };
}

function BellasGlamourContent() {
  // Auth state
  const { currentUser, setCurrentUser, setIsAuthLoading } = useAppStore();

  // UI State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [filters, setFilters] = useState<ModelFiltersType>({});
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [modelDashboardOpen, setModelDashboardOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

  // Data state
  const [models, setModels] = useState<any[]>([]);
  const [featuredModels, setFeaturedModels] = useState<any[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(true);

  // Load current user on mount
  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch('/api/auth/user', {
          method: 'GET',
          credentials: 'include',
        });
        const { user } = await response.json();
        setCurrentUser(user);
      } catch {
        setCurrentUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    }
    loadUser();
  }, [setCurrentUser, setIsAuthLoading]);

  // Load models on mount
  useEffect(() => {
    async function loadModels() {
      try {
        const [allResponse, featuredResponse] = await Promise.all([
          fetch('/api/models?pageSize=24'),
          fetch('/api/models?pageSize=6&featured=true'),
        ]);
        const allData = await allResponse.json();
        const featuredData = await featuredResponse.json();

        if (allData.success) {
          setModels(allData.data.map(mapProfile));
        }
        if (featuredData.success) {
          setFeaturedModels(featuredData.data.map(mapProfile));
        }
      } catch (error) {
        console.error('Failed to load models:', error);
      } finally {
        setIsLoadingModels(false);
      }
    }
    loadModels();
  }, []);

  // Reload models when filters change
  useEffect(() => {
    const hasFilters = filters.search || filters.eyeColor || filters.hairColor ||
      filters.ethnicity || filters.minPrice || filters.maxPrice ||
      filters.sortBy || filters.isFeatured;

    if (!hasFilters) return;

    const timeout = setTimeout(async () => {
      setIsLoadingModels(true);
      try {
        const queryParams = new URLSearchParams({
          pageSize: '24',
          ...(filters.search && { search: filters.search }),
          ...(filters.eyeColor && { eyeColor: filters.eyeColor }),
          ...(filters.hairColor && { hairColor: filters.hairColor }),
          ...(filters.ethnicity && { ethnicity: filters.ethnicity }),
          ...(filters.minPrice !== undefined && { minPrice: filters.minPrice.toString() }),
          ...(filters.maxPrice !== undefined && { maxPrice: filters.maxPrice.toString() }),
          ...(filters.sortBy && { sortBy: filters.sortBy }),
        });
        const response = await fetch(`/api/models?${queryParams}`);
        const result = await response.json();
        if (result.success) {
          setModels(result.data.map(mapProfile));
        }
      } catch (error) {
        console.error('Failed to filter models:', error);
      } finally {
        setIsLoadingModels(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [filters]);

  // Handlers
  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleModelClick = (model: any) => {
    setSelectedModel(model);
    setProfileModalOpen(true);
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5]">
      {/* Age Gate */}
      <AgeGateModal />

      {/* Navigation */}
      <Navbar
        onAuthClick={handleAuthClick}
        onModelDashboardClick={() => setModelDashboardOpen(true)}
        onAdminPanelClick={() => setAdminPanelOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1600&h=900&fit=crop"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A]/85 via-[#1A1A1A]/75 to-[#0A0A0A]/85" />
          <div className="absolute inset-0 hero-pattern opacity-30" />

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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A1A1A] border border-[#D4AF37]/30 mb-6"
            >
              <Crown className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm text-[#D4AF37]">{t('page.premium_badge')}</span>
            </motion.div>

            <h1 className="text-responsive-hero font-serif font-bold mb-4">
              <span className="text-gradient-gold">{APP_NAME}</span>
            </h1>

            <p className="text-responsive-xl text-[#A0A0A0] mb-8 max-w-2xl mx-auto">
              {APP_TAGLINE}. {t('page.featured_desc')}
            </p>

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
      {featuredModels.length > 0 && (
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
      )}

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
                  {t('page.showing_models', { count: models.length })}
                </p>
              </div>

              {isLoadingModels ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {models.map((model, index) => (
                    <ModelCard
                      key={model.id}
                      profile={model}
                      index={index}
                      onClick={() => handleModelClick(model)}
                    />
                  ))}
                </div>
              )}

              {!isLoadingModels && models.length === 0 && (
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
