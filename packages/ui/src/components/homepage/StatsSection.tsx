import React from 'react';
import { Users, Briefcase, Wrench, TrendingUp } from 'lucide-react';

export function StatsSection() {
  const stats = [
    { icon: Users, label: 'Members Hired', value: '500+', color: 'text-emerald-green' },
    { icon: Wrench, label: 'Services Listed', value: '200+', color: 'text-soft-gold' },
    { icon: Briefcase, label: 'Jobs Shared', value: '1,000+', color: 'text-deep-blue' },
    { icon: TrendingUp, label: 'Success Rate', value: '95%', color: 'text-emerald-green' }
  ];

  return (
    <section className="bg-background-secondary py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl mb-4">Community Impact</h2>
          <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
            Building opportunities and strengthening connections within our Envoys community
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mb-4 ${stat.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-foreground-secondary">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

