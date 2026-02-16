'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Users, Shield, AlertTriangle, FileText, Image as ImageIcon,
  CheckCircle, XCircle, Clock, Eye, Ban, Search,
  TrendingUp, DollarSign, Activity, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { t } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, getPlaceholderImage, formatRelativeTime } from '@/lib/utils';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock data
const mockPendingModels = [
  {
    id: '1',
    stageName: 'Sophia Dreams',
    email: 'sophia@example.com',
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    avatarUrl: getPlaceholderImage(100, 100, 'sophia'),
    documentType: 'Passport',
    status: 'pending',
  },
  {
    id: '2',
    stageName: 'Luna Belle',
    email: 'luna@example.com',
    submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    avatarUrl: getPlaceholderImage(100, 100, 'luna'),
    documentType: 'Driver License',
    status: 'pending',
  },
];

const mockPendingMedia = [
  {
    id: '1',
    type: 'photo',
    thumbnailUrl: getPlaceholderImage(300, 400, 'media1'),
    uploadedBy: 'Isabella Rose',
    uploadedAt: new Date(Date.now() - 30 * 60 * 1000),
    title: 'Beach Day Collection #12',
  },
  {
    id: '2',
    type: 'video',
    thumbnailUrl: getPlaceholderImage(300, 400, 'media2'),
    uploadedBy: 'Valentina Noir',
    uploadedAt: new Date(Date.now() - 45 * 60 * 1000),
    title: 'Exclusive VIP Content',
  },
  {
    id: '3',
    type: 'photo',
    thumbnailUrl: getPlaceholderImage(300, 400, 'media3'),
    uploadedBy: 'Emma St Clair',
    uploadedAt: new Date(Date.now() - 60 * 60 * 1000),
    title: 'Artistic Session',
  },
];

const mockFlaggedContent = [
  {
    id: '1',
    type: 'user_report',
    content: 'Inappropriate messaging',
    reportedUser: 'user_123',
    reporter: 'model_456',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
];

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('overview');

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

            {/* Tabs */}
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
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <AdminStatCard
                    icon={<Users className="w-5 h-5" />}
                    label={t('admin.stats.total_users')}
                    value="12,450"
                    change="+234 this week"
                    positive
                  />
                  <AdminStatCard
                    icon={<DollarSign className="w-5 h-5" />}
                    label={t('admin.stats.revenue')}
                    value={formatCurrency(125420)}
                    change="+12% vs last month"
                    positive
                  />
                  <AdminStatCard
                    icon={<Clock className="w-5 h-5" />}
                    label={t('admin.stats.pending_reviews')}
                    value="8"
                    change="5 models, 3 media"
                    warning
                  />
                  <AdminStatCard
                    icon={<AlertTriangle className="w-5 h-5" />}
                    label={t('admin.stats.flagged_items')}
                    value="3"
                    change="1 critical"
                    negative
                  />
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pending Models */}
                  <Card className="bg-[#1A1A1A] border-[#333333]">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-[#F5F5F5] text-lg">
                        {t('admin.pending_models')}
                      </CardTitle>
                      <span className="px-2 py-1 bg-[#D4AF37]/20 text-[#D4AF37] text-xs rounded-full">
                        {mockPendingModels.length} pending
                      </span>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mockPendingModels.map((model) => (
                          <div
                            key={model.id}
                            className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={model.avatarUrl}
                                alt={model.stageName}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <p className="text-sm text-[#F5F5F5]">{model.stageName}</p>
                                <p className="text-xs text-[#A0A0A0]">
                                  {formatRelativeTime(model.submittedAt)}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="destructive">
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pending Media */}
                  <Card className="bg-[#1A1A1A] border-[#333333]">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-[#F5F5F5] text-lg">
                        {t('admin.pending_media')}
                      </CardTitle>
                      <span className="px-2 py-1 bg-[#D4AF37]/20 text-[#D4AF37] text-xs rounded-full">
                        {mockPendingMedia.length} pending
                      </span>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-2">
                        {mockPendingMedia.map((media) => (
                          <div
                            key={media.id}
                            className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                          >
                            <img
                              src={media.thumbnailUrl}
                              alt={media.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-[#0A0A0A]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Eye className="w-6 h-6 text-[#D4AF37]" />
                            </div>
                          </div>
                        ))}
                      </div>
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
                  <Button className="btn-premium">{t('admin.export_data')}</Button>
                </div>
                {/* Models list would go here */}
                <div className="text-center py-12 text-[#A0A0A0]">
                  {t('admin.models_placeholder')}
                </div>
              </TabsContent>

              {/* Media Tab */}
              <TabsContent value="media" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" className="border-[#333333]">{t('filters.any')}</Button>
                    <Button variant="outline" className="border-[#333333]">{t('model.photos')}</Button>
                    <Button variant="outline" className="border-[#333333]">{t('model.videos')}</Button>
                    <Button variant="outline" className="border-[#8B0000]">{t('admin.flagged')}</Button>
                  </div>
                </div>
                <div className="text-center py-12 text-[#A0A0A0]">
                  {t('admin.media_placeholder')}
                </div>
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users" className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
                    <Input
                      placeholder={t('admin.search_users_placeholder')}
                      className="pl-10 bg-[#1A1A1A] border-[#333333]"
                    />
                  </div>
                  <Button className="btn-premium">{t('admin.export_users')}</Button>
                </div>
                <div className="text-center py-12 text-[#A0A0A0]">
                  {t('admin.users_placeholder')}
                </div>
              </TabsContent>

              {/* Compliance Tab */}
              <TabsContent value="compliance" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-[#1A1A1A] border-[#333333]">
                    <CardHeader>
                      <CardTitle className="text-[#F5F5F5] flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#D4AF37]" />
                        {t('admin.compliance.title')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg">
                          <span className="text-sm text-[#A0A0A0]">{t('admin.compliance_stats.verified_models')}</span>
                          <span className="text-[#F5F5F5] font-medium">248</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg">
                          <span className="text-sm text-[#A0A0A0]">{t('admin.compliance_stats.documents_on_file')}</span>
                          <span className="text-[#F5F5F5] font-medium">496</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg">
                          <span className="text-sm text-[#A0A0A0]">{t('admin.compliance_stats.expiring_soon')}</span>
                          <span className="text-[#D4AF37] font-medium">12</span>
                        </div>
                        <Button className="w-full btn-premium">
                          {t('admin.compliance_stats.export_2257')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#1A1A1A] border-[#333333]">
                    <CardHeader>
                      <CardTitle className="text-[#F5F5F5] flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-[#D4AF37]" />
                        DMCA Takedowns
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg">
                          <span className="text-sm text-[#A0A0A0]">{t('admin.pending_requests')}</span>
                          <span className="text-[#D4AF37] font-medium">3</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg">
                          <span className="text-sm text-[#A0A0A0]">{t('admin.processed_this_month')}</span>
                          <span className="text-[#F5F5F5] font-medium">8</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg">
                          <span className="text-sm text-[#A0A0A0]">{t('admin.total_this_year')}</span>
                          <span className="text-[#F5F5F5] font-medium">45</span>
                        </div>
                        <Button variant="outline" className="w-full border-[#333333]">
                          {t('admin.view_all_requests')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-[#1A1A1A] border-[#333333]">
                  <CardHeader>
                    <CardTitle className="text-[#F5F5F5] flex items-center gap-2">
                      <Shield className="w-5 h-5 text-[#D4AF37]" />
                      Audit Log
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[
                        { action: t('admin.audit.model_approved'), user: 'admin@bg.com', time: t('admin.audit.time_10mins') },
                        { action: t('admin.audit.media_flagged'), user: 'admin@bg.com', time: t('admin.audit.time_25mins') },
                        { action: t('admin.audit.user_banned'), user: 'admin@bg.com', time: t('admin.audit.time_1hour') },
                        { action: t('admin.audit.content_removed'), user: 'mod@bg.com', time: t('admin.audit.time_2hours') },
                      ].map((log, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg"
                        >
                          <div>
                            <p className="text-sm text-[#F5F5F5]">{log.action}</p>
                            <p className="text-xs text-[#A0A0A0]">{t('admin.audit.by')} {log.user}</p>
                          </div>
                          <span className="text-xs text-[#A0A0A0]">{log.time}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Admin Stat Card Component
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
