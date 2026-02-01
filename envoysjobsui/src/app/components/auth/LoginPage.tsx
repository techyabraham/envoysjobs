import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/Button';
import { Input } from '@/app/components/Input';

interface LoginPageProps {
  onNavigate?: (page: string) => void;
  onLogin?: (email: string) => void;
}

export function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Mock login
    onLogin?.(email);
  };

  return (
    <div className="min-h-screen bg-background-secondary flex flex-col">
      {/* Back Button */}
      <div className="p-4">
        <button
          onClick={() => onNavigate?.('home')}
          className="flex items-center gap-2 text-foreground-secondary hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-deep-blue to-emerald-green rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">E</span>
              </div>
              <span className="text-2xl font-bold text-foreground">EnvoysJobs</span>
            </div>
            <h1 className="text-3xl mb-2">Welcome Back</h1>
            <p className="text-foreground-secondary">Sign in to continue your journey</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="email"
                label="Email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />

              <Input
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-foreground-secondary cursor-pointer">
                  <input type="checkbox" className="rounded border-input-border" />
                  Remember me
                </label>
                <button
                  type="button"
                  className="text-sm text-deep-blue hover:text-deep-blue-dark transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full">
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-foreground-secondary">
                Don't have an account?{' '}
                <button
                  onClick={() => onNavigate?.('signup')}
                  className="text-deep-blue hover:text-deep-blue-dark font-medium transition-colors"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>

          {/* Trust Message */}
          <div className="mt-8 text-center text-sm text-foreground-secondary">
            <p>By signing in, you agree to our community guidelines</p>
            <p className="mt-1">Built with honour for RCCG The Envoys</p>
          </div>
        </div>
      </div>
    </div>
  );
}
