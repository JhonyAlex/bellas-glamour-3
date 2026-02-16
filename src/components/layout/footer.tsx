'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Mail, Shield, FileText, Scale, AlertCircle } from 'lucide-react';
import { APP_NAME, LEGAL_PAGES } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const legalLinks = [
    { href: `#${LEGAL_PAGES.TERMS}`, label: 'Terms of Service', icon: FileText },
    { href: `#${LEGAL_PAGES.PRIVACY}`, label: 'Privacy Policy', icon: Shield },
    { href: `#${LEGAL_PAGES.DMCA}`, label: 'DMCA Policy', icon: AlertCircle },
    { href: `#${LEGAL_PAGES.COMPLIANCE_2257}`, label: '2257 Compliance', icon: Scale },
  ];

  return (
    <footer className="relative bg-[#0A0A0A] border-t border-[#333333]">
      {/* Top decorative line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B6914] flex items-center justify-center">
                <Crown className="w-5 h-5 text-[#0A0A0A]" />
              </div>
              <span className="text-xl font-serif text-gradient-gold">
                {APP_NAME}
              </span>
            </div>
            <p className="text-[#A0A0A0] text-sm leading-relaxed max-w-md mb-4">
              A premium platform for exclusive adult content. We are committed to providing 
              a safe, respectful environment for creators and subscribers alike.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#A0A0A0]">
              <Shield className="w-3 h-3 text-[#D4AF37]" />
              <span>18 U.S.C. 2257 Record-Keeping Requirements Compliant</span>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-[#F5F5F5] font-medium mb-4">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[#A0A0A0] text-sm hover:text-[#D4AF37] transition-colors flex items-center gap-2"
                  >
                    <link.icon className="w-3 h-3" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[#F5F5F5] font-medium mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:support@bellasglamour.com"
                  className="text-[#A0A0A0] text-sm hover:text-[#D4AF37] transition-colors flex items-center gap-2"
                >
                  <Mail className="w-3 h-3" />
                  Contact Support
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-[#A0A0A0] text-sm hover:text-[#D4AF37] transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#help"
                  className="text-[#A0A0A0] text-sm hover:text-[#D4AF37] transition-colors"
                >
                  Help Center
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#333333] pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#A0A0A0] text-xs text-center md:text-left">
              © {currentYear} {APP_NAME}. All rights reserved. All models were at least 18 years old 
              at the time of depiction.
            </p>
            <div className="flex items-center gap-4 text-xs text-[#A0A0A0]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                All systems operational
              </span>
            </div>
          </div>
        </div>

        {/* DMCA Agent Info */}
        <div className="mt-8 pt-8 border-t border-[#333333]/50">
          <p className="text-[#666666] text-xs text-center">
            DMCA Agent: dmca@bellasglamour.com | Custodian of Records: records@bellasglamour.com
          </p>
        </div>
      </div>
    </footer>
  );
}
