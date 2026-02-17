'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogIn, Crown, Settings, Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_NAME, NAV_LINKS } from '@/lib/constants';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { AuthUser } from '@/lib/store';

const navLabelMap: Record<string, string> = {
  Home: t('nav.home'),
  Models: t('nav.models'),
  Featured: t('nav.featured'),
  Categories: t('nav.categories'),
};

interface NavbarProps {
  onAuthClick: (mode: 'login' | 'register') => void;
  onModelDashboardClick: () => void;
  onAdminPanelClick: () => void;
  currentUser: AuthUser | null;
  onLogout: () => void;
}

export function Navbar({ onAuthClick, onModelDashboardClick, onAdminPanelClick, currentUser, onLogout }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#333333]'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.a
            href="#"
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B6914] flex items-center justify-center">
              <Crown className="w-5 h-5 text-[#0A0A0A]" />
            </div>
            <span className="text-xl font-serif text-gradient-gold hidden sm:block">
              {APP_NAME}
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="nav-link text-[#F5F5F5] hover:text-[#D4AF37] transition-colors text-sm font-medium"
              >
                {navLabelMap[link.label] || link.label}
              </motion.a>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Creator dashboard - only for models */}
            {currentUser?.role === 'model' && (
              <Button
                variant="ghost"
                onClick={onModelDashboardClick}
                className="text-[#A0A0A0] hover:text-[#D4AF37] hover:bg-transparent text-sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                {t('navbar.creator')}
              </Button>
            )}

            {/* Admin panel - only for admins */}
            {currentUser?.role === 'admin' && (
              <Button
                variant="ghost"
                onClick={onAdminPanelClick}
                className="text-[#A0A0A0] hover:text-[#8B0000] hover:bg-transparent text-sm"
              >
                <Shield className="w-4 h-4 mr-2" />
                {t('navbar.admin')}
              </Button>
            )}

            {/* Auth state */}
            {currentUser ? (
              <>
                <span className="text-sm text-[#A0A0A0]">
                  {currentUser.name || currentUser.email}
                </span>
                <Button
                  variant="ghost"
                  onClick={onLogout}
                  className="text-[#F5F5F5] hover:text-[#D4AF37] hover:bg-transparent"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('navbar.sign_out')}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => onAuthClick('login')}
                  className="text-[#F5F5F5] hover:text-[#D4AF37] hover:bg-transparent"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {t('navbar.sign_in')}
                </Button>
                <Button
                  onClick={() => onAuthClick('register')}
                  className="btn-premium btn-shine"
                >
                  <User className="w-4 h-4 mr-2" />
                  {t('navbar.join_now')}
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#F5F5F5] hover:text-[#D4AF37]"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="md:hidden bg-[#0A0A0A]/98 backdrop-blur-md border-b border-[#333333]"
          >
            <div className="px-4 py-6 space-y-4">
                  {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-[#F5F5F5] hover:text-[#D4AF37] transition-colors"
                >
                  {navLabelMap[link.label] || link.label}
                </a>
              ))}

              <div className="pt-4 border-t border-[#333333] space-y-3">
                {/* Role-specific buttons */}
                {currentUser?.role === 'model' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      onModelDashboardClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {t('navbar.creator')}
                  </Button>
                )}
                {currentUser?.role === 'admin' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      onAdminPanelClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full border-[#8B0000] text-[#8B0000] hover:bg-[#8B0000]/10"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    {t('navbar.admin')}
                  </Button>
                )}

                {currentUser ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full border-[#333333] text-[#F5F5F5] hover:border-[#D4AF37]"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('navbar.sign_out')}
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        onAuthClick('login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full border-[#333333] text-[#F5F5F5] hover:border-[#D4AF37]"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      {t('navbar.sign_in')}
                    </Button>
                    <Button
                      onClick={() => {
                        onAuthClick('register');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full btn-premium btn-shine"
                    >
                      <User className="w-4 h-4 mr-2" />
                      {t('navbar.join_now')}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
