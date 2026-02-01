import React, { useState } from 'react';
import { 
  CheckCircle, XCircle, AlertTriangle, Eye, Users, 
  Briefcase, Wrench, Flag, Search, Filter 
} from 'lucide-react';
import { Card } from '@/app/components/Card';
import { Badge } from '@/app/components/Badge';
import { Button } from '@/app/components/Button';

interface PendingItem {
  id: string;
  type: 'job' | 'service' | 'user' | 'report';
  title: string;
  submittedBy: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  details?: string;
}

const mockPendingItems: PendingItem[] = [
  {
    id: '1',
    type: 'job',
    title: 'Senior Developer Position',
    submittedBy: 'Tech Solutions Ltd',
    submittedDate: '2 hours ago',
    status: 'pending',
    details: 'Full-time position in Lagos'
  },
  {
    id: '2',
    type: 'service',
    title: 'Professional Photography Services',
    submittedBy: 'Emmanuel Okafor',
    submittedDate: '5 hours ago',
    status: 'pending',
    details: 'Event and portrait photography'
  },
  {
    id: '3',
    type: 'user',
    title: 'New Member Verification',
    submittedBy: 'Grace Nwosu',
    submittedDate: '1 day ago',
    status: 'pending',
    details: 'Account verification request'
  },
  {
    id: '4',
    type: 'report',
    title: 'Inappropriate Job Posting',
    submittedBy: 'Sarah Adeyemi',
    submittedDate: '3 days ago',
    status: 'pending',
    details: 'Report regarding job listing #245'
  }
];

const mockStats = [
  { label: 'Pending Reviews', value: '12', icon: AlertTriangle, color: 'text-soft-gold' },
  { label: 'Total Users', value: '1,250', icon: Users, color: 'text-deep-blue' },
  { label: 'Active Jobs', value: '145', icon: Briefcase, color: 'text-emerald-green' },
  { label: 'Active Services', value: '89', icon: Wrench, color: 'text-deep-blue' }
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'all' | 'jobs' | 'services' | 'users' | 'reports'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'all', label: 'All', count: mockPendingItems.length },
    { id: 'jobs', label: 'Jobs', count: mockPendingItems.filter(i => i.type === 'job').length },
    { id: 'services', label: 'Services', count: mockPendingItems.filter(i => i.type === 'service').length },
    { id: 'users', label: 'Users', count: mockPendingItems.filter(i => i.type === 'user').length },
    { id: 'reports', label: 'Reports', count: mockPendingItems.filter(i => i.type === 'report').length }
  ];

  const filteredItems = mockPendingItems.filter(item => {
    if (activeTab !== 'all' && item.type !== activeTab.slice(0, -1)) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return item.status === 'pending';
  });

  const handleApprove = (id: string) => {
    console.log('Approving item:', id);
    // In real app, this would call an API
  };

  const handleReject = (id: string) => {
    console.log('Rejecting item:', id);
    // In real app, this would call an API
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'job': return <Briefcase className="w-4 h-4" />;
      case 'service': return <Wrench className="w-4 h-4" />;
      case 'user': return <Users className="w-4 h-4" />;
      case 'report': return <Flag className="w-4 h-4" />;
      default: return null;
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'job': return 'default';
      case 'service': return 'success';
      case 'user': return 'gold';
      case 'report': return 'urgent';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-background-secondary">
      {/* Admin Header */}
      <div className="bg-gradient-to-br from-deep-blue via-deep-blue-dark to-deep-blue-light text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl mb-2">Admin Dashboard</h1>
          <p className="text-xl text-white/90">
            Maintain excellence and trust in our community
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-background-secondary flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-sm text-foreground-secondary">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Moderation Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-1">Pending Reviews</h2>
              <p className="text-foreground-secondary">Items awaiting moderation</p>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-2">
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground-tertiary" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-border focus:border-deep-blue focus:outline-none transition-colors"
                />
              </div>
              <button className="p-2 bg-white border border-border rounded-lg hover:bg-background-secondary transition-colors">
                <Filter className="w-5 h-5 text-foreground-secondary" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border overflow-x-auto mb-6">
            <div className="flex gap-8 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-deep-blue text-deep-blue'
                      : 'border-transparent text-foreground-secondary hover:text-foreground'
                  }`}
                >
                  <span className="font-medium">{tab.label}</span>
                  {tab.count > 0 && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-soft-gold/20 text-soft-gold text-xs font-medium">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={getTypeBadgeVariant(item.type)}>
                          {getTypeIcon(item.type)}
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </Badge>
                        <Badge variant="outline">{item.status}</Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-foreground-secondary mb-2">
                        Submitted by {item.submittedBy} • {item.submittedDate}
                      </p>
                      {item.details && (
                        <p className="text-sm text-foreground-tertiary">
                          {item.details}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                    <Button variant="ghost" size="sm" className="flex-1 sm:flex-none">
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                    <div className="flex gap-2 flex-1 sm:flex-none">
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => handleApprove(item.id)}
                        className="flex-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleReject(item.id)}
                        className="flex-1 text-destructive hover:bg-destructive/10"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Actions */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-6">Recent Actions</h2>
          <div className="space-y-3">
            <Card>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-green/10 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-emerald-green" />
                </div>
                <div className="flex-1">
                  <p className="text-foreground mb-1">Approved job posting</p>
                  <p className="text-sm text-foreground-tertiary">Marketing Manager at Creative Agency • 1 hour ago</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-green/10 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-emerald-green" />
                </div>
                <div className="flex-1">
                  <p className="text-foreground mb-1">Verified new member</p>
                  <p className="text-sm text-foreground-tertiary">David Eze • 3 hours ago</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                  <XCircle className="w-5 h-5 text-destructive" />
                </div>
                <div className="flex-1">
                  <p className="text-foreground mb-1">Rejected service listing</p>
                  <p className="text-sm text-foreground-tertiary">Incomplete information • 5 hours ago</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
