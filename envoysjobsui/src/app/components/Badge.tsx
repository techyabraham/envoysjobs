import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'gold' | 'outline' | 'urgent';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variantStyles = {
    default: 'bg-background-secondary text-foreground-secondary',
    success: 'bg-emerald-green/10 text-emerald-green-dark',
    gold: 'bg-soft-gold/10 text-soft-gold-dark border border-soft-gold/30',
    outline: 'border border-border text-foreground-secondary',
    urgent: 'bg-destructive/10 text-destructive'
  };
  
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
