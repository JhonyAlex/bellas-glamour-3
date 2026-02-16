'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, TrendingUp, Users, DollarSign, Eye, Heart, 
  Image as ImageIcon, Video, MessageCircle, Settings, Upload,
  BarChart3, Calendar, Bell, Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface ModelDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock data for dashboard
const mockStats = {
  totalSubscribers: 1250,
  newSubscribers: 45,
  totalEarnings: 15420.50,
  monthlyEarnings: 3420.00,
  pendingPayout: 1250.00,
  totalViews: 245000,
  viewsToday: 1234,
  totalLikes: 89000,
  likesToday: 234,
  mediaCount: 87,
  photosCount: 65,
  videosCount: 22,
};

const mockRecentActivity = [
  { type: 'subscription', user: 'john_d', amount: 14.99, time: '2 hours ago' },
  { type: 'tip', user: 'mike_s', amount: 25.00, time: '3 hours ago' },
  { type: 'subscription', user: 'alex_k', amount: 14.99, time: '5 hours ago' },
  { type: 'ppv_unlock', user: 'chris_m', amount: 4.99, time: '6 hours ago' },
  { type: 'tip', user: 'david_r', amount: 50.00, time: '8 hours ago' },
];

const mockEarningsData = [
  { month: 'Jan', amount: 2800 },
  { month: 'Feb', amount: 3200 },
  { month: 'Mar', amount: 2950 },
  { month: 'Apr', amount: 4100 },
  { month: 'May', amount: 3800 },
  { month: 'Jun', amount: 3420 },
];

export function ModelDashboard({ isOpen, onClose }: ModelDashboardProps) {
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
                    <h1 className="text-xl font-semibold text-[#F5F5F5]">Creator Dashboard</h1>
                    <p className="text-sm text-[#A0A0A0]">Manage your content and earnings</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-[#A0A0A0] hover:text-[#F5F5F5] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex gap-1 px-6 pb-2">
                {['Overview', 'Content', 'Messages', 'Settings'].map((tab, i) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      i === 0 
                        ? 'bg-[#D4AF37] text-[#0A0A0A]' 
                        : 'text-[#A0A0A0] hover:bg-[#1A1A1A]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <Button className="btn-premium btn-shine">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Content
                </Button>
                <Button variant="outline" className="border-[#333333] text-[#A0A0A0]">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Messages (12)
                </Button>
                <Button variant="outline" className="border-[#333333] text-[#A0A0A0]">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  icon={<Users className="w-5 h-5" />}
                  label="Subscribers"
                  value={mockStats.totalSubscribers.toLocaleString()}
                  change={`+${mockStats.newSubscribers} this month`}
                  positive
                />
                <StatCard
                  icon={<DollarSign className="w-5 h-5" />}
                  label="Total Earnings"
                  value={formatCurrency(mockStats.totalEarnings)}
                  change={formatCurrency(mockStats.monthlyEarnings) + ' this month'}
                  positive
                />
                <StatCard
                  icon={<Eye className="w-5 h-5" />}
                  label="Total Views"
                  value={mockStats.totalViews.toLocaleString()}
                  change={`+${mockStats.viewsToday.toLocaleString()} today`}
                  positive
                />
                <StatCard
                  icon={<Heart className="w-5 h-5" />}
                  label="Total Likes"
                  value={mockStats.totalLikes.toLocaleString()}
                  change={`+${mockStats.likesToday} today`}
                  positive
                />
              </div>

              {/* Charts and Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Earnings Chart */}
                <Card className="lg:col-span-2 bg-[#1A1A1A] border-[#333333]">
                  <CardHeader>
                    <CardTitle className="text-[#F5F5F5] flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
                      Earnings Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 flex items-end justify-between gap-2">
                      {mockEarningsData.map((item, i) => (
                        <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                          <div
                            className="w-full bg-gradient-to-t from-[#D4AF37] to-[#F5D76E] rounded-t"
                            style={{ 
                              height: `${(item.amount / 5000) * 100}%`,
                              animationDelay: `${i * 0.1}s`
                            }}
                          />
                          <span className="text-xs text-[#A0A0A0]">{item.month}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-[#1A1A1A] border-[#333333]">
                  <CardHeader>
                    <CardTitle className="text-[#F5F5F5] flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockRecentActivity.map((activity, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-2 border-b border-[#333333] last:border-0"
                        >
                          <div>
                            <p className="text-sm text-[#F5F5F5]">@{activity.user}</p>
                            <p className="text-xs text-[#A0A0A0]">
                              {activity.type === 'subscription' && 'New subscription'}
                              {activity.type === 'tip' && 'Sent a tip'}
                              {activity.type === 'ppv_unlock' && 'Unlocked content'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-[#D4AF37]">
                              +{formatCurrency(activity.amount)}
                            </p>
                            <p className="text-xs text-[#A0A0A0]">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Content Overview */}
              <Card className="bg-[#1A1A1A] border-[#333333]">
                <CardHeader>
                  <CardTitle className="text-[#F5F5F5] flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-[#D4AF37]" />
                      Content Overview
                    </span>
                    <Button variant="outline" size="sm" className="border-[#333333] text-[#A0A0A0]">
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-[#0A0A0A] rounded-lg text-center">
                      <ImageIcon className="w-6 h-6 mx-auto mb-2 text-[#D4AF37]" />
                      <p className="text-2xl font-bold text-[#F5F5F5]">{mockStats.photosCount}</p>
                      <p className="text-xs text-[#A0A0A0]">Photos</p>
                    </div>
                    <div className="p-4 bg-[#0A0A0A] rounded-lg text-center">
                      <Video className="w-6 h-6 mx-auto mb-2 text-[#D4AF37]" />
                      <p className="text-2xl font-bold text-[#F5F5F5]">{mockStats.videosCount}</p>
                      <p className="text-xs text-[#A0A0A0]">Videos</p>
                    </div>
                    <div className="p-4 bg-[#0A0A0A] rounded-lg text-center">
                      <Eye className="w-6 h-6 mx-auto mb-2 text-[#D4AF37]" />
                      <p className="text-2xl font-bold text-[#F5F5F5]">3</p>
                      <p className="text-xs text-[#A0A0A0]">Pending Review</p>
                    </div>
                    <div className="p-4 bg-[#0A0A0A] rounded-lg text-center">
                      <Calendar className="w-6 h-6 mx-auto mb-2 text-[#D4AF37]" />
                      <p className="text-2xl font-bold text-[#F5F5F5]">5</p>
                      <p className="text-xs text-[#A0A0A0]">Scheduled</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payout Section */}
              <Card className="bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] border-[#D4AF37]/20">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-medium text-[#F5F5F5] mb-1">Pending Payout</h3>
                      <p className="text-3xl font-bold text-[#D4AF37]">
                        {formatCurrency(mockStats.pendingPayout)}
                      </p>
                      <p className="text-sm text-[#A0A0A0] mt-1">
                        Next payout: July 1, 2025
                      </p>
                    </div>
                    <Button className="btn-premium btn-shine">
                      Request Payout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Stat Card Component
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
