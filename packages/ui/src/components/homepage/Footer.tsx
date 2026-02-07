import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    platform: [
      { name: 'Find Jobs', href: '/envoy/jobs' },
      { name: 'Browse Services', href: '/envoy/jobs' },
      { name: 'Available Gigs', href: '/envoy/jobs' },
      { name: 'Post Opportunity', href: '/hirer/jobs/new' }
    ],
    company: [
      { name: 'About Us', href: '/trust-safety' },
      { name: 'Our Mission', href: '/trust-safety' },
      { name: 'Contact', href: '/trust-safety' },
      { name: 'Support', href: '/trust-safety' }
    ],
    resources: [
      { name: 'Help Center', href: '/trust-safety' },
      { name: 'Community Guidelines', href: '/trust-safety' },
      { name: 'Terms of Service', href: '/trust-safety' },
      { name: 'Privacy Policy', href: '/trust-safety' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-deep-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/envoysjobs.com-logo.png"
                alt="EnvoysJobs"
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold">EnvoysJobs</span>
            </div>
            <p className="text-white/80 mb-6 max-w-sm">
              A trusted community platform connecting Envoys through opportunities rooted in honour, excellence, and trust.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-white/80 hover:text-white transition-colors text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-white/80 hover:text-white transition-colors text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-white/80 hover:text-white transition-colors text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              (c) 2026 EnvoysJobs. Built exclusively for RCCG The Envoys.
            </p>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Mail className="w-4 h-4" />
              <a href="mailto:hello@envoysjobs.com" className="hover:text-white transition-colors">
                hello@envoysjobs.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

