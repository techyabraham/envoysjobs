"use client";

import React, { useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import { Button } from '../Button';

interface HeaderProps {
  onNavigate?: (page: string, id?: string) => void;
  isAuthenticated?: boolean;
  userName?: string;
}

export function Header({ onNavigate, isAuthenticated, userName }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Jobs', href: 'jobs' },
    { name: 'Services', href: 'services' },
    { name: 'Gigs', href: 'gigs' },
    { name: 'About', href: 'about' }
  ];

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-5">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => onNavigate?.('home')}
              className="flex items-center text-deep-blue hover:text-deep-blue-dark transition-colors"
            >
              <img
                src="/envoysjobs.com-logo.png"
                alt="EnvoysJobs"
                className="h-16 w-auto"
              />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => onNavigate?.(item.href)}
                className="text-foreground-secondary hover:text-foreground transition-colors font-medium"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate?.('dashboard')}
                >
                  {userName ? `Hi, ${userName.split(' ')[0]}` : "Dashboard"}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onNavigate?.('profile')}
                >
                  My Account
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onNavigate?.('login')}
                >
                  Sign In
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => onNavigate?.('signup')}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground-secondary hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    onNavigate?.(item.href);
                    setMobileMenuOpen(false);
                  }}
                  className="text-foreground-secondary hover:text-foreground transition-colors font-medium text-left"
                >
                  {item.name}
                </button>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {isAuthenticated ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onNavigate?.('dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        onNavigate?.('profile');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      My Account
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        onNavigate?.('login');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      Sign In
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => {
                        onNavigate?.('signup');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}


