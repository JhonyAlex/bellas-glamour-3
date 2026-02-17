'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Users, Shield, AlertTriangle, FileText, Image as ImageIcon,
  CheckCircle, XCircle, Clock, Eye, Ban, Search,
  TrendingUp, DollarSign, Activity, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { t } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatRelativeTime } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { getAdminStats, getPendingModels, approveModel, rejectModel, getUsers, getRecentAuditLogs } from '@/app/actions/admin';
import { getPendingMedia, moderateMedia } from '@/app/actions/media';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const currentUser = useAppStore((s) => s.currentUser);

  // Data state
  const [stats, setStats] = useState<any>(null);
  const [pendingModelsList, setPendingModelsList] = useState<any[]>([]);
  const [pendingMediaList, setPendingMediaList] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usersSearch, setUsersSearch] = useState('');

  // Load data when panel opens
  useEffect(() => {
    if (!isOpen) return;
    loadData();
  }, [isOpen]);

  async function loadData() {
    setIsLoading(true);
    try {
      const [s, models, media, users, logs] = await Promise.all([
        getAdminStats(),
        getPendingModels(),
        getPendingMedia(),
        getUsers(),
        getRecentAuditLogs(),
      ]);
      setStats(s);
      setPendingModelsList(models);
      setPendingMediaList(media.data);
      setUsersList(users.users);
      setAuditLogs(logs);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleApproveModel = async (profileId: string) => {
    await approveModel(profileId);
    setPendingModelsList(prev => prev.filter(m => m.id !== profileId));
    if (stats) setStats({ ...stats, pendingModels: stats.pendingModels - 1 });
  };

  const handleRejectModel = async (profileId: string) => {
    await rejectModel(profileId);
    setPendingModelsList(prev => prev.filter(m => m.id !== profileId));
    if (stats) setStats({ ...stats, pendingModels: stats.pendingModels - 1 });
  };

  const handleModerateMedia = async (mediaId: string, status: 'approved' | 'rejected' | 'flagged') => {
    if (!currentUser) return;
    await moderateMedia(mediaId, currentUser.id, status);
    setPendingMediaList(prev => prev.filter(m => m.id !== mediaId));
    if (stats) setStats({ ...stats, pendingMedia: stats.pendingMedia - 1 });
  };

  // Permission gate - after all hooks
  if (currentUser?.role !== 'admin') {
    return null;
  }

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
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="min-h-screen mr-auto w-full max-w-6xl bg-[#0F0F0F] border-r border-[#333333]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#0F0F0F]/95 backdrop-blur-sm border-b border-[#333333]">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B0000] to-[#5a0000] flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-[#F5F5F5]">{t('admin.title')}</h1>
                    <p className="text-sm text-[#A0A0A0]">{t('admin.subtitle')}</p>
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
              <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
                <TabsList className="bg-[#1A1A1A] border border-[#333333] w-full justify-start rounded-lg p-1 mb-6">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#0A0A0A]"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    {t('admin.tabs.overview')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="models"
                    className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#0A0A0A]"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {t('admin.tabs.models')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="media"
                    className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#0A0A0A]"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    {t('admin.tabs.media')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="users"
                    className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#0A0A0A]"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {t('admin.tabs.users')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="compliance"
                    className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#0A0A0A]"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {t('admin.tabs.compliance')}
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <AdminStatCard
                      icon={<Users className="w-5 h-5" />}
                      label={t('admin.stats.total_users')}
                      value={stats?.totalUsers?.toString() || '0'}
                      change={`${stats?.totalModels || 0} modelos aprobados`}
                      positive
                    />
                    <AdminStatCard
                      icon={<Clock className="w-5 h-5" />}
                      label={t('admin.stats.pending_reviews')}
                      value={((stats?.pendingModels || 0) + (stats?.pendingMedia || 0)).toString()}
                      change={`${stats?.pendingModels || 0} modelos, ${stats?.pendingMedia || 0} media`}
                      warning
                    />
                    <AdminStatCard
                      icon={<AlertTriangle className="w-5 h-5" />}
                      label={t('admin.stats.flagged_items')}
                      value={stats?.flaggedMedia?.toString() || '0'}
                      change="requieren revisión"
                      negative={stats?.flaggedMedia > 0}
                    />
                    <AdminStatCard
                      icon={<Activity className="w-5 h-5" />}
                      label="Modelos aprobados"
                      value={stats?.totalModels?.toString() || '0'}
                      change="activos en la plataforma"
                      positive
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pending Models */}
                    <Card className="bg-[#1A1A1A] border-[#333333]">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-[#F5F5F5] text-lg">
                          {t('admin.pending_models')}
                        </CardTitle>
                        <span className="px-2 py-1 bg-[#D4AF37]/20 text-[#D4AF37] text-xs rounded-full">
                          {pendingModelsList.length} pendientes
                        </span>
                      </CardHeader>
                      <CardContent>
                        {pendingModelsList.length === 0 ? (
                          <p className="text-center py-4 text-[#A0A0A0] text-sm">No hay modelos pendientes</p>
                        ) : (
                          <div className="space-y-3">
                            {pendingModelsList.map((model) => (
                              <div
                                key={model.id}
                                className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-[#2A2A2A] flex items-center justify-center">
                                    <Users className="w-5 h-5 text-[#D4AF37]" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-[#F5F5F5]">{model.stage_name}</p>
                                    <p className="text-xs text-[#A0A0A0]">
                                      {model.user?.email} · {formatRelativeTime(new Date(model.created_at))}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleApproveModel(model.id)}
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleRejectModel(model.id)}
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Pending Media */}
                    <Card className="bg-[#1A1A1A] border-[#333333]">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-[#F5F5F5] text-lg">
                          {t('admin.pending_media')}
                        </CardTitle>
                        <span className="px-2 py-1 bg-[#D4AF37]/20 text-[#D4AF37] text-xs rounded-full">
                          {pendingMediaList.length} pendientes
                        </span>
                      </CardHeader>
                      <CardContent>
                        {pendingMediaList.length === 0 ? (
                          <p className="text-center py-4 text-[#A0A0A0] text-sm">No hay media pendiente</p>
                        ) : (
                          <div className="grid grid-cols-3 gap-2">
                            {pendingMediaList.slice(0, 6).map((media) => (
                              <div
                                key={media.id}
                                className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer bg-[#2A2A2A]"
                              >
                                {media.thumbnail_url || media.url ? (
                                  <img
                                    src={media.thumbnail_url || media.url}
                                    alt={media.title || 'Media'}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="w-8 h-8 text-[#666666]" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-[#0A0A0A]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => handleModerateMedia(media.id, 'approved')}
                                    className="p-1.5 bg-green-600 rounded-full hover:bg-green-700"
                                  >
                                    <CheckCircle className="w-4 h-4 text-white" />
                                  </button>
                                  <button
                                    onClick={() => handleModerateMedia(media.id, 'rejected')}
                                    className="p-1.5 bg-red-600 rounded-full hover:bg-red-700"
                                  >
                                    <XCircle className="w-4 h-4 text-white" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Models Tab */}
                <TabsContent value="models" className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
                      <Input
                        placeholder={t('filters.search_placeholder')}
                        className="pl-10 bg-[#1A1A1A] border-[#333333]"
                      />
                    </div>
                  </div>
                  {pendingModelsList.length === 0 ? (
                    <div className="text-center py-12 text-[#A0A0A0]">
                      No hay modelos pendientes de revisión
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pendingModelsList.map((model) => (
                        <div key={model.id} className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg border border-[#333333]">
                          <div>
                            <p className="text-[#F5F5F5] font-medium">{model.stage_name}</p>
                            <p className="text-sm text-[#A0A0A0]">{model.user?.email}</p>
                            <p className="text-xs text-[#666666]">
                              Registrado: {formatRelativeTime(new Date(model.created_at))}
                              {model.bio && ` · ${model.bio.substring(0, 50)}...`}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApproveModel(model.id)}>
                              <CheckCircle className="w-4 h-4 mr-1" /> Aprobar
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleRejectModel(model.id)}>
                              <XCircle className="w-4 h-4 mr-1" /> Rechazar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Media Tab */}
                <TabsContent value="media" className="space-y-4">
                  {pendingMediaList.length === 0 ? (
                    <div className="text-center py-12 text-[#A0A0A0]">
                      No hay media pendiente de moderación
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {pendingMediaList.map((media) => (
                        <div key={media.id} className="bg-[#1A1A1A] rounded-lg border border-[#333333] overflow-hidden">
                          <div className="aspect-square bg-[#2A2A2A] flex items-center justify-center">
                            {media.url ? (
                              <img src={media.url} alt={media.title || ''} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-8 h-8 text-[#666666]" />
                            )}
                          </div>
                          <div className="p-3">
                            <p className="text-sm text-[#F5F5F5] truncate">{media.title || 'Sin título'}</p>
                            <p className="text-xs text-[#A0A0A0]">{media.profile?.stage_name}</p>
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-xs" onClick={() => handleModerateMedia(media.id, 'approved')}>
                                Aprobar
                              </Button>
                              <Button size="sm" variant="destructive" className="flex-1 text-xs" onClick={() => handleModerateMedia(media.id, 'rejected')}>
                                Rechazar
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Users Tab */}
                <TabsContent value="users" className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
                      <Input
                        placeholder={t('admin.search_users_placeholder')}
                        className="pl-10 bg-[#1A1A1A] border-[#333333]"
                        value={usersSearch}
                        onChange={e => setUsersSearch(e.target.value)}
                      />
                    </div>
                  </div>
                  {usersList.length === 0 ? (
                    <div className="text-center py-12 text-[#A0A0A0]">No hay usuarios registrados</div>
                  ) : (
                    <div className="space-y-2">
                      {usersList
                        .filter(u => !usersSearch || u.email.includes(usersSearch) || u.name?.includes(usersSearch))
                        .map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-lg border border-[#333333]">
                            <div>
                              <p className="text-sm text-[#F5F5F5]">{user.name || user.email}</p>
                              <p className="text-xs text-[#A0A0A0]">
                                {user.email} · {user.role}
                                {user.profile?.stage_name && ` · ${user.profile.stage_name}`}
                                {user.is_banned && ' · BANEADO'}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                user.role === 'admin' ? 'bg-[#8B0000]/20 text-[#8B0000]' :
                                user.role === 'model' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' :
                                'bg-[#333333] text-[#A0A0A0]'
                              }`}>
                                {user.role}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </TabsContent>

                {/* Compliance Tab */}
                <TabsContent value="compliance" className="space-y-6">
                  <Card className="bg-[#1A1A1A] border-[#333333]">
                    <CardHeader>
                      <CardTitle className="text-[#F5F5F5] flex items-center gap-2">
                        <Shield className="w-5 h-5 text-[#D4AF37]" />
                        Audit Log
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {auditLogs.length === 0 ? (
                        <p className="text-center py-4 text-[#A0A0A0] text-sm">No hay registros de auditoría</p>
                      ) : (
                        <div className="space-y-2">
                          {auditLogs.map((log) => (
                            <div
                              key={log.id}
                              className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg"
                            >
                              <div>
                                <p className="text-sm text-[#F5F5F5]">{log.action}</p>
                                <p className="text-xs text-[#A0A0A0]">
                                  por {log.user?.email || 'sistema'} · {log.resource_type}
                                </p>
                              </div>
                              <span className="text-xs text-[#A0A0A0]">
                                {formatRelativeTime(new Date(log.created_at))}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AdminStatCard({
  icon,
  label,
  value,
  change,
  positive,
  warning,
  negative
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  positive?: boolean;
  warning?: boolean;
  negative?: boolean;
}) {
  return (
    <div className="p-4 bg-[#1A1A1A] rounded-xl border border-[#333333]">
      <div className="flex items-center gap-2 mb-2">
        <div className={`${
          positive ? 'text-green-500' :
          warning ? 'text-[#D4AF37]' :
          negative ? 'text-[#8B0000]' :
          'text-[#D4AF37]'
        }`}>
          {icon}
        </div>
        <span className="text-sm text-[#A0A0A0]">{label}</span>
      </div>
      <p className="text-2xl font-bold text-[#F5F5F5]">{value}</p>
      <p className={`text-xs mt-1 ${
        positive ? 'text-green-500' :
        warning ? 'text-[#D4AF37]' :
        negative ? 'text-[#8B0000]' :
        'text-[#A0A0A0]'
      }`}>
        {change}
      </p>
    </div>
  );
}
