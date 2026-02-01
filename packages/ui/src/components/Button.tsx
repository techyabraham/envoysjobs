import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-deep-blue text-white hover:bg-deep-blue-dark active:scale-[0.98]',
    success: 'bg-emerald-green text-white hover:bg-emerald-green-dark active:scale-[0.98]',
    accent: 'bg-soft-gold text-white hover:bg-soft-gold-dark active:scale-[0.98]',
    outline: 'border-2 border-deep-blue text-deep-blue hover:bg-deep-blue hover:text-white',
    ghost: 'text-deep-blue hover:bg-background-secondary'
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

