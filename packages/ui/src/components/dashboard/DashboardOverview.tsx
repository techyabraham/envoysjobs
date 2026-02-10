"use client";

import React from 'react';
import { 
  Briefcase, Eye, MessageCircle, TrendingUp, 
  Plus, Award, AlertCircle, CheckCircle 
} from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Badge } from '../Badge';

interface DashboardStat {
  label: string;
  value: string;
  icon: typeof Briefcase;
  change: string;
}

interface Recommendation {
  type: 'job' | 'gig';
  title: string;
  company: string;
  match: string;
  badge: string;
}

interface ActivityItem {
  title: string;
  meta: string;
  icon: typeof CheckCircle;
  tone: 'success' | 'info' | 'accent';
}

interface DashboardOverviewProps {
  userName: string;
  onNavigate?: (page: string) => void;
  profileCompletion?: number;
  stats?: DashboardStat[];
  recommendations?: Recommendation[];
  activity?: ActivityItem[];
}

export function DashboardOverview({
  userName,
  onNavigate,
  profileCompletion = 75,
  stats,
  recommendations,
  activity
}: DashboardOverviewProps) {
  
  const statItems = stats ?? [
    { label: 'Applications Sent', value: '12', icon: Briefcase, change: '+3 this week' },
    { label: 'Profile Views', value: '48', icon: Eye, change: '+12 this week' },
    { label: 'New Messages', value: '5', icon: MessageCircle, change: '2 unread' },
    { label: 'Success Rate', value: '85%', icon: TrendingUp, change: '+5% this month' }
  ];

  const recommendedItems = recommendations ?? [
    {
      type: 'job',
      title: 'Senior Developer Position',
      company: 'Tech Solutions Ltd',
      match: '95%',
      badge: 'From Our Members'
    },
    {
      type: 'gig',
      title: 'Website Design Project',
      company: 'Sister Mary',
      match: '88%',
      badge: 'Urgent'
    }
  ];

  const supportiveMessages = [
    "Your dedication is making a difference",
    "Keep shining your light",
    "Excellence is your standard",
    "Your community values your contribution"
  ];

  const randomMessage = supportiveMessages[Math.floor(Math.random() * supportiveMessages.length)];

  return (
    <div className="p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Greeting */}
        <div className="bg-gradient-to-br from-deep-blue via-deep-blue-dark to-deep-blue-light text-white rounded-2xl p-8">
          <h1 className="text-3xl sm:text-4xl mb-2">
            I honour you, {userName}
          </h1>
          <p className="text-xl text-white/90">
            {randomMessage}
          </p>
        </div>

        {/* Profile Completion */}
        {profileCompletion < 100 && (
          <Card className="bg-soft-gold/10 border-soft-gold/30">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-soft-gold text-white flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground">Complete Your Profile</h3>
                  <span className="text-sm font-medium text-soft-gold-dark">{profileCompletion}%</span>
                </div>
                <div className="w-full h-2 bg-background-secondary rounded-full mb-3">
                  <div 
                    className="h-full bg-soft-gold rounded-full transition-all"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>
                <p className="text-sm text-foreground-secondary mb-4">
                  Add your professional photo and skills to get better matches
                </p>
                <Button variant="accent" size="sm">
                  Complete Profile
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button 
            onClick={() => onNavigate?.('post-job')}
            className="flex items-center gap-4 p-6 bg-white rounded-xl border-2 border-dashed border-border hover:border-deep-blue hover:bg-background-secondary transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-deep-blue/10 group-hover:bg-deep-blue flex items-center justify-center transition-colors">
              <Plus className="w-6 h-6 text-deep-blue group-hover:text-white transition-colors" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground mb-1">Post a Job</h3>
              <p className="text-sm text-foreground-secondary">Find the right Envoy</p>
            </div>
          </button>

          <button 
            onClick={() => onNavigate?.('offer-service')}
            className="flex items-center gap-4 p-6 bg-white rounded-xl border-2 border-dashed border-border hover:border-emerald-green hover:bg-background-secondary transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-green/10 group-hover:bg-emerald-green flex items-center justify-center transition-colors">
              <Plus className="w-6 h-6 text-emerald-green group-hover:text-white transition-colors" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground mb-1">Offer Service</h3>
              <p className="text-sm text-foreground-secondary">Share your skills</p>
            </div>
          </button>

          <button 
            onClick={() => onNavigate?.('post-gig')}
            className="flex items-center gap-4 p-6 bg-white rounded-xl border-2 border-dashed border-border hover:border-soft-gold hover:bg-background-secondary transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-soft-gold/10 group-hover:bg-soft-gold flex items-center justify-center transition-colors">
              <Plus className="w-6 h-6 text-soft-gold group-hover:text-white transition-colors" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground mb-1">Post a Gig</h3>
              <p className="text-sm text-foreground-secondary">Quick opportunities</p>
            </div>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statItems.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-deep-blue/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-deep-blue" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-foreground-secondary mb-2">
                  {stat.label}
                </div>
                <div className="text-xs text-emerald-green font-medium">
                  {stat.change}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Next Best Action */}
        <Card className="bg-emerald-green/5 border-emerald-green/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-green text-white flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">Next Best Action</h3>
              <p className="text-foreground-secondary mb-4">
                Based on your profile, we recommend applying for the Senior Developer position at Tech Solutions Ltd. It matches 95% of your skills!
              </p>
              <Button variant="success" size="sm">
                View Opportunity
              </Button>
            </div>
          </div>
        </Card>

        {/* Recommended for You */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-1">Recommended for You</h2>
              <p className="text-foreground-secondary">Opportunities that match your profile</p>
            </div>
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendedItems.map((rec, index) => (
              <Card key={index} hover>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={rec.badge === 'Urgent' ? 'urgent' : 'gold'}>
                        {rec.badge}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {rec.title}
                    </h3>
                    <p className="text-sm text-foreground-secondary mb-3">
                      {rec.company}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-green mb-1">
                      {rec.match}
                    </div>
                    <div className="text-xs text-foreground-tertiary">
                      Match
                    </div>
                  </div>
                </div>
                <Button variant="primary" size="sm" className="w-full">
                  View Details
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {(activity ?? [
              {
                title: "Your application was viewed",
                meta: "Marketing Manager at Creative Agency • 2 hours ago",
                icon: CheckCircle,
                tone: "success"
              },
              {
                title: "New message from Sarah Adeyemi",
                meta: "Regarding: Web Development Project • 5 hours ago",
                icon: MessageCircle,
                tone: "info"
              },
              {
                title: "Profile completion increased to 75%",
                meta: "You're almost there! • 1 day ago",
                icon: Award,
                tone: "accent"
              }
            ]).map((item, index) => {
              const Icon = item.icon;
              const toneClass =
                item.tone === "success"
                  ? "bg-emerald-green/10 text-emerald-green"
                  : item.tone === "info"
                  ? "bg-deep-blue/10 text-deep-blue"
                  : "bg-soft-gold/10 text-soft-gold";
              return (
                <Card key={index}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${toneClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground mb-1">{item.title}</p>
                      <p className="text-sm text-foreground-tertiary">{item.meta}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


