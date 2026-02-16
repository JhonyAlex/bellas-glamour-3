'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, Crown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { APP_NAME, MINIMUM_AGE } from '@/lib/constants';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type AuthMode = 'login' | 'register';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    acceptTerms: false,
    ageConfirmation: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (mode === 'register' && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (mode === 'register') {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = 'You must accept the terms';
      }
      if (!formData.ageConfirmation) {
        newErrors.ageConfirmation = `You must be ${MINIMUM_AGE} or older`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    // In production, handle actual auth
  };

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0A0A0A]/90 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden">
              {/* Header */}
              <div className="relative p-6 pb-0">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-[#A0A0A0] hover:text-[#F5F5F5] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B6914] flex items-center justify-center">
                    <Crown className="w-6 h-6 text-[#0A0A0A]" />
                  </div>
                  <h2 className="text-2xl font-serif text-[#F5F5F5]">
                    {mode === 'login' ? t('auth.welcome_back') : t('auth.join', { app: APP_NAME })}
                  </h2>
                  <p className="text-[#A0A0A0] text-sm mt-1">
                    {mode === 'login' 
                      ? t('auth.sign_in_info') 
                      : t('auth.register_info')}
                  </p>
                </div>

                {/* Mode Toggle */}
                <div className="flex bg-[#0A0A0A] rounded-lg p-1 mb-6">
                  <button
                    onClick={() => setMode('login')}
                    className={cn(
                      'flex-1 py-2 rounded-md text-sm font-medium transition-colors',
                      mode === 'login' 
                        ? 'bg-[#D4AF37] text-[#0A0A0A]' 
                        : 'text-[#A0A0A0] hover:text-[#F5F5F5]'
                    )}
                  >
                    {t('auth.sign_in_btn')}
                  </button>
                  <button
                    onClick={() => setMode('register')}
                    className={cn(
                      'flex-1 py-2 rounded-md text-sm font-medium transition-colors',
                      mode === 'register' 
                          ? 'bg-[#D4AF37] text-[#0A0A0A]' 
                          : 'text-[#A0A0A0] hover:text-[#F5F5F5]'
                    )}
                  >
                      {t('auth.register_btn')}
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
                {mode === 'register' && (
                  <div className="space-y-1">
                    <Label htmlFor="name" className="text-[#A0A0A0]">{t('auth.name')}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={e => updateFormData('name', e.target.value)}
                        className="pl-10 bg-[#0A0A0A] border-[#333333] text-[#F5F5F5] focus:border-[#D4AF37]"
                        placeholder={t('auth.your_name')}
                      />
                    </div>
                    {errors.name && <p className="text-xs text-[#8B0000]">{errors.name}</p>}
                  </div>
                )}

                <div className="space-y-1">
                  <Label htmlFor="email" className="text-[#A0A0A0]">{t('auth.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={e => updateFormData('email', e.target.value)}
                      className="pl-10 bg-[#0A0A0A] border-[#333333] text-[#F5F5F5] focus:border-[#D4AF37]"
                      placeholder={t('auth.placeholder_email')}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-[#8B0000]">{errors.email}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password" className="text-[#A0A0A0]">{t('auth.password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={e => updateFormData('password', e.target.value)}
                      className="pl-10 pr-10 bg-[#0A0A0A] border-[#333333] text-[#F5F5F5] focus:border-[#D4AF37]"
                      placeholder={t('auth.password_placeholder')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#F5F5F5]"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-[#8B0000]">{errors.password}</p>}
                </div>

                {mode === 'register' && (
                  <>
                    <div className="space-y-1">
                      <Label htmlFor="confirmPassword" className="text-[#A0A0A0]">{t('auth.confirm_password')}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={e => updateFormData('confirmPassword', e.target.value)}
                          className="pl-10 bg-[#0A0A0A] border-[#333333] text-[#F5F5F5] focus:border-[#D4AF37]"
                          placeholder="••••••••"
                        />
                      </div>
                      {errors.confirmPassword && <p className="text-xs text-[#8B0000]">{errors.confirmPassword}</p>}
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="ageConfirmation"
                          checked={formData.ageConfirmation}
                          onCheckedChange={checked => updateFormData('ageConfirmation', checked === true)}
                          className="border-[#333333] data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
                        />
                        <Label htmlFor="ageConfirmation" className="text-sm text-[#A0A0A0]">
                          {t('auth.age_confirm', { age: MINIMUM_AGE })}
                        </Label>
                      </div>
                      {errors.ageConfirmation && <p className="text-xs text-[#8B0000]">{errors.ageConfirmation}</p>}

                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="acceptTerms"
                          checked={formData.acceptTerms}
                          onCheckedChange={checked => updateFormData('acceptTerms', checked === true)}
                          className="border-[#333333] data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
                        />
                        <Label htmlFor="acceptTerms" className="text-sm text-[#A0A0A0]">
                          {t('auth.agree_to')}{' '}
                          <a href="#terms" className="text-[#D4AF37] hover:underline">{t('auth.terms')}</a>
                          {' '}y{' '}
                          <a href="#privacy" className="text-[#D4AF37] hover:underline">{t('auth.privacy')}</a>
                        </Label>
                      </div>
                      {errors.acceptTerms && <p className="text-xs text-[#8B0000]">{errors.acceptTerms}</p>}
                    </div>
                  </>
                )}

                {mode === 'login' && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <Checkbox className="border-[#333333] data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]" />
                      <span className="text-sm text-[#A0A0A0]">{t('auth.remember_me')}</span>
                    </label>
                    <a href="#forgot" className="text-sm text-[#D4AF37] hover:underline">
                      {t('auth.forgot_password')}
                    </a>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-premium btn-shine h-12"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : mode === 'login' ? (
                    t('auth.sign_in_btn')
                  ) : (
                    t('auth.create_account')
                  )}
                </Button>
              </form>

              {/* Footer */}
              <div className="px-6 pb-6">
                <p className="text-center text-sm text-[#A0A0A0]">
                  {mode === 'login' ? (
                    <>
                      {t('auth.dont_have_account')}{' '}
                      <button onClick={toggleMode} className="text-[#D4AF37] hover:underline">
                        {t('auth.sign_up')}
                      </button>
                    </>
                  ) : (
                    <>
                      {t('auth.already_have_account')}{' '}
                      <button onClick={toggleMode} className="text-[#D4AF37] hover:underline">
                        {t('auth.sign_in_short')}
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
