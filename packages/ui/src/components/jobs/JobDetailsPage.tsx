import React, { useState } from 'react';
import { ArrowLeft, MapPin, DollarSign, Clock, Briefcase, Share2, Bookmark, Building, CheckCircle, Users } from 'lucide-react';
import { Button } from '../Button';
import { Badge } from '../Badge';

const jobData = {
  id: '1',
  title: 'Senior Full Stack Developer',
  company: 'Tech Innovations Ltd',
  companyLogo: 'Company',
  location: 'Lagos, Nigeria',
  locationType: 'Hybrid',
  salary: '₦800,000 - ₦1,200,000',
  salaryPeriod: 'per month',
  jobType: 'Full-time',
  experienceLevel: 'Senior Level',
  postedDate: '2 days ago',
  applicants: 12,
  views: 145,
  fromMember: true,
  memberVerified: true,

  description: `We're looking for a talented Senior Full Stack Developer to join our growing team. You'll work on cutting-edge projects that impact thousands of users across Nigeria and beyond.

In this role, you'll lead development efforts, mentor junior developers, and help shape our technical direction. We value clean code, collaboration, and continuous learning.`,

  responsibilities: [
    'Lead development of new features and improvements',
    'Collaborate with product and design teams',
    'Mentor and guide junior developers',
    'Write clean, maintainable, and well-tested code',
    'Participate in code reviews and technical discussions',
    'Contribute to architecture and technical decisions'
  ],

  requirements: [
    '5+ years of professional software development experience',
    'Strong expertise in React, Node.js, and TypeScript',
    'Experience with PostgreSQL or similar databases',
    'Solid understanding of REST APIs and microservices',
    'Experience with Git, CI/CD, and agile methodologies',
    'Excellent communication and collaboration skills'
  ],

  niceToHave: [
    'Experience with AWS or Azure',
    'Knowledge of Docker and Kubernetes',
    'Open source contributions',
    'Experience leading technical teams'
  ],

  benefits: [
    'Competitive salary with performance bonuses',
    'Health insurance for you and your family',
    'Flexible working hours',
    'Remote work options',
    'Professional development budget',
    'Annual team retreats',
    'Modern equipment and tools'
  ],

  skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'REST APIs', 'Git', 'Agile'],

  aboutCompany: `Tech Innovations Ltd is a leading software development company based in Lagos. We build products that solve real problems for African businesses and consumers. Our team of 50+ talented professionals works on exciting projects across fintech, edtech, and healthcare.

We believe in creating an inclusive, supportive environment where everyone can do their best work. We're proud to be a member of the RCCG The Envoys community and committed to upholding the highest standards of integrity and excellence.`,

  companySize: '50-100 employees',
  companyIndustry: 'Technology',
  companyWebsite: 'https://techinnovations.ng',
  source: 'EnvoysJobs',
  sourceUrl: '#',
  applyUrl: '#'
};

type JobDetailsData = typeof jobData;

interface JobDetailsPageProps {
  onBack?: () => void;
  onApply?: () => void;
  job?: Partial<JobDetailsData>;
  saved?: boolean;
  onToggleSave?: (next: boolean) => void;
  onMessage?: () => void;
}

export function JobDetailsPage({ onBack, onApply, job, saved, onToggleSave, onMessage }: JobDetailsPageProps) {
  const [localSaved, setLocalSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationStep, setApplicationStep] = useState<'form' | 'success'>('form');
  const data = { ...jobData, ...job };
  const isSaved = typeof saved === 'boolean' ? saved : localSaved;

  const handleApply = () => {
    setShowApplyModal(true);
  };

  const submitApplication = () => {
    setApplicationStep('success');
    setTimeout(() => {
      setShowApplyModal(false);
      setApplicationStep('form');
      onApply?.();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background-secondary">
      <div className="bg-white border-b border-border sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-foreground-secondary hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Jobs
          </button>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {data.fromMember && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-soft-gold/10 text-soft-gold rounded-lg text-sm">
                    From An Envoy
                  </div>
                )}
                {data.source && data.source !== "EnvoysJobs" && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-background-secondary text-foreground-secondary rounded-lg text-sm">
                    Source: {data.source}
                  </div>
                )}
                {data.memberVerified && (
                  <Badge variant="success">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl mb-2">{data.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-foreground-secondary">
                <div className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  <span>{data.company}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{data.location} - {data.locationType}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{data.postedDate}</span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex gap-2">
              <Button
                variant="ghost"
                onClick={() => (onToggleSave ? onToggleSave(!isSaved) : setLocalSaved(!isSaved))}
                className={isSaved ? 'text-soft-gold' : ''}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </Button>
              {data.applyUrl && data.applyUrl !== "#" && (
                <Button
                  variant="ghost"
                  onClick={() => window.open(data.applyUrl, "_blank", "noopener,noreferrer")}
                >
                  View Original
                </Button>
              )}
              <Button variant="ghost">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 text-foreground-secondary mb-2">
                    <DollarSign className="w-5 h-5" />
                    <span className="text-sm">Salary</span>
                  </div>
                  <p className="font-semibold text-lg">{data.salary}</p>
                  <p className="text-sm text-foreground-secondary">{data.salaryPeriod}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-foreground-secondary mb-2">
                    <Briefcase className="w-5 h-5" />
                    <span className="text-sm">Job Type</span>
                  </div>
                  <p className="font-semibold">{data.jobType}</p>
                  <p className="text-sm text-foreground-secondary">{data.experienceLevel}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-foreground-secondary mb-2">
                    <Users className="w-5 h-5" />
                    <span className="text-sm">Applicants</span>
                  </div>
                  <p className="font-semibold">{data.applicants} applied</p>
                  <p className="text-sm text-foreground-secondary">{data.views} views</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-foreground-secondary mb-2">
                    <MapPin className="w-5 h-5" />
                    <span className="text-sm">Location Type</span>
                  </div>
                  <p className="font-semibold">{data.locationType}</p>
                  <p className="text-sm text-foreground-secondary">{data.location}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl mb-4">Job Description</h2>
              <div className="prose prose-sm max-w-none text-foreground-secondary whitespace-pre-line">
                {data.description}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl mb-4">Responsibilities</h2>
              <ul className="space-y-3">
                {data.responsibilities.map((item, index) => (
                  <li key={index} className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-green flex-shrink-0 mt-0.5" />
                    <span className="text-foreground-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl mb-4">Requirements</h2>
              <ul className="space-y-3 mb-6">
                {data.requirements.map((item, index) => (
                  <li key={index} className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-deep-blue flex-shrink-0 mt-0.5" />
                    <span className="text-foreground-secondary">{item}</span>
                  </li>
                ))}
              </ul>

              <h3 className="font-semibold mb-3">Nice to Have</h3>
              <ul className="space-y-3">
                {data.niceToHave.map((item, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="w-5 h-5 flex items-center justify-center text-foreground-tertiary flex-shrink-0 mt-0.5">+</span>
                    <span className="text-foreground-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-deep-blue/10 text-deep-blue rounded-lg font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl mb-4">Benefits & Perks</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {data.benefits.map((benefit, index) => (
                  <li key={index} className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-green flex-shrink-0 mt-0.5" />
                    <span className="text-foreground-secondary">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl mb-4">About {data.company}</h2>
              <div className="prose prose-sm max-w-none text-foreground-secondary whitespace-pre-line mb-6">
                {data.aboutCompany}
              </div>

              <div className="grid sm:grid-cols-3 gap-4 pt-6 border-t border-border">
                <div>
                  <p className="text-sm text-foreground-tertiary mb-1">Company Size</p>
                  <p className="font-medium">{data.companySize}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground-tertiary mb-1">Industry</p>
                  <p className="font-medium">{data.companyIndustry}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground-tertiary mb-1">Website</p>
                  <a href={data.companyWebsite} className="text-deep-blue hover:text-deep-blue-dark font-medium">
                    View Site
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <Button
                variant="success"
                size="lg"
                className="w-full mb-3"
                onClick={handleApply}
              >
                Apply Now
              </Button>
              <Button
                variant="outline"
                className="w-full mb-4"
                onClick={onMessage}
              >
                Message Hirer
              </Button>

              <div className="flex gap-2 mb-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => (onToggleSave ? onToggleSave(!isSaved) : setLocalSaved(!isSaved))}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current text-soft-gold' : ''}`} />
                  {isSaved ? 'Saved' : 'Save'}
                </Button>
                <Button variant="outline">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="font-semibold mb-4">Application Tips</h3>
                <ul className="space-y-3 text-sm text-foreground-secondary">
                  <li className="flex gap-2">
                    <span>-</span>
                    <span>Tailor your application to this specific role</span>
                  </li>
                  <li className="flex gap-2">
                    <span>-</span>
                    <span>Highlight relevant experience and skills</span>
                  </li>
                  <li className="flex gap-2">
                    <span>-</span>
                    <span>Include a personalized cover letter</span>
                  </li>
                  <li className="flex gap-2">
                    <span>-</span>
                    <span>Proofread before submitting</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 z-20">
        <Button
          variant="success"
          size="lg"
          className="w-full"
          onClick={handleApply}
        >
          Apply Now
        </Button>
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            {applicationStep === 'form' ? (
              <>
                <h3 className="text-xl mb-4">Apply for {data.title}</h3>
                <p className="text-foreground-secondary mb-6 text-sm">
                  Your profile will be submitted to {data.company}. Make sure your profile is complete and up to date.
                </p>

                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-background-secondary rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-deep-blue to-emerald-green flex items-center justify-center text-white font-semibold">
                        J
                      </div>
                      <div>
                        <p className="font-semibold">John Doe</p>
                        <p className="text-sm text-foreground-secondary">john.doe@example.com</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {data.skills.slice(0, 4).map(skill => (
                        <span key={skill} className="px-2 py-1 bg-white rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Cover Letter (Optional)</label>
                    <textarea
                      rows={4}
                      placeholder="Why are you interested in this role?"
                      className="w-full px-4 py-3 bg-background-secondary border border-input-border rounded-lg focus:border-deep-blue focus:outline-none resize-none"
                    />
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 w-4 h-4 rounded border-input-border text-deep-blue focus:ring-deep-blue" />
                    <span className="text-sm text-foreground-secondary">
                      I confirm that the information in my profile is accurate and I'm interested in this position
                    </span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    className="flex-1"
                    onClick={() => setShowApplyModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="success"
                    className="flex-1"
                    onClick={submitApplication}
                  >
                    Submit Application
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-green/10 rounded-full mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-green" />
                </div>
                <h3 className="text-xl mb-2">Application Submitted!</h3>
                <p className="text-foreground-secondary">
                  You are amazing. We'll notify you when the employer reviews your application.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
