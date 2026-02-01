import React, { useState } from 'react';
import { Search, Briefcase, Wrench, Zap } from 'lucide-react';
import { Button } from '../Button';

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filters = [
    { id: 'all', label: 'All', icon: Search },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'gigs', label: 'Gigs', icon: Zap }
  ];

  return (
    <section className="relative bg-gradient-to-br from-deep-blue via-deep-blue-dark to-deep-blue-light text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-soft-gold rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-green rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6">
            Where Envoys Hire, Serve, and Get Hired.
          </h1>
          
          {/* Subtext */}
          <p className="text-xl sm:text-2xl mb-12 text-white/90">
            Connecting Envoys in need to Envoys who deliver.
          </p>

          {/* Unified Search Bar */}
          <div className="bg-white rounded-2xl p-2 shadow-2xl mb-8">
            <div className="flex flex-col lg:flex-row gap-2">
              <div className="flex-1 flex items-center px-4 py-3 bg-background-secondary rounded-xl">
                <Search className="w-5 h-5 text-foreground-secondary mr-3" />
                <input
                  type="text"
                  placeholder="Search jobs, services, or gigs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-foreground-tertiary"
                />
              </div>
              <Button variant="success" size="lg" className="lg:w-auto">
                Search
              </Button>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2 mt-3 px-2">
              {filters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      activeFilter === filter.id
                        ? 'bg-deep-blue text-white'
                        : 'bg-background-secondary text-foreground hover:bg-background-tertiary'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{filter.label}</span>
                  </button>
                );
              })}
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-soft-gold/10 text-soft-gold border border-soft-gold/30 hover:bg-soft-gold/20 transition-all">
                <span className="text-sm font-medium">From Envoys</span>
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="success" size="lg" className="w-full sm:w-auto">
              Post a Job
            </Button>
            <Button variant="accent" size="lg" className="w-full sm:w-auto">
              Offer Your Service
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 border-white text-white hover:bg-white hover:text-deep-blue">
              Find a Gig
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

