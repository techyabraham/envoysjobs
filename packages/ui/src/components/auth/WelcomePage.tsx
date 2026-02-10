import React from 'react';
import { Sparkles, Briefcase, Users, Zap } from 'lucide-react';
import { Button } from '../Button';

interface WelcomePageProps {
  onNavigate?: (page: string) => void;
}

export function WelcomePage({ onNavigate }: WelcomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-blue via-deep-blue-dark to-deep-blue-light text-white">
      <div className="min-h-screen flex flex-col px-4 py-8">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <img
            src="/envoysjobs.com-logo.png"
            alt="EnvoysJobs"
            className="h-12 w-auto"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center">
          <div className="mb-8">
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-soft-gold" />
            <h1 className="text-4xl sm:text-5xl mb-4">
              Welcome to<br />EnvoysJobs
            </h1>
            <p className="text-xl text-white/80">
              Your trusted community for opportunities, built with honour for RCCG The Envoys
            </p>
          </div>

          {/* Features */}
          <div className="w-full space-y-4 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-green/20 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5 text-emerald-green-light" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold mb-1">Find Trusted Opportunities</h3>
                <p className="text-sm text-white/70">Connect with jobs, services, and gigs within the community</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-soft-gold/20 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-soft-gold-light" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold mb-1">Honour-Based Network</h3>
                <p className="text-sm text-white/70">Work with verified members who share your values</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-green/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-emerald-green-light" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold mb-1">Quick & Simple</h3>
                <p className="text-sm text-white/70">Start connecting in minutes with our easy setup</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="w-full space-y-3">
            <Button 
              variant="success" 
              size="lg" 
              className="w-full"
              onClick={() => onNavigate?.('signup')}
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full bg-white/10 border-white text-white hover:bg-white hover:text-deep-blue"
              onClick={() => onNavigate?.('login')}
            >
              I Have an Account
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-white/60 mt-8">
          <p>Built with honour for RCCG The Envoys</p>
        </div>
      </div>
    </div>
  );
}
