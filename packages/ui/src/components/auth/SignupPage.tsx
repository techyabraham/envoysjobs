"use client";

import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '../Button';
import { Input } from '../Input';

interface SignupPageProps {
  onNavigate?: (page: string) => void;
  onSignup?: (data: { firstName: string; lastName: string; email: string; password: string }) => void;
}

export function SignupPage({ onNavigate, onSignup }: SignupPageProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    location: ''
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const skills = [
    'Web Development', 'Mobile Development', 'Design', 'Marketing',
    'Writing', 'Photography', 'Video Editing', 'Accounting',
    'Project Management', 'Teaching', 'Consulting', 'Sales',
    'Customer Service', 'Data Analysis', 'Construction', 'Electrical',
    'Plumbing', 'Catering', 'Event Planning', 'Other'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = () => {
    onSignup?.({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password
    });
  };

  return (
    <div className="min-h-screen bg-background-secondary flex flex-col">
      {/* Back Button */}
      <div className="p-4">
        <button
          onClick={() => step === 1 ? onNavigate?.('home') : setStep(1)}
          className="flex items-center gap-2 text-foreground-secondary hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {step === 1 ? 'Back to Home' : 'Back'}
        </button>
      </div>

      {/* Signup Form */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-deep-blue to-emerald-green rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">E</span>
              </div>
              <span className="text-2xl font-bold text-foreground">EnvoysJobs</span>
            </div>
            <h1 className="text-3xl mb-2">Join Our Community</h1>
            <p className="text-foreground-secondary">
              {step === 1 ? 'Create your account to get started' : 'Tell us about your skills'}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`w-12 h-1 rounded-full transition-colors ${step >= 1 ? 'bg-deep-blue' : 'bg-border'}`} />
            <div className={`w-12 h-1 rounded-full transition-colors ${step >= 2 ? 'bg-deep-blue' : 'bg-border'}`} />
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            {step === 1 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="First Name"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    error={errors.firstName}
                  />
                  <Input
                    label="Last Name"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    error={errors.lastName}
                  />
                </div>

                <Input
                  type="email"
                  label="Email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                />

                <Input
                  type="password"
                  label="Password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  error={errors.password}
                />

                <Input
                  type="tel"
                  label="Phone Number (Optional)"
                  placeholder="+234 800 000 0000"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />

                <Input
                  label="Location (Optional)"
                  placeholder="e.g., Lagos, Nigeria"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />

                <Button type="button" variant="primary" size="lg" className="w-full" onClick={handleNext}>
                  Continue
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-4">
                    Select Your Skills (Optional)
                  </label>
                  <p className="text-sm text-foreground-secondary mb-4">
                    Help us connect you with the right opportunities
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {skills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${
                          selectedSkills.includes(skill)
                            ? 'bg-deep-blue text-white border-deep-blue'
                            : 'bg-background-secondary text-foreground border-border hover:border-deep-blue'
                        }`}
                      >
                        <span className="text-sm">{skill}</span>
                        {selectedSkills.includes(skill) && (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant="success"
                    size="lg"
                    className="flex-1"
                    onClick={handleSubmit}
                  >
                    Complete Signup
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Already have account */}
          {step === 1 && (
            <div className="mt-6 text-center">
              <p className="text-foreground-secondary">
                Already have an account?{' '}
                <button
                  onClick={() => onNavigate?.('login')}
                  className="text-deep-blue hover:text-deep-blue-dark font-medium transition-colors"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}

          {/* Trust Message */}
          <div className="mt-8 text-center text-sm text-foreground-secondary">
            <p>By signing up, you agree to our community guidelines</p>
            <p className="mt-1">Built with honour for RCCG The Envoys</p>
          </div>
        </div>
      </div>
    </div>
  );
}


