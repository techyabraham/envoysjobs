import React, { useEffect, useState } from 'react';
import { Search, MapPin, DollarSign, Briefcase, Clock, Bookmark, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { JobCard } from '../homepage/JobCard';

interface JobDiscoveryPageProps {
  onJobClick?: (jobId: string) => void;
  jobs?: typeof mockJobs;
  savedJobIds?: string[];
  onToggleSave?: (jobId: string) => void;
}

const mockJobs = [
  {
    id: '1',
    title: 'Senior Full Stack Developer',
    company: 'Tech Innovations Ltd',
    location: 'Lagos, Nigeria',
    pay: '₦800,000 - ₦1,200,000/month',
    type: 'Full-time',
    postedTime: '2 hours ago',
    fromMember: true,
    remote: true,
    skills: ['React', 'Node.js', 'TypeScript'],
    applicants: 12
  },
  {
    id: '2',
    title: 'UI/UX Designer',
    company: 'Creative Agency',
    location: 'Abuja, Nigeria',
    pay: '₦400,000 - ₦600,000/month',
    type: 'Full-time',
    postedTime: '5 hours ago',
    fromMember: true,
    remote: false,
    skills: ['Figma', 'Adobe XD', 'User Research'],
    applicants: 8
  },
  {
    id: '3',
    title: 'Content Writer',
    company: 'Digital Marketing Co',
    location: 'Remote',
    pay: '₦250,000 - ₦400,000/month',
    type: 'Part-time',
    postedTime: '1 day ago',
    fromMember: false,
    remote: true,
    skills: ['SEO', 'Copywriting', 'Content Strategy'],
    applicants: 24
  },
  {
    id: '4',
    title: 'Project Manager',
    company: 'Construction Experts',
    location: 'Port Harcourt, Nigeria',
    pay: '₦600,000 - ₦900,000/month',
    type: 'Full-time',
    postedTime: '2 days ago',
    fromMember: true,
    remote: false,
    skills: ['Agile', 'Leadership', 'Budget Management'],
    applicants: 15
  },
  {
    id: '5',
    title: 'Mobile App Developer',
    company: 'StartUp Hub',
    location: 'Lagos, Nigeria',
    pay: '₦500,000 - ₦800,000/month',
    type: 'Contract',
    postedTime: '3 days ago',
    fromMember: true,
    remote: true,
    skills: ['React Native', 'iOS', 'Android'],
    applicants: 19
  },
  {
    id: '6',
    title: 'Accountant',
    company: 'Finance Solutions',
    location: 'Ibadan, Nigeria',
    pay: '₦300,000 - ₦500,000/month',
    type: 'Full-time',
    postedTime: '4 days ago',
    fromMember: false,
    remote: false,
    skills: ['QuickBooks', 'Tax Planning', 'Financial Analysis'],
    applicants: 31
  }
];

export function JobDiscoveryPage({ onJobClick, jobs, savedJobIds, onToggleSave }: JobDiscoveryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState<string[]>(savedJobIds ?? []);
  const [filters, setFilters] = useState({
    location: '',
    jobType: [] as string[],
    remote: false,
    membersOnly: false,
    salaryMin: '',
    salaryMax: ''
  });

  const [activeTab, setActiveTab] = useState<'all' | 'recommended' | 'saved'>('all');
  useEffect(() => {
    if (savedJobIds) {
      setSavedJobs(savedJobIds);
    }
  }, [savedJobIds]);

  const toggleSaveJob = (jobId: string) => {
    if (onToggleSave) {
      onToggleSave(jobId);
      return;
    }
    setSavedJobs(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  const toggleJobType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      jobType: prev.jobType.includes(type)
        ? prev.jobType.filter(t => t !== type)
        : [...prev.jobType, type]
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      jobType: [],
      remote: false,
      membersOnly: false,
      salaryMin: '',
      salaryMax: ''
    });
  };

  const activeFiltersCount = 
    (filters.location ? 1 : 0) +
    filters.jobType.length +
    (filters.remote ? 1 : 0) +
    (filters.membersOnly ? 1 : 0) +
    (filters.salaryMin || filters.salaryMax ? 1 : 0);

  const sourceJobs = jobs ?? mockJobs;
  const effectiveSaved = savedJobIds ?? savedJobs;
  const filteredJobs = sourceJobs.filter(job => {
    if (activeTab === 'saved' && !effectiveSaved.includes(job.id)) return false;
    if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !job.company.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.jobType.length > 0 && !filters.jobType.includes(job.type)) return false;
    if (filters.remote && !job.remote) return false;
    if (filters.membersOnly && !job.fromMember) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background-secondary">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl mb-4">Discover Jobs</h1>
          
          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground-tertiary" />
              <input
                type="text"
                placeholder="Search jobs, companies, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background-secondary rounded-lg border border-transparent focus:border-deep-blue focus:outline-none"
              />
            </div>
            <Button
              variant={activeFiltersCount > 0 ? 'primary' : 'outline'}
              onClick={() => setShowFilters(!showFilters)}
              className="relative"
            >
              <SlidersHorizontal className="w-5 h-5" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-green text-white text-xs rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'all'
                  ? 'bg-deep-blue text-white'
                  : 'bg-background-secondary hover:bg-background-tertiary'
              }`}
            >
              All Jobs ({sourceJobs.length})
            </button>
            <button
              onClick={() => setActiveTab('recommended')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'recommended'
                  ? 'bg-deep-blue text-white'
                  : 'bg-background-secondary hover:bg-background-tertiary'
              }`}
            >
              Recommended (4)
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'saved'
                  ? 'bg-deep-blue text-white'
                  : 'bg-background-secondary hover:bg-background-tertiary'
              }`}
            >
              Saved ({effectiveSaved.length})
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = "/jobs/filters")}
            >
              Advanced Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = "/jobs/recommended")}
            >
              Recommended
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = "/jobs/location?q=lagos")}
            >
              Lagos Opportunities
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              <div className="flex gap-2">
                <button
                  onClick={clearFilters}
                  className="text-sm text-foreground-secondary hover:text-foreground"
                >
                  Clear All
                </button>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5 text-foreground-secondary hover:text-foreground" />
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-tertiary" />
                  <input
                    type="text"
                    placeholder="City or state"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-background-secondary rounded-lg border border-input-border focus:border-deep-blue focus:outline-none text-sm"
                  />
                </div>
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Job Type</label>
                <div className="flex flex-wrap gap-2">
                  {['Full-time', 'Part-time', 'Contract', 'Freelance'].map(type => (
                    <button
                      key={type}
                      onClick={() => toggleJobType(type)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        filters.jobType.includes(type)
                          ? 'bg-deep-blue text-white'
                          : 'bg-background-secondary hover:bg-background-tertiary'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div>
                <label className="block text-sm font-medium mb-2">Salary Range (₦)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.salaryMin}
                    onChange={(e) => setFilters({ ...filters, salaryMin: e.target.value })}
                    className="w-full px-3 py-2 bg-background-secondary rounded-lg border border-input-border focus:border-deep-blue focus:outline-none text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.salaryMax}
                    onChange={(e) => setFilters({ ...filters, salaryMax: e.target.value })}
                    className="w-full px-3 py-2 bg-background-secondary rounded-lg border border-input-border focus:border-deep-blue focus:outline-none text-sm"
                  />
                </div>
              </div>

              {/* Quick Filters */}
              <div>
                <label className="block text-sm font-medium mb-2">Quick Filters</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.remote}
                      onChange={(e) => setFilters({ ...filters, remote: e.target.checked })}
                      className="w-4 h-4 rounded border-input-border text-deep-blue focus:ring-deep-blue"
                    />
                    <span className="text-sm">Remote Only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.membersOnly}
                      onChange={(e) => setFilters({ ...filters, membersOnly: e.target.checked })}
                      className="w-4 h-4 rounded border-input-border text-soft-gold focus:ring-soft-gold"
                    />
                    <span className="text-sm">From Members Only</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-foreground-secondary">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
          </p>
          <select className="px-3 py-2 bg-white rounded-lg border border-border text-sm focus:outline-none focus:border-deep-blue">
            <option>Most Recent</option>
            <option>Best Match</option>
            <option>Highest Salary</option>
            <option>Most Applicants</option>
          </select>
        </div>

        {/* Job Listings */}
        {filteredJobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="relative group">
                <div
                  onClick={() => onJobClick?.(job.id)}
                  className="cursor-pointer"
                >
                  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                    {/* Member Badge */}
                    {job.fromMember && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-soft-gold/10 text-soft-gold rounded-lg text-xs mb-3">
                        ⭐ From Our Members
                      </div>
                    )}

                    {/* Company & Title */}
                    <h3 className="font-semibold mb-1 line-clamp-2">{job.title}</h3>
                    <p className="text-sm text-foreground-secondary mb-4">{job.company}</p>

                    {/* Details */}
                    <div className="space-y-2 text-sm text-foreground-secondary mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium text-foreground">{job.pay}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>{job.type} • {job.postedTime}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.slice(0, 3).map(skill => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-background-secondary rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-xs text-foreground-tertiary">
                        {job.applicants} applicants
                      </span>
                      {job.remote && (
                        <Badge variant="success" className="text-xs">Remote</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaveJob(job.id);
                  }}
                  className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    effectiveSaved.includes(job.id)
                      ? 'bg-soft-gold text-white'
                      : 'bg-white/90 text-foreground-secondary hover:bg-white hover:text-soft-gold'
                  } shadow-sm`}
                >
                  <Bookmark className={`w-5 h-5 ${effectiveSaved.includes(job.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-background-tertiary rounded-full mb-4">
              <Briefcase className="w-8 h-8 text-foreground-tertiary" />
            </div>
            <h3 className="text-xl mb-2">No Jobs Found</h3>
            <p className="text-foreground-secondary mb-6">
              Try adjusting your filters or search terms
            </p>
            <Button variant="primary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
