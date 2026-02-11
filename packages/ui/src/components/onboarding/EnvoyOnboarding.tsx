import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, User, MapPin, Briefcase, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../Button';
import { Input } from '../Input';

interface EnvoyOnboardingProps {
  onNavigate?: (page: string) => void;
  onComplete?: (data: any) => void;
  userName?: string;
  initialData?: Partial<{
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth: string;
  }>;
  lockName?: boolean;
}

type Step = 'personal' | 'skills' | 'location' | 'availability' | 'experience' | 'complete';

const skills = [
  'Web Development', 'Mobile Development', 'UI/UX Design', 'Graphic Design',
  'Content Writing', 'Copywriting', 'Digital Marketing', 'Social Media Management',
  'Photography', 'Videography', 'Video Editing', 'Animation',
  'Accounting', 'Bookkeeping', 'Financial Planning', 'Legal Services',
  'Project Management', 'Business Consulting', 'HR Consulting', 'Customer Service',
  'Data Entry', 'Virtual Assistant', 'Administrative Support', 'Translation',
  'Teaching/Tutoring', 'Music/Performance', 'Event Planning', 'Catering',
  'Plumbing', 'Electrical Work', 'Carpentry', 'Painting',
  'Cleaning Services', 'Landscaping', 'Driver', 'Logistics'
];

const nigerianStates = [
  'Lagos', 'Abuja (FCT)', 'Kano', 'Kaduna', 'Port Harcourt', 'Ibadan',
  'Benin City', 'Jos', 'Enugu', 'Abeokuta', 'Ilorin', 'Owerri', 'Onitsha',
  'Warri', 'Akure', 'Calabar', 'Uyo', 'Sokoto', 'Maiduguri', 'Bauchi'
];

export function EnvoyOnboarding({
  onNavigate,
  onComplete,
  userName = 'Friend',
  initialData,
  lockName = false
}: EnvoyOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [formData, setFormData] = useState(() => ({
    // Personal
    firstName: initialData?.firstName ?? '',
    lastName: initialData?.lastName ?? '',
    phone: initialData?.phone ?? '',
    dateOfBirth: initialData?.dateOfBirth ?? '',
    steward: 'no' as 'yes' | 'no',
    stewardDepartment: '',
    stewardDepartmentOther: '',
    stewardMatricNumber: '',
    
    // Skills
    selectedSkills: [] as string[],
    
    // Location
    state: '',
    city: '',
    willingToRelocate: false,
    openToRemote: false,
    
    // Availability
    availabilityType: 'full-time' as 'full-time' | 'part-time' | 'freelance' | 'any',
    startDate: 'immediately' as 'immediately' | '2-weeks' | '1-month' | 'flexible',
    
    // Experience
    yearsOfExperience: '0-1' as '0-1' | '1-3' | '3-5' | '5-10' | '10+',
    bio: '',
    portfolio: ''
  }));

  useEffect(() => {
    if (!initialData) return;
    setFormData((prev) => ({
      ...prev,
      firstName: prev.firstName || initialData.firstName || '',
      lastName: prev.lastName || initialData.lastName || '',
      phone: prev.phone || initialData.phone || '',
      dateOfBirth: prev.dateOfBirth || initialData.dateOfBirth || ''
    }));
  }, [initialData]);

  const steps: Step[] = ['personal', 'skills', 'location', 'availability', 'experience', 'complete'];
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

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skill)
        ? prev.selectedSkills.filter(s => s !== skill)
        : [...prev.selectedSkills, skill]
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'personal':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-deep-blue/10 rounded-full mb-4">
                <User className="w-8 h-8 text-deep-blue" />
              </div>
              <h2 className="text-3xl mb-2">Personal Information</h2>
              <p className="text-foreground-secondary">Let's start with the basics, {userName}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={lockName && Boolean(initialData?.firstName)}
                className={lockName && initialData?.firstName ? 'bg-background-tertiary text-foreground-tertiary cursor-not-allowed' : ''}
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={lockName && Boolean(initialData?.lastName)}
                className={lockName && initialData?.lastName ? 'bg-background-tertiary text-foreground-tertiary cursor-not-allowed' : ''}
              />
            </div>

            <Input
              label="Phone Number"
              type="tel"
              placeholder="+234 XXX XXX XXXX"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <Input
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
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

      case 'skills':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-deep-blue/10 rounded-full mb-4">
                <Briefcase className="w-8 h-8 text-deep-blue" />
              </div>
              <h2 className="text-3xl mb-2">Your Skills</h2>
              <p className="text-foreground-secondary">
                Select all that apply (choose at least 1, up to 10)
              </p>
              <p className="text-sm text-emerald-green mt-2">
                Selected: {formData.selectedSkills.length}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-1">
              {skills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  disabled={!formData.selectedSkills.includes(skill) && formData.selectedSkills.length >= 10}
                  className={`p-3 rounded-lg text-sm transition-all ${
                    formData.selectedSkills.includes(skill)
                      ? 'bg-deep-blue text-white'
                      : 'bg-background-secondary hover:bg-background-tertiary'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-deep-blue/10 rounded-full mb-4">
                <MapPin className="w-8 h-8 text-deep-blue" />
              </div>
              <h2 className="text-3xl mb-2">Location Preferences</h2>
              <p className="text-foreground-secondary">Where are you based?</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-3 bg-input-background border border-input-border rounded-lg focus:border-deep-blue focus:outline-none"
                >
                  <option value="">Select state</option>
                  {nigerianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <Input
                label="City/Town"
                placeholder="e.g., Ikeja"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 bg-background-secondary rounded-lg cursor-pointer hover:bg-background-tertiary transition-colors">
                <input
                  type="checkbox"
                  checked={formData.openToRemote}
                  onChange={(e) => setFormData({ ...formData, openToRemote: e.target.checked })}
                  className="w-5 h-5 rounded border-input-border text-deep-blue focus:ring-deep-blue"
                />
                <div>
                  <div className="font-medium">Open to Remote Work</div>
                  <div className="text-sm text-foreground-secondary">Work from anywhere</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 bg-background-secondary rounded-lg cursor-pointer hover:bg-background-tertiary transition-colors">
                <input
                  type="checkbox"
                  checked={formData.willingToRelocate}
                  onChange={(e) => setFormData({ ...formData, willingToRelocate: e.target.checked })}
                  className="w-5 h-5 rounded border-input-border text-deep-blue focus:ring-deep-blue"
                />
                <div>
                  <div className="font-medium">Willing to Relocate</div>
                  <div className="text-sm text-foreground-secondary">Move for the right opportunity</div>
                </div>
              </label>
            </div>
          </div>
        );

      case 'availability':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-deep-blue/10 rounded-full mb-4">
                <Clock className="w-8 h-8 text-deep-blue" />
              </div>
              <h2 className="text-3xl mb-2">Availability</h2>
              <p className="text-foreground-secondary">When are you available?</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Type of Work</label>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { value: 'full-time', label: 'Full-Time', desc: 'Permanent role' },
                  { value: 'part-time', label: 'Part-Time', desc: 'Flexible hours' },
                  { value: 'freelance', label: 'Freelance', desc: 'Project-based' },
                  { value: 'any', label: 'Any', desc: 'Open to all' }
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setFormData({ ...formData, availabilityType: type.value as any })}
                    className={`p-4 rounded-lg text-left transition-all ${
                      formData.availabilityType === type.value
                        ? 'bg-deep-blue text-white'
                        : 'bg-background-secondary hover:bg-background-tertiary'
                    }`}
                  >
                    <div className="font-medium">{type.label}</div>
                    <div className={`text-sm ${
                      formData.availabilityType === type.value ? 'text-white/80' : 'text-foreground-secondary'
                    }`}>
                      {type.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">When Can You Start?</label>
              <div className="space-y-2">
                {[
                  { value: 'immediately', label: 'Immediately', desc: 'Ready to start now' },
                  { value: '2-weeks', label: '2 Weeks Notice', desc: 'Standard notice period' },
                  { value: '1-month', label: '1 Month Notice', desc: 'Need more time' },
                  { value: 'flexible', label: 'Flexible', desc: 'Negotiable start date' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, startDate: option.value as any })}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      formData.startDate === option.value
                        ? 'bg-emerald-green text-white'
                        : 'bg-background-secondary hover:bg-background-tertiary'
                    }`}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className={`text-sm ${
                      formData.startDate === option.value ? 'text-white/80' : 'text-foreground-secondary'
                    }`}>
                      {option.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-deep-blue/10 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-deep-blue" />
              </div>
              <h2 className="text-3xl mb-2">Experience & Bio</h2>
              <p className="text-foreground-secondary">Tell us about yourself</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Years of Experience</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {['0-1', '1-3', '3-5', '5-10', '10+'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setFormData({ ...formData, yearsOfExperience: range as any })}
                    className={`p-3 rounded-lg transition-all ${
                      formData.yearsOfExperience === range
                        ? 'bg-deep-blue text-white'
                        : 'bg-background-secondary hover:bg-background-tertiary'
                    }`}
                  >
                    {range} years
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Bio <span className="text-foreground-tertiary font-normal">(Optional)</span>
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell hirers about yourself, your experience, and what makes you unique..."
                rows={5}
                className="w-full px-4 py-3 bg-input-background border border-input-border rounded-lg focus:border-deep-blue focus:outline-none resize-none"
                maxLength={500}
              />
              <p className="text-xs text-foreground-tertiary mt-1">{formData.bio.length}/500 characters</p>
            </div>

            <Input
              label="Portfolio/Website (Optional)"
              type="url"
              placeholder="https://yourportfolio.com"
              value={formData.portfolio}
              onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
            />
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
              Your profile is ready. Let's find you great opportunities!
            </p>

            <div className="bg-background-secondary rounded-2xl p-6 mb-8 text-left max-w-md mx-auto">
              <h3 className="font-semibold mb-4">What's Next?</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-green flex-shrink-0 mt-0.5" />
                  <span className="text-foreground-secondary">Browse recommended jobs</span>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-green flex-shrink-0 mt-0.5" />
                  <span className="text-foreground-secondary">Complete your verification</span>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-green flex-shrink-0 mt-0.5" />
                  <span className="text-foreground-secondary">Connect with other Envoys</span>
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
            <div className="mt-8 flex gap-4">
              <Button
                variant="success"
                size="lg"
                className="flex-1"
                onClick={handleNext}
                disabled={
                  (currentStep === 'personal' && !formData.firstName) ||
                  (currentStep === 'personal' &&
                    formData.steward === 'yes' &&
                    (!formData.stewardDepartment ||
                      !formData.stewardMatricNumber ||
                      (formData.stewardDepartment === 'OTHER' && !formData.stewardDepartmentOther))) ||
                  (currentStep === 'skills' && formData.selectedSkills.length === 0) ||
                  (currentStep === 'location' && !formData.state)
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
