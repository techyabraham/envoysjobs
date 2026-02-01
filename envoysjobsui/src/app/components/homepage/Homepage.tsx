import React from 'react';
import { ChevronRight } from 'lucide-react';
import { HeroSection } from './HeroSection';
import { JobCard } from './JobCard';
import { ServiceCard } from './ServiceCard';
import { GigCard } from './GigCard';
import { StatsSection } from './StatsSection';
import { Button } from '@/app/components/Button';

// Mock data
const featuredJobs = [
  {
    title: 'Senior Software Engineer',
    company: 'Tech Solutions Ltd',
    location: 'Lagos, Nigeria',
    pay: '₦500,000 - ₦800,000/month',
    type: 'Full-time',
    postedTime: '2 days ago',
    fromMember: true
  },
  {
    title: 'Marketing Manager',
    company: 'Creative Agency',
    location: 'Abuja, Nigeria',
    pay: '₦350,000 - ₦500,000/month',
    type: 'Full-time',
    postedTime: '1 week ago',
    fromMember: true
  },
  {
    title: 'Graphic Designer',
    company: 'Design Studio',
    location: 'Port Harcourt, Nigeria',
    pay: '₦200,000 - ₦350,000/month',
    type: 'Contract',
    postedTime: '3 days ago',
    fromMember: false
  },
  {
    title: 'Project Manager',
    company: 'Construction Co.',
    location: 'Ibadan, Nigeria',
    pay: '₦400,000 - ₦600,000/month',
    type: 'Full-time',
    postedTime: '5 days ago',
    fromMember: true
  }
];

const featuredServices = [
  {
    name: 'Sarah Adeyemi',
    photo: 'https://images.unsplash.com/photo-1739300293504-234817eead52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwcHJvZmVzc2lvbmFsJTIwd29tYW4lMjBvZmZpY2V8ZW58MXx8fHwxNzY5OTAwMTM3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    skill: 'Web Developer',
    tags: ['React', 'Node.js', 'UI/UX'],
    rating: 4.9,
    reviewCount: 24
  },
  {
    name: 'Emmanuel Okafor',
    photo: 'https://images.unsplash.com/photo-1616804827035-f4aa814c14ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwcHJvZmVzc2lvbmFsJTIwbWFuJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzY5OTAwMTM3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    skill: 'Photographer',
    tags: ['Events', 'Portraits', 'Commercial'],
    rating: 5.0,
    reviewCount: 18
  },
  {
    name: 'Grace Nwosu',
    photo: 'https://images.unsplash.com/photo-1764169689207-e23fb66e1fcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwZW50cmVwcmVuZXVyJTIwc21pbGluZ3xlbnwxfHx8fDE3Njk5MDAxMzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    skill: 'Content Writer',
    tags: ['Copywriting', 'SEO', 'Blogs'],
    rating: 4.8,
    reviewCount: 31
  },
  {
    name: 'David Eze',
    photo: 'https://images.unsplash.com/photo-1556745753-b2904692b3cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzZXJ2aWNlJTIwd29ya2VyfGVufDF8fHx8MTc2OTkwMDEzOHww&ixlib=rb-4.1.0&q=80&w=1080',
    skill: 'Electrician',
    tags: ['Installation', 'Repairs', 'Maintenance'],
    rating: 4.7,
    reviewCount: 15
  }
];

const featuredGigs = [
  {
    title: 'Event Setup Assistant',
    amount: '₦15,000',
    location: 'Lagos',
    duration: '1 day',
    urgent: true,
    postedBy: 'Pastor James'
  },
  {
    title: 'Data Entry Specialist',
    amount: '₦25,000',
    location: 'Remote',
    duration: '3 days',
    urgent: false,
    postedBy: 'Sister Mary'
  },
  {
    title: 'Social Media Manager',
    amount: '₦40,000',
    location: 'Abuja',
    duration: '1 week',
    urgent: false,
    postedBy: 'Brother John'
  },
  {
    title: 'Moving Helper',
    amount: '₦20,000',
    location: 'Ikeja',
    duration: '2 days',
    urgent: true,
    postedBy: 'Sister Ruth'
  }
];

export function Homepage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      {/* Highlighted Member Jobs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl mb-2">Highlighted Jobs</h2>
              <p className="text-foreground-secondary">Opportunities from our trusted members</p>
            </div>
            <Button variant="ghost" className="hidden sm:flex">
              View All
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredJobs.map((job, index) => (
              <JobCard key={index} {...job} />
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <Button variant="ghost" className="w-full">
              View All Jobs
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Services Directory Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl mb-2">Services Directory</h2>
              <p className="text-foreground-secondary">Connect with skilled Envoys offering professional services</p>
            </div>
            <Button variant="ghost" className="hidden sm:flex">
              Browse All
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <Button variant="ghost" className="w-full">
              Browse All Services
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Gigs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl mb-2">Featured Gigs</h2>
              <p className="text-foreground-secondary">Quick opportunities for immediate work</p>
            </div>
            <Button variant="ghost" className="hidden sm:flex">
              See All Gigs
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGigs.map((gig, index) => (
              <GigCard key={index} {...gig} />
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <Button variant="ghost" className="w-full">
              See All Gigs
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Community Impact Section */}
      <StatsSection />

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-deep-blue via-deep-blue-dark to-deep-blue-light text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl mb-4">
            Ready to Connect with Your Community?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join EnvoysJobs today and be part of a trusted network built on honour and excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="success" size="lg">
              Get Started Today
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white hover:text-deep-blue">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
