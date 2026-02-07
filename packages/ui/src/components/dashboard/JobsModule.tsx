"use client";

import React, { useState } from 'react';
import { MapPin, DollarSign, Clock, Eye, Bookmark, Calendar, CheckCircle } from 'lucide-react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { EmptyState } from '../LoadingState';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  pay: string;
  type: string;
  postedTime: string;
  status?: 'applied' | 'viewed' | 'interview';
  applicationDate?: string;
  interviewDate?: string;
}

const mockJobs = {
  recommended: [
    {
      id: '1',
      title: 'Senior Full Stack Developer',
      company: 'Tech Solutions Ltd',
      location: 'Lagos, Nigeria',
      pay: 'â‚¦600,000 - â‚¦900,000/month',
      type: 'Full-time',
      postedTime: '1 day ago'
    },
    {
      id: '2',
      title: 'Product Designer',
      company: 'Creative Studio',
      location: 'Remote',
      pay: 'â‚¦400,000 - â‚¦650,000/month',
      type: 'Full-time',
      postedTime: '3 days ago'
    },
    {
      id: '3',
      title: 'Marketing Coordinator',
      company: 'Growth Agency',
      location: 'Abuja, Nigeria',
      pay: 'â‚¦300,000 - â‚¦450,000/month',
      type: 'Contract',
      postedTime: '5 days ago'
    }
  ],
  applied: [
    {
      id: '4',
      title: 'Marketing Manager',
      company: 'Creative Agency',
      location: 'Abuja, Nigeria',
      pay: 'â‚¦350,000 - â‚¦500,000/month',
      type: 'Full-time',
      postedTime: '1 week ago',
      status: 'viewed' as const,
      applicationDate: '5 days ago'
    },
    {
      id: '5',
      title: 'Project Manager',
      company: 'Construction Co.',
      location: 'Ibadan, Nigeria',
      pay: 'â‚¦400,000 - â‚¦600,000/month',
      type: 'Full-time',
      postedTime: '2 weeks ago',
      status: 'applied' as const,
      applicationDate: '1 week ago'
    }
  ],
  saved: [
    {
      id: '6',
      title: 'UX Researcher',
      company: 'Design Firm',
      location: 'Lagos, Nigeria',
      pay: 'â‚¦450,000 - â‚¦700,000/month',
      type: 'Full-time',
      postedTime: '4 days ago'
    }
  ],
  interviews: [
    {
      id: '7',
      title: 'Senior Software Engineer',
      company: 'Tech Solutions Ltd',
      location: 'Lagos, Nigeria',
      pay: 'â‚¦500,000 - â‚¦800,000/month',
      type: 'Full-time',
      postedTime: '2 weeks ago',
      status: 'interview' as const,
      applicationDate: '10 days ago',
      interviewDate: 'Tomorrow, 10:00 AM'
    }
  ]
};

export function JobsModule() {
  const [activeTab, setActiveTab] = useState<'recommended' | 'applied' | 'saved' | 'interviews'>('recommended');

  const tabs = [
    { id: 'recommended', label: 'Recommended', count: mockJobs.recommended.length },
    { id: 'applied', label: 'Applied', count: mockJobs.applied.length },
    { id: 'saved', label: 'Saved', count: mockJobs.saved.length },
    { id: 'interviews', label: 'Interviews', count: mockJobs.interviews.length }
  ];

  const renderJobCard = (job: Job) => (
    <Card key={job.id} hover>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">{job.title}</h3>
            <p className="text-sm text-foreground-secondary mb-3">{job.company}</p>
          </div>
          {job.status && (
            <Badge 
              variant={job.status === 'interview' ? 'success' : job.status === 'viewed' ? 'gold' : 'default'}
            >
              {job.status === 'interview' ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  Interview
                </>
              ) : job.status === 'viewed' ? (
                <>
                  <Eye className="w-3 h-3" />
                  Viewed
                </>
              ) : (
                'Applied'
              )}
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-foreground-secondary">
            <MapPin className="w-4 h-4 mr-2" />
            {job.location}
          </div>
          <div className="flex items-center text-sm text-foreground-secondary">
            <DollarSign className="w-4 h-4 mr-2" />
            {job.pay}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{job.type}</Badge>
            <span className="flex items-center text-xs text-foreground-tertiary">
              <Clock className="w-3 h-3 mr-1" />
              {job.postedTime}
            </span>
          </div>
        </div>

        {job.applicationDate && (
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-foreground-secondary mb-2">
              Applied {job.applicationDate}
            </p>
            {job.interviewDate && (
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-green">
                <Calendar className="w-4 h-4" />
                Interview: {job.interviewDate}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          {activeTab === 'recommended' ? (
            <>
              <Button variant="primary" size="sm" className="flex-1">
                Apply Now
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="w-4 h-4" />
              </Button>
            </>
          ) : activeTab === 'interviews' ? (
            <Button variant="success" size="sm" className="w-full">
              View Interview Details
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  const currentJobs = mockJobs[activeTab];

  return (
    <div className="p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Jobs</h1>
          <p className="text-foreground-secondary">Find opportunities that match your skills</p>
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

        {/* Content */}
        {currentJobs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {currentJobs.map(renderJobCard)}
          </div>
        ) : (
          <EmptyState
            title="No jobs found"
            description="Check back later for new opportunities that match your profile."
            icon={<Bookmark className="w-16 h-16" />}
            action={
              <Button variant="primary">
                Browse All Jobs
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}


