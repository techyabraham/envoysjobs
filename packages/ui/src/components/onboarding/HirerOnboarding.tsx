import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Building, User, Briefcase, CheckCircle } from 'lucide-react';
import { Button } from '../Button';
import { Input } from '../Input';

interface HirerOnboardingProps {
  onNavigate?: (page: string) => void;
  onComplete?: (data: any) => void;
  userName?: string;
}

type Step = 'type' | 'basic' | 'intent' | 'complete';

const industries = [
  'Technology', 'Finance', 'Healthcare', 'Education', 'Retail',
  'Manufacturing', 'Construction', 'Real Estate', 'Hospitality',
  'Transportation', 'Media & Entertainment', 'Non-Profit', 'Other'
];

const hiringNeeds = [
  'Full-time employees', 'Part-time workers', 'Freelancers/Contractors',
  'Service providers', 'Gig workers', 'Interns'
];

export function HirerOnboarding({ onNavigate, onComplete, userName = 'Friend' }: HirerOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<Step>('type');
  const [formData, setFormData] = useState({
    // Type
    hirerType: '' as 'individual' | 'business' | '',
    
    // Basic
    companyName: '',
    industry: '',
    companySize: '' as '1' | '2-10' | '11-50' | '51-200' | '200+' | '',
    website: '',
    location: '',
    steward: 'no' as 'yes' | 'no',
    stewardDepartment: '',
    stewardDepartmentOther: '',
    stewardMatricNumber: '',
    
    // Intent
    hiringNeeds: [] as string[],
    timeframe: '' as 'urgent' | 'soon' | 'planning' | '',
    budget: '' as 'flexible' | 'budget-conscious' | 'premium' | ''
  });

  const steps: Step[] = ['type', 'basic', 'intent', 'complete'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const handleComplete = () => {
    onComplete?.(formData);
  };

  const toggleHiringNeed = (need: string) => {
    setFormData(prev => ({
      ...prev,
      hiringNeeds: prev.hiringNeeds.includes(need)
        ? prev.hiringNeeds.filter(n => n !== need)
        : [...prev.hiringNeeds, need]
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'type':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl mb-2">I honour you, {userName}</h2>
              <p className="text-foreground-secondary text-lg">
                Are you hiring as an individual or business?
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Individual */}
              <button
                onClick={() => setFormData({ ...formData, hirerType: 'individual' })}
                className={`p-8 rounded-2xl text-left transition-all ${
                  formData.hirerType === 'individual'
                    ? 'bg-deep-blue text-white ring-4 ring-deep-blue scale-[1.02]'
                    : 'bg-background-secondary hover:bg-background-tertiary hover:scale-[1.01]'
                }`}
              >
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                  formData.hirerType === 'individual' ? 'bg-white/20' : 'bg-deep-blue/10'
                }`}>
                  <User className={`w-8 h-8 ${formData.hirerType === 'individual' ? 'text-white' : 'text-deep-blue'}`} />
                </div>
                
                <h3 className="text-xl mb-2">Individual</h3>
                <p className={`text-sm mb-4 ${formData.hirerType === 'individual' ? 'text-white/80' : 'text-foreground-secondary'}`}>
                  Hiring for personal needs or small projects
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={formData.hirerType === 'individual' ? 'text-white/60' : 'text-foreground-tertiary'}>
                      - Quick setup
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={formData.hirerType === 'individual' ? 'text-white/60' : 'text-foreground-tertiary'}>
                      - Perfect for gigs and services
                    </span>
                  </div>
                </div>
              </button>

              {/* Business */}
              <button
                onClick={() => setFormData({ ...formData, hirerType: 'business' })}
                className={`p-8 rounded-2xl text-left transition-all ${
                  formData.hirerType === 'business'
                    ? 'bg-emerald-green text-white ring-4 ring-emerald-green scale-[1.02]'
                    : 'bg-background-secondary hover:bg-background-tertiary hover:scale-[1.01]'
                }`}
              >
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                  formData.hirerType === 'business' ? 'bg-white/20' : 'bg-emerald-green/10'
                }`}>
                  <Building className={`w-8 h-8 ${formData.hirerType === 'business' ? 'text-white' : 'text-emerald-green'}`} />
                </div>
                
                <h3 className="text-xl mb-2">Business</h3>
                <p className={`text-sm mb-4 ${formData.hirerType === 'business' ? 'text-white/80' : 'text-foreground-secondary'}`}>
                  Hiring for company or organization
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={formData.hirerType === 'business' ? 'text-white/60' : 'text-foreground-tertiary'}>
                      - Company branding
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={formData.hirerType === 'business' ? 'text-white/60' : 'text-foreground-tertiary'}>
                      - Team management tools
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        );

      case 'basic':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-green/10 rounded-full mb-4">
                <Building className="w-8 h-8 text-emerald-green" />
              </div>
              <h2 className="text-3xl mb-2">
                {formData.hirerType === 'business' ? 'Company' : 'Basic'} Information
              </h2>
              <p className="text-foreground-secondary">Tell us about yourself</p>
            </div>

            {formData.hirerType === 'business' ? (
              <>
                <Input
                  label="Company Name"
                  placeholder="Your Company Ltd"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />

                <div>
                  <label className="block text-sm font-medium mb-2">Industry</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-input-border rounded-lg focus:border-deep-blue focus:outline-none"
                  >
                    <option value="">Select industry</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Company Size</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { value: '1', label: 'Just me' },
                      { value: '2-10', label: '2-10' },
                      { value: '11-50', label: '11-50' },
                      { value: '51-200', label: '51-200' },
                      { value: '200+', label: '200+' }
                    ].map(size => (
                      <button
                        key={size.value}
                        onClick={() => setFormData({ ...formData, companySize: size.value as any })}
                        className={`p-3 rounded-lg transition-all ${
                          formData.companySize === size.value
                            ? 'bg-emerald-green text-white'
                            : 'bg-background-secondary hover:bg-background-tertiary'
                        }`}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="Website (Optional)"
                  type="url"
                  placeholder="https://yourcompany.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </>
            ) : (
              <>
                <Input
                  label="Your Name"
                  placeholder="Full name"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />

                <div>
                  <label className="block text-sm font-medium mb-2">What do you do?</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-input-border rounded-lg focus:border-deep-blue focus:outline-none"
                  >
                    <option value="">Select one</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <Input
              label="Location"
              placeholder="Lagos, Nigeria"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />

            <div className="space-y-3">
              <label className="block text-sm font-medium">Are you a Steward at RCCG The Envoys?</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-foreground-secondary">
                  <input
                    type="radio"
                    checked={formData.steward === 'yes'}
                    onChange={() => setFormData({ ...formData, steward: 'yes' })}
                    className="h-4 w-4"
                  />
                  Yes
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground-secondary">
                  <input
                    type="radio"
                    checked={formData.steward === 'no'}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        steward: 'no',
                        stewardDepartment: '',
                        stewardDepartmentOther: '',
                        stewardMatricNumber: ''
                      })
                    }
                    className="h-4 w-4"
                  />
                  No
                </label>
              </div>
            </div>

            {formData.steward === 'yes' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Steward Department</label>
                  <select
                    value={formData.stewardDepartment}
                    onChange={(e) => setFormData({ ...formData, stewardDepartment: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-input-border rounded-lg focus:border-deep-blue focus:outline-none"
                  >
                    <option value="">Select department</option>
                    {["CHOIR", "MEDIA", "PROTOCOL", "USHERING", "CHILDREN", "OTHER"].map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {formData.stewardDepartment === 'OTHER' && (
                  <Input
                    label="Other Department"
                    placeholder="Enter department"
                    value={formData.stewardDepartmentOther}
                    onChange={(e) => setFormData({ ...formData, stewardDepartmentOther: e.target.value })}
                  />
                )}

                <Input
                  label="Steward Matric Number"
                  placeholder="e.g., RCCG-001"
                  value={formData.stewardMatricNumber}
                  onChange={(e) => setFormData({ ...formData, stewardMatricNumber: e.target.value })}
                />
              </div>
            )}
          </div>
        );

      case 'intent':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-green/10 rounded-full mb-4">
                <Briefcase className="w-8 h-8 text-emerald-green" />
              </div>
              <h2 className="text-3xl mb-2">Hiring Plans</h2>
              <p className="text-foreground-secondary">What are you looking to hire for?</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">I'm looking for: (Select all that apply)</label>
              <div className="grid sm:grid-cols-2 gap-3">
                {hiringNeeds.map(need => (
                  <button
                    key={need}
                    onClick={() => toggleHiringNeed(need)}
                    className={`p-4 rounded-lg text-left transition-all ${
                      formData.hiringNeeds.includes(need)
                        ? 'bg-emerald-green text-white'
                        : 'bg-background-secondary hover:bg-background-tertiary'
                    }`}
                  >
                    {need}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">When do you need to hire?</label>
              <div className="space-y-2">
                {[
                  { value: 'urgent', label: 'Urgently', desc: 'Within a week' },
                  { value: 'soon', label: 'Soon', desc: 'Within a month' },
                  { value: 'planning', label: 'Just Planning', desc: 'Exploring options' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, timeframe: option.value as any })}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      formData.timeframe === option.value
                        ? 'bg-deep-blue text-white'
                        : 'bg-background-secondary hover:bg-background-tertiary'
                    }`}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className={`text-sm ${
                      formData.timeframe === option.value ? 'text-white/80' : 'text-foreground-secondary'
                    }`}>
                      {option.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Budget Approach</label>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { value: 'budget-conscious', label: 'Budget-Conscious', icon: '$' },
                  { value: 'flexible', label: 'Flexible', icon: '~' },
                  { value: 'premium', label: 'Premium', icon: '*' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, budget: option.value as any })}
                    className={`p-4 rounded-lg text-center transition-all ${
                      formData.budget === option.value
                        ? 'bg-soft-gold text-white'
                        : 'bg-background-secondary hover:bg-background-tertiary'
                    }`}
                  >
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div className="font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-green/10 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-emerald-green" />
            </div>
            <h2 className="text-4xl mb-4">You Are Amazing!</h2>
            <p className="text-xl text-foreground-secondary mb-8">
              Your account is ready. Let's find the perfect talent!
            </p>

            <div className="bg-background-secondary rounded-2xl p-6 mb-8 text-left max-w-md mx-auto">
              <h3 className="font-semibold mb-4">What's Next?</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-green flex-shrink-0 mt-0.5" />
                  <span className="text-foreground-secondary">Post your first job or gig</span>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-green flex-shrink-0 mt-0.5" />
                  <span className="text-foreground-secondary">Browse available service providers</span>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-green flex-shrink-0 mt-0.5" />
                  <span className="text-foreground-secondary">Connect with talented Envoys</span>
                </div>
              </div>
            </div>

            <Button variant="success" size="lg" onClick={handleComplete}>
              Go to Dashboard
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background-secondary">
      {/* Progress Bar */}
      <div className="sticky top-0 bg-white border-b border-border z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            {currentStep !== 'complete' && (
              <button
                onClick={currentStepIndex === 0 ? () => onNavigate?.('home') : handleBack}
                className="flex items-center gap-2 text-foreground-secondary hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            )}
            <span className="text-sm text-foreground-secondary ml-auto">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-green transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
          {renderStepContent()}

          {/* Navigation */}
          {currentStep !== 'complete' && (
            <div className="mt-8">
              <Button
                variant="success"
                size="lg"
                className="w-full"
                onClick={handleNext}
                disabled={
                  (currentStep === 'type' && !formData.hirerType) ||
                  (currentStep === 'basic' && (!formData.companyName || !formData.location)) ||
                  (currentStep === 'basic' &&
                    formData.steward === 'yes' &&
                    (!formData.stewardDepartment ||
                      !formData.stewardMatricNumber ||
                      (formData.stewardDepartment === 'OTHER' && !formData.stewardDepartmentOther))) ||
                  (currentStep === 'intent' && formData.hiringNeeds.length === 0)
                }
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
