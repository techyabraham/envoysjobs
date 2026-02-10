import React, { useState } from 'react';
import { Briefcase, UserCheck, ArrowRight } from 'lucide-react';
import { Button } from '../Button';

interface RoleSelectionPageProps {
  onNavigate?: (page: string) => void;
  onRoleSelect?: (role: 'envoy' | 'hirer') => void;
}

export function RoleSelectionPage({ onNavigate, onRoleSelect }: RoleSelectionPageProps) {
  const [selectedRole, setSelectedRole] = useState<'envoy' | 'hirer' | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect?.(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-background-secondary flex flex-col">
      {/* Progress Indicator */}
      <div className="p-4 sm:p-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 text-sm text-foreground-secondary mb-2">
            <span className="w-8 h-8 rounded-full bg-emerald-green text-white flex items-center justify-center text-xs">✓</span>
            <div className="flex-1 h-1 bg-emerald-green" />
            <span className="w-8 h-8 rounded-full bg-deep-blue text-white flex items-center justify-center text-xs">2</span>
            <div className="flex-1 h-1 bg-border" />
            <span className="w-8 h-8 rounded-full bg-border text-foreground-tertiary flex items-center justify-center text-xs">3</span>
          </div>
          <p className="text-sm text-foreground-secondary text-center">Step 2 of 3</p>
        </div>
      </div>

      {/* Role Selection */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl mb-3">How Will You Use EnvoysJobs?</h1>
            <p className="text-foreground-secondary text-lg">
              Choose your primary role to get started<br />
              <span className="text-sm">(You can do both later!)</span>
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Envoy Role */}
            <button
              onClick={() => setSelectedRole('envoy')}
              className={`bg-white rounded-2xl p-8 shadow-lg text-left transition-all ${
                selectedRole === 'envoy'
                  ? 'ring-4 ring-deep-blue scale-[1.02]'
                  : 'hover:shadow-xl hover:scale-[1.01]'
              }`}
            >
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                selectedRole === 'envoy' ? 'bg-deep-blue' : 'bg-deep-blue/10'
              }`}>
                <UserCheck className={`w-8 h-8 ${selectedRole === 'envoy' ? 'text-white' : 'text-deep-blue'}`} />
              </div>
              
              <h2 className="text-2xl mb-3">I'm an Envoy</h2>
              <p className="text-foreground-secondary mb-6">
                Looking for job opportunities, offering services, or available for gigs
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-green/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-green text-xs">✓</span>
                  </div>
                  <span className="text-foreground-secondary">Apply to jobs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-green/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-green text-xs">✓</span>
                  </div>
                  <span className="text-foreground-secondary">List your services</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-green/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-green text-xs">✓</span>
                  </div>
                  <span className="text-foreground-secondary">Find quick gigs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-green/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-green text-xs">✓</span>
                  </div>
                  <span className="text-foreground-secondary">Build your portfolio</span>
                </div>
              </div>

              {selectedRole === 'envoy' && (
                <div className="mt-6 pt-6 border-t border-border">
                  <span className="text-deep-blue font-medium flex items-center gap-2">
                    Selected <span className="text-2xl">✓</span>
                  </span>
                </div>
              )}
            </button>

            {/* Hirer Role */}
            <button
              onClick={() => setSelectedRole('hirer')}
              className={`bg-white rounded-2xl p-8 shadow-lg text-left transition-all ${
                selectedRole === 'hirer'
                  ? 'ring-4 ring-emerald-green scale-[1.02]'
                  : 'hover:shadow-xl hover:scale-[1.01]'
              }`}
            >
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                selectedRole === 'hirer' ? 'bg-emerald-green' : 'bg-emerald-green/10'
              }`}>
                <Briefcase className={`w-8 h-8 ${selectedRole === 'hirer' ? 'text-white' : 'text-emerald-green'}`} />
              </div>
              
              <h2 className="text-2xl mb-3">I'm a Hirer</h2>
              <p className="text-foreground-secondary mb-6">
                Looking to hire talent, find service providers, or post gigs
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-green/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-green text-xs">✓</span>
                  </div>
                  <span className="text-foreground-secondary">Post job openings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-green/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-green text-xs">✓</span>
                  </div>
                  <span className="text-foreground-secondary">Find service providers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-green/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-green text-xs">✓</span>
                  </div>
                  <span className="text-foreground-secondary">Post quick gigs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-green/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-green text-xs">✓</span>
                  </div>
                  <span className="text-foreground-secondary">Review applicants</span>
                </div>
              </div>

              {selectedRole === 'hirer' && (
                <div className="mt-6 pt-6 border-t border-border">
                  <span className="text-emerald-green font-medium flex items-center gap-2">
                    Selected <span className="text-2xl">✓</span>
                  </span>
                </div>
              )}
            </button>
          </div>

          {/* Continue Button */}
          <Button 
            variant={selectedRole === 'hirer' ? 'success' : 'primary'}
            size="lg" 
            className="w-full"
            disabled={!selectedRole}
            onClick={handleContinue}
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </Button>

          {/* Help Text */}
          <p className="text-center text-sm text-foreground-secondary mt-6">
            Don't worry! You can switch roles or do both anytime from your dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
