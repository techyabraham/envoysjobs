"use client";

import React, { useMemo, useState } from 'react';
import { Star, MessageCircle, Eye, TrendingUp, Edit, Plus } from 'lucide-react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { EmptyState } from '../LoadingState';

interface ServiceListing {
  title: string;
  description: string;
  rate: string;
  rating: number;
  reviewCount: number;
  views: number;
  enquiries: number;
  status: 'active' | 'pending' | 'paused';
}

const mockServiceListing: ServiceListing = {
  title: 'Professional Web Development',
  description: 'Full-stack web development services including React, Node.js, and database design. Specialized in creating modern, responsive websites and web applications.',
  rate: '₦50,000 - ₦200,000/project',
  rating: 4.9,
  reviewCount: 24,
  views: 156,
  enquiries: 12,
  status: 'active'
};

const mockEnquiries = [
  {
    id: '1',
    from: 'Sarah Adeyemi',
    message: 'Hi! I need a website for my new business. Can we discuss?',
    time: '2 hours ago',
    unread: true
  },
  {
    id: '2',
    from: 'Emmanuel Okafor',
    message: 'What is your availability for a project starting next month?',
    time: '1 day ago',
    unread: false
  },
  {
    id: '3',
    from: 'Grace Nwosu',
    message: 'Could you help with an e-commerce platform?',
    time: '3 days ago',
    unread: false
  }
];

const mockReviews = [
  {
    id: '1',
    from: 'David Eze',
    rating: 5,
    comment: 'Excellent work! Very professional and delivered on time. Highly recommend.',
    project: 'Business Website',
    date: '1 week ago'
  },
  {
    id: '2',
    from: 'Ruth Obi',
    rating: 5,
    comment: 'Amazing developer! Understood my requirements perfectly and exceeded expectations.',
    project: 'Portfolio Website',
    date: '2 weeks ago'
  },
  {
    id: '3',
    from: 'John Ade',
    rating: 4,
    comment: 'Great communication and quality work. Will definitely work together again.',
    project: 'Landing Page',
    date: '1 month ago'
  }
];

interface ServicesModuleProps {
  onCreate?: () => void;
  onEdit?: () => void;
  service?: {
    title: string;
    description: string;
    rate: string;
    status: 'ACTIVE' | 'PENDING' | 'PAUSED';
  } | null;
  stats?: {
    rating: number;
    reviewCount: number;
    views: number;
    enquiries: number;
  };
}

export function ServicesModule({ onCreate, onEdit, service, stats }: ServicesModuleProps) {
  const [activeTab, setActiveTab] = useState<'listing' | 'enquiries' | 'reviews'>('listing');
  const hasService = Boolean(service);

  const resolvedService = useMemo<ServiceListing>(() => {
    if (!service) return mockServiceListing;
    return {
      title: service.title,
      description: service.description,
      rate: service.rate,
      status: service.status === 'ACTIVE' ? 'active' : service.status === 'PAUSED' ? 'paused' : 'pending',
      rating: stats?.rating ?? 0,
      reviewCount: stats?.reviewCount ?? 0,
      views: stats?.views ?? 0,
      enquiries: stats?.enquiries ?? 0
    };
  }, [service, stats]);

  const tabs = [
    { id: 'listing', label: 'My Service' },
    { id: 'enquiries', label: 'Enquiries', count: mockEnquiries.filter(e => e.unread).length },
    { id: 'reviews', label: 'Reviews', count: mockReviews.length }
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-soft-gold text-soft-gold'
                : 'text-border'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-2">Services</h1>
            <p className="text-foreground-secondary">Manage your service listings and enquiries</p>
          </div>
          {hasService && (
            <Button
              variant="primary"
              size="sm"
              className="hidden sm:flex"
              onClick={onEdit}
            >
              <Edit className="w-4 h-4" />
              Edit Service
            </Button>
          )}
        </div>

        {!hasService ? (
          <EmptyState
            title="No Service Listed"
            description="Start offering your services to fellow Envoys and grow your opportunities."
            icon={<Plus className="w-16 h-16" />}
            action={
              <Button variant="success" onClick={onCreate}>
                <Plus className="w-5 h-5" />
                Create Service Listing
              </Button>
            }
          />
        ) : (
          <>
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
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-green text-white text-xs">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            {activeTab === 'listing' && (
              <div className="space-y-6">
                {/* Service Listing Card */}
                <Card className="relative">
                  <div className="absolute top-6 right-6">
                    <Badge variant={resolvedService.status === 'active' ? 'success' : 'default'}>
                      {resolvedService.status === 'active' ? 'Active' : resolvedService.status === 'paused' ? 'Paused' : 'Pending Review'}
                    </Badge>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-foreground mb-2">
                        {resolvedService.title}
                      </h2>
                      <p className="text-foreground-secondary mb-4">
                        {resolvedService.description}
                      </p>
                      <div className="text-xl font-semibold text-deep-blue">
                        {resolvedService.rate}
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        {renderStars(resolvedService.rating)}
                        <span className="font-medium text-foreground">{resolvedService.rating.toFixed(1)}</span>
                        <span className="text-foreground-tertiary">({resolvedService.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Service Insights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <Card>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-deep-blue/10 flex items-center justify-center">
                        <Eye className="w-6 h-6 text-deep-blue" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">
                          {resolvedService.views}
                        </div>
                        <div className="text-sm text-foreground-secondary">
                          Profile Views
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-green/10 flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-emerald-green" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">
                          {resolvedService.enquiries}
                        </div>
                        <div className="text-sm text-foreground-secondary">
                          Enquiries
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-soft-gold/10 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-soft-gold" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">
                          +23%
                        </div>
                        <div className="text-sm text-foreground-secondary">
                          This Month
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'enquiries' && (
              <div className="space-y-4">
                {mockEnquiries.map((enquiry) => (
                  <Card key={enquiry.id} hover className={enquiry.unread ? 'bg-emerald-green/5 border-emerald-green/20' : ''}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-deep-blue to-emerald-green flex items-center justify-center text-white font-medium shrink-0">
                        {enquiry.from.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-foreground">{enquiry.from}</h3>
                          <span className="text-sm text-foreground-tertiary">{enquiry.time}</span>
                        </div>
                        <p className="text-foreground-secondary mb-4">{enquiry.message}</p>
                        <Button variant="primary" size="sm">
                          <MessageCircle className="w-4 h-4" />
                          Respond
                        </Button>
                      </div>
                      {enquiry.unread && (
                        <div className="w-2 h-2 rounded-full bg-emerald-green shrink-0" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Overall Rating */}
                <Card className="bg-gradient-to-br from-soft-gold/10 to-soft-gold/5 border-soft-gold/20">
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                        <div className="text-5xl font-bold text-foreground mb-2">
                        {resolvedService.rating.toFixed(1)}
                      </div>
                      {renderStars(resolvedService.rating)}
                      <p className="text-sm text-foreground-secondary mt-2">
                        Based on {resolvedService.reviewCount} reviews
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Reviews List */}
                <div className="space-y-4">
                  {mockReviews.map((review) => (
                    <Card key={review.id}>
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground mb-1">
                              {review.from}
                            </h3>
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-foreground-tertiary">
                            {review.date}
                          </span>
                        </div>
                        <p className="text-foreground-secondary">
                          {review.comment}
                        </p>
                        <div className="pt-3 border-t border-border">
                          <Badge variant="outline">
                            {review.project}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


