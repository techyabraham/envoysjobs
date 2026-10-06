"use client";

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  const hoverStyles = hover ? 'transition-shadow duration-200 hover:shadow-lg' : '';
  
  return (
    <article className={`bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm ${hoverStyles} ${className}`}>
      {children}
    </article>
  );
}


