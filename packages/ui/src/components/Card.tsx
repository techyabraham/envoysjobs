"use client";

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', hover = false, onClick }: CardProps) {
  const hoverStyles = hover ? 'hover:shadow-lg transition-shadow duration-200 cursor-pointer' : '';
  
  return (
    <div 
      className={`bg-card border border-border rounded-xl p-6 shadow-sm ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}


