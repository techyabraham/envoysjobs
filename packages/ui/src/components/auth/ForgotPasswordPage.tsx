import React, { useState } from 'react';
import { ArrowLeft, Mail, KeyRound } from 'lucide-react';
import { Button } from '../Button';
import { Input } from '../Input';

interface ForgotPasswordPageProps {
  onNavigate?: (page: string) => void;
  onResetRequest?: (email: string) => void;
}

export function ForgotPasswordPage({ onNavigate, onResetRequest }: ForgotPasswordPageProps) {
  const [step, setStep] = useState<'email' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Mock password reset request
    onResetRequest?.(email);
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-background-secondary flex flex-col">
        <div className="p-4">
          <button
            onClick={() => onNavigate?.('login')}
            className="flex items-center gap-2 text-foreground-secondary hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Login
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-green/10 rounded-full mb-6">
              <Mail className="w-10 h-10 text-emerald-green" />
            </div>
            
            <h1 className="text-3xl mb-4">Check Your Email</h1>
            <p className="text-foreground-secondary mb-8">
              We've sent password reset instructions to<br />
              <span className="font-medium text-foreground">{email}</span>
            </p>

            <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
              <h3 className="font-semibold mb-3">What's Next?</h3>
              <ol className="text-left space-y-3 text-foreground-secondary">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-deep-blue text-white text-sm flex items-center justify-center">1</span>
                  <span>Check your email inbox (and spam folder)</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-deep-blue text-white text-sm flex items-center justify-center">2</span>
                  <span>Click the reset link in the email</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-deep-blue text-white text-sm flex items-center justify-center">3</span>
                  <span>Create your new password</span>
                </li>
              </ol>
            </div>

            <Button 
              variant="primary" 
              size="lg" 
              className="w-full"
              onClick={() => onNavigate?.('login')}
            >
              Back to Login
            </Button>

            <p className="mt-6 text-sm text-foreground-secondary">
              Didn't receive the email?{' '}
              <button
                onClick={() => setStep('email')}
                className="text-deep-blue hover:text-deep-blue-dark font-medium transition-colors"
              >
                Try again
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-secondary flex flex-col">
      {/* Back Button */}
      <div className="p-4">
        <button
          onClick={() => onNavigate?.('login')}
          className="flex items-center gap-2 text-foreground-secondary hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Login
        </button>
      </div>

      {/* Reset Form */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-deep-blue/10 rounded-full mb-6">
              <KeyRound className="w-10 h-10 text-deep-blue" />
            </div>
            <h1 className="text-3xl mb-2">Forgot Password?</h1>
            <p className="text-foreground-secondary">
              No worries! Enter your email and we'll send you reset instructions
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="email"
                label="Email Address"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                error={error}
              />

              <Button type="submit" variant="primary" size="lg" className="w-full">
                Send Reset Link
              </Button>
            </form>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center text-sm text-foreground-secondary">
            <p>
              Remember your password?{' '}
              <button
                onClick={() => onNavigate?.('login')}
                className="text-deep-blue hover:text-deep-blue-dark font-medium transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
