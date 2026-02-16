'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Shield, AlertTriangle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAgeVerification } from '@/components/providers/age-verification-provider';
import { APP_NAME, APP_TAGLINE, MINIMUM_AGE } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function AgeGateModal() {
  const { showAgeGate, verifyAge } = useAgeVerification();
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!birthDate) {
      setError('Please enter your date of birth');
      setIsSubmitting(false);
      return;
    }

    const date = new Date(birthDate);
    const today = new Date();
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      setError('Please enter a valid date of birth');
      setIsSubmitting(false);
      return;
    }

    // Check if date is in the future
    if (date > today) {
      setError('Date of birth cannot be in the future');
      setIsSubmitting(false);
      return;
    }

    // Check age
    const isOverAge = verifyAge(date);
    
    if (!isOverAge) {
      setError(`You must be at least ${MINIMUM_AGE} years old to access this site`);
    }
    
    setIsSubmitting(false);
  };

  const handleExit = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <AnimatePresence>
      {showAgeGate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0A0A0A]"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 hero-pattern opacity-50" />
          
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="relative w-full max-w-md mx-4"
          >
            <div className="glass-dark rounded-2xl p-8 border border-[#D4AF37]/20">
              {/* Logo */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-serif text-gradient-gold mb-2">
                  {APP_NAME}
                </h1>
                <p className="text-[#A0A0A0] text-sm">{APP_TAGLINE}</p>
              </div>

              {/* Age Verification Notice */}
              <div className="flex items-center justify-center gap-2 mb-6 text-[#A0A0A0]">
                <Shield className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-sm">Age Verification Required</span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm text-[#F5F5F5] mb-2">
                    Enter your date of birth
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-[#333333] rounded-lg text-[#F5F5F5] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 bg-[#8B0000]/20 border border-[#8B0000]/50 rounded-lg"
                  >
                    <AlertTriangle className="w-4 h-4 text-[#8B0000] flex-shrink-0" />
                    <p className="text-sm text-[#F5F5F5]">{error}</p>
                  </motion.div>
                )}

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-premium btn-shine h-12"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-[#0A0A0A] border-t-transparent rounded-full"
                        />
                        Verifying...
                      </span>
                    ) : (
                      `I am ${MINIMUM_AGE} or older - Enter`
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleExit}
                    className="w-full h-12 border-[#333333] text-[#A0A0A0] hover:bg-[#1A1A1A] hover:text-[#F5F5F5] hover:border-[#D4AF37]/50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    I am under {MINIMUM_AGE} - Exit
                  </Button>
                </div>
              </form>

              {/* Legal Text */}
              <div className="mt-6 pt-6 border-t border-[#333333]">
                <p className="text-xs text-[#A0A0A0] text-center leading-relaxed">
                  By entering this site, you confirm that you are at least {MINIMUM_AGE} years old 
                  and agree to our{' '}
                  <a href="#terms" className="text-[#D4AF37] hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#privacy" className="text-[#D4AF37] hover:underline">Privacy Policy</a>.
                </p>
              </div>

              {/* 2257 Compliance Badge */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#A0A0A0]">
                <Shield className="w-3 h-3" />
                <span>18 U.S.C. 2257 Compliant</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
