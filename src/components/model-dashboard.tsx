'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Users, DollarSign, Eye, Heart,
  Image as ImageIcon, Upload,
  Crown, Loader2, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { t } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { getModelStats } from '@/app/actions/models';
import { createMedia, getProfileMedia } from '@/app/actions/media';

interface ModelDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModelDashboard({ isOpen, onClose }: ModelDashboardProps) {
  const currentUser = useAppStore((s) => s.currentUser);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stats, setStats] = useState({
    subscriberCount: 0,
    mediaCount: 0,
    totalViews: 0,
    totalLikes: 0,
    recentEarnings: 0,
  });
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Guard
  if (!currentUser || currentUser.role !== 'model' || !currentUser.profile) {
    return null;
  }

  const profileId = currentUser.profile.id;

  useEffect(() => {
    if (!isOpen) return;
    loadData();
  }, [isOpen]);

  async function loadData() {
    setIsLoading(true);
    try {
      const [s, media] = await Promise.all([
        getModelStats(profileId),
        getProfileMedia(profileId, { limit: 12 }),
      ]);
      setStats(s);
      setMediaList(media);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        alert(err.error || 'Error al subir el archivo');
        return;
      }

      const data = await response.json();

      await createMedia({
        profileId,
        type: data.type as 'photo' | 'video',
        url: data.url,
        title: file.name.replace(/\.[^.]+$/, ''),
      });

      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
      await loadData();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error al subir el archivo');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="min-h-screen ml-auto w-full max-w-6xl bg-[#0F0F0F] border-l border-[#333333]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#0F0F0F]/95 backdrop-blur-sm border-b border-[#333333]">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B6914] flex items-center justify-center">
                    <Crown className="w-5 h-5 text-[#0A0A0A]" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-[#F5F5F5]">{t('dashboard.title')}</h1>
                    <p className="text-sm text-[#A0A0A0]">{currentUser.profile?.stage_name}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-[#A0A0A0] hover:text-[#F5F5F5] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Profile status banner */}
                {currentUser.profile?.status === 'pending' && (
                  <div className="p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg">
                    <p className="text-sm text-[#D4AF37]">
                      Tu perfil está pendiente de aprobación. Un administrador lo revisará pronto.
                    </p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                    className="hidden"
                    onChange={handleUpload}
                  />
                  <Button
                    className="btn-premium btn-shine"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || currentUser.profile?.status !== 'approved'}
                  >
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : uploadSuccess ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    {isUploading ? 'Subiendo...' : uploadSuccess ? 'Subido' : t('dashboard.upload_content')}
                  </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard
                    icon={<Users className="w-5 h-5" />}
                    label={t('dashboard.subscribers')}
                    value={stats.subscriberCount.toLocaleString()}
                    change="suscriptores activos"
                    positive
                  />
                  <StatCard
                    icon={<DollarSign className="w-5 h-5" />}
                    label={t('dashboard.total_earnings')}
                    value={formatCurrency(stats.recentEarnings)}
                    change="últimos 30 días"
                    positive
                  />
                  <StatCard
                    icon={<Eye className="w-5 h-5" />}
                    label={t('dashboard.total_views')}
                    value={stats.totalViews.toLocaleString()}
                    change="vistas totales"
                    positive
                  />
                  <StatCard
                    icon={<Heart className="w-5 h-5" />}
                    label={t('dashboard.total_likes')}
                    value={stats.totalLikes.toLocaleString()}
                    change="me gusta totales"
                    positive
                  />
                </div>

                {/* Content Overview */}
                <Card className="bg-[#1A1A1A] border-[#333333]">
                  <CardHeader>
                    <CardTitle className="text-[#F5F5F5] flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-[#D4AF37]" />
                        {t('dashboard.content_overview')}
                      </span>
                      <span className="text-sm font-normal text-[#A0A0A0]">
                        {stats.mediaCount} archivos
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {mediaList.length === 0 ? (
                      <div className="text-center py-8">
                        <ImageIcon className="w-12 h-12 text-[#333333] mx-auto mb-3" />
                        <p className="text-[#A0A0A0]">Aún no has subido contenido</p>
                        <p className="text-sm text-[#666666]">Sube tu primera foto o video para comenzar</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                        {mediaList.map((media) => (
                          <div key={media.id} className="aspect-square rounded-lg overflow-hidden bg-[#2A2A2A]">
                            {media.url ? (
                              <img src={media.url} alt={media.title || ''} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-[#666666]" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatCard({
  icon,
  label,
  value,
  change,
  positive
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  positive?: boolean;
}) {
  return (
    <div className="p-4 bg-[#1A1A1A] rounded-xl border border-[#333333]">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-[#D4AF37]">{icon}</div>
        <span className="text-sm text-[#A0A0A0]">{label}</span>
      </div>
      <p className="text-2xl font-bold text-[#F5F5F5]">{value}</p>
      <p className={`text-xs mt-1 ${positive ? 'text-green-500' : 'text-[#A0A0A0]'}`}>
        {change}
      </p>
    </div>
  );
}
