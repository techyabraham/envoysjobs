import React, { useState } from 'react';
import { MapPin, Calendar, Clock, DollarSign, AlertCircle, CheckCircle, Play } from 'lucide-react';
import { Card } from '@/app/components/Card';
import { Badge } from '@/app/components/Badge';
import { Button } from '@/app/components/Button';
import { EmptyState } from '@/app/components/LoadingState';

interface Gig {
  id: string;
  title: string;
  amount: string;
  location: string;
  duration: string;
  postedBy: string;
  urgent?: boolean;
  status?: 'available' | 'applied' | 'ongoing' | 'completed';
  applicationDate?: string;
  startDate?: string;
  completionDate?: string;
}

const mockGigs = {
  available: [
    {
      id: '1',
      title: 'Event Setup Assistant',
      amount: '₦15,000',
      location: 'Lagos',
      duration: '1 day',
      postedBy: 'Pastor James',
      urgent: true,
      status: 'available' as const
    },
    {
      id: '2',
      title: 'Data Entry Specialist',
      amount: '₦25,000',
      location: 'Remote',
      duration: '3 days',
      postedBy: 'Sister Mary',
      status: 'available' as const
    }
  ],
  applied: [
    {
      id: '3',
      title: 'Social Media Manager',
      amount: '₦40,000',
      location: 'Abuja',
      duration: '1 week',
      postedBy: 'Brother John',
      status: 'applied' as const,
      applicationDate: '2 days ago'
    }
  ],
  posted: [
    {
      id: '4',
      title: 'Moving Helper Needed',
      amount: '₦20,000',
      location: 'Ikeja',
      duration: '2 days',
      postedBy: 'You',
      urgent: true,
      status: 'available' as const
    }
  ],
  ongoing: [
    {
      id: '5',
      title: 'Website Content Update',
      amount: '₦30,000',
      location: 'Remote',
      duration: '5 days',
      postedBy: 'Sister Ruth',
      status: 'ongoing' as const,
      startDate: '3 days ago'
    }
  ],
  completed: [
    {
      id: '6',
      title: 'Photography for Church Event',
      amount: '₦50,000',
      location: 'Lagos',
      duration: '1 day',
      postedBy: 'Pastor David',
      status: 'completed' as const,
      completionDate: '1 week ago'
    },
    {
      id: '7',
      title: 'Logo Design',
      amount: '₦35,000',
      location: 'Remote',
      duration: '3 days',
      postedBy: 'Brother Michael',
      status: 'completed' as const,
      completionDate: '2 weeks ago'
    }
  ]
};

export function GigsModule() {
  const [activeTab, setActiveTab] = useState<'available' | 'applied' | 'posted' | 'ongoing' | 'completed'>('available');

  const tabs = [
    { id: 'available', label: 'Available', count: mockGigs.available.length },
    { id: 'applied', label: 'Applied', count: mockGigs.applied.length },
    { id: 'posted', label: 'Posted', count: mockGigs.posted.length },
    { id: 'ongoing', label: 'Ongoing', count: mockGigs.ongoing.length },
    { id: 'completed', label: 'Completed', count: mockGigs.completed.length }
  ];

  const renderGigCard = (gig: Gig) => (
    <Card key={gig.id} hover>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-foreground flex-1">
            {gig.title}
          </h3>
          {gig.urgent && (
            <Badge variant="urgent" className="shrink-0">
              <AlertCircle className="w-3 h-3" />
              Urgent
            </Badge>
          )}
          {gig.status === 'ongoing' && (
            <Badge variant="success" className="shrink-0">
              <Play className="w-3 h-3" />
              In Progress
            </Badge>
          )}
          {gig.status === 'completed' && (
            <Badge variant="success" className="shrink-0">
              <CheckCircle className="w-3 h-3" />
              Completed
            </Badge>
          )}
        </div>

        <div className="text-3xl font-bold text-emerald-green">
          {gig.amount}
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-foreground-secondary">
            <MapPin className="w-4 h-4 mr-2" />
            {gig.location}
          </div>
          <div className="flex items-center text-sm text-foreground-secondary">
            <Clock className="w-4 h-4 mr-2" />
            {gig.duration}
          </div>
          <p className="text-sm text-foreground-tertiary">
            {gig.postedBy === 'You' ? 'Posted by you' : `Posted by ${gig.postedBy}`}
          </p>
        </div>

        {gig.applicationDate && (
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-foreground-secondary">
              Applied {gig.applicationDate}
            </p>
          </div>
        )}

        {gig.startDate && (
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-foreground-secondary">
              Started {gig.startDate}
            </p>
          </div>
        )}

        {gig.completionDate && (
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-foreground-secondary">
              Completed {gig.completionDate}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          {activeTab === 'available' ? (
            <Button variant="success" size="sm" className="w-full">
              Apply for Gig
            </Button>
          ) : activeTab === 'posted' ? (
            <>
              <Button variant="outline" size="sm" className="flex-1">
                Edit
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 text-destructive hover:bg-destructive/10">
                Remove
              </Button>
            </>
          ) : activeTab === 'ongoing' ? (
            <Button variant="success" size="sm" className="w-full">
              Mark as Complete
            </Button>
          ) : activeTab === 'completed' ? (
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="w-full">
              View Application
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  const currentGigs = mockGigs[activeTab];

  return (
    <div className="p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Gigs</h1>
          <p className="text-foreground-secondary">Quick opportunities for immediate work</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-border overflow-x-auto">
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
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-background-secondary text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Stats for Completed */}
        {activeTab === 'completed' && currentGigs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="bg-emerald-green/5 border-emerald-green/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-1">
                  {currentGigs.length}
                </div>
                <div className="text-sm text-foreground-secondary">
                  Completed Gigs
                </div>
              </div>
            </Card>
            <Card className="bg-soft-gold/5 border-soft-gold/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-1">
                  ₦85,000
                </div>
                <div className="text-sm text-foreground-secondary">
                  Total Earned
                </div>
              </div>
            </Card>
            <Card className="bg-deep-blue/5 border-deep-blue/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-1">
                  100%
                </div>
                <div className="text-sm text-foreground-secondary">
                  Success Rate
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Content */}
        {currentGigs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentGigs.map(renderGigCard)}
          </div>
        ) : (
          <EmptyState
            title={`No ${activeTab} gigs`}
            description={
              activeTab === 'available'
                ? 'Check back later for new gig opportunities.'
                : activeTab === 'posted'
                ? 'You haven\'t posted any gigs yet.'
                : `You don't have any ${activeTab} gigs.`
            }
            icon={<Clock className="w-16 h-16" />}
            action={
              activeTab === 'posted' ? (
                <Button variant="success">
                  Post a Gig
                </Button>
              ) : undefined
            }
          />
        )}
      </div>
    </div>
  );
}
