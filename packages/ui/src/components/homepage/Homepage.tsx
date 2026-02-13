import React from 'react';
import { ChevronRight } from 'lucide-react';
import { HeroSection } from './HeroSection';
import { JobCard } from './JobCard';
import { ServiceCard } from './ServiceCard';
import { GigCard } from './GigCard';
import { StatsSection } from './StatsSection';
import { Button } from '../Button';

interface FeaturedJob {
  id?: string;
  title: string;
  company?: string;
  location: string;
  pay: string;
  type: string;
  postedTime: string;
  fromMember?: boolean;
}

interface FeaturedService {
  id?: string;
  name: string;
  photo?: string | null;
  skill: string;
  tags: string[];
  rating: number;
  reviewCount: number;
}

interface FeaturedGig {
  id?: string;
  title: string;
  amount: string;
  location: string;
  duration: string;
  urgent?: boolean;
  postedBy: string;
}

interface HomepageProps {
  onNavigate?: (page: string, id?: string) => void;
  jobsShared?: string;
  servicesListed?: string;
  featuredJobs?: FeaturedJob[];
  featuredServices?: FeaturedService[];
  featuredGigs?: FeaturedGig[];
  webinars?: { title: string; embedUrl: string }[];
}

// Mock data
const fallbackJobs: FeaturedJob[] = [
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

const fallbackServices: FeaturedService[] = [
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

const fallbackGigs: FeaturedGig[] = [
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

export function Homepage({
  onNavigate,
  jobsShared,
  servicesListed,
  featuredJobs,
  featuredServices,
  featuredGigs,
  webinars
}: HomepageProps) {
  const jobs = featuredJobs?.length ? featuredJobs : fallbackJobs;
  const services = featuredServices?.length ? featuredServices : fallbackServices;
  const gigs = featuredGigs?.length ? featuredGigs : fallbackGigs;
  const webinarList = webinars ?? [];
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
            <Button variant="ghost" className="hidden sm:flex" onClick={() => onNavigate?.('jobs')}>
              View All
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {jobs.map((job, index) => (
              <JobCard
                key={index}
                {...job}
                onAction={() => onNavigate?.(job.id ? "job" : "jobs", job.id)}
              />
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <Button variant="ghost" className="w-full" onClick={() => onNavigate?.('jobs')}>
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
            <Button variant="ghost" className="hidden sm:flex" onClick={() => onNavigate?.('services')}>
              Browse All
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                {...service}
                onAction={() => onNavigate?.(service.id ? "service" : "services", service.id)}
              />
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <Button variant="ghost" className="w-full" onClick={() => onNavigate?.('services')}>
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
            <Button variant="ghost" className="hidden sm:flex" onClick={() => onNavigate?.('gigs')}>
              See All Gigs
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gigs.map((gig, index) => (
              <GigCard
                key={index}
                {...gig}
                onAction={() => onNavigate?.(gig.id ? "gig" : "gigs", gig.id)}
              />
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <Button variant="ghost" className="w-full" onClick={() => onNavigate?.('gigs')}>
              See All Gigs
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Community Impact Section */}
      <StatsSection jobsShared={jobsShared} servicesListed={servicesListed} />

      {/* Webinars Teaser */}
      {webinarList.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl sm:text-4xl mb-2">Community Webinars</h2>
                <p className="text-foreground-secondary">Learn, grow, and deliver with excellence.</p>
              </div>
              <Button variant="ghost" className="hidden sm:flex" onClick={() => onNavigate?.('webinars')}>
                View Library
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {webinarList.slice(0, 2).map((webinar, index) => (
                <div key={index} className="bg-white border border-border rounded-2xl p-4">
                  <div className="aspect-video w-full overflow-hidden rounded-xl border border-border">
                    <iframe
                      src={webinar.embedUrl}
                      title={webinar.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <h3 className="text-lg mt-4">{webinar.title}</h3>
                </div>
              ))}
            </div>

            <div className="mt-8 sm:hidden">
              <Button variant="ghost" className="w-full" onClick={() => onNavigate?.('webinars')}>
                View Library
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>
      )}

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
            <Button variant="success" size="lg" onClick={() => onNavigate?.('signup')}>
              Get Started Today
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-white/10 border-white text-white hover:bg-white hover:text-deep-blue"
              onClick={() => onNavigate?.('about')}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

