import React from 'react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="w-12 h-12 border-4 border-deep-blue/20 border-t-deep-blue rounded-full animate-spin" />
      <p className="text-foreground-secondary">{message}</p>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
      {icon && (
        <div className="text-foreground-tertiary mb-2">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="text-foreground-secondary max-w-md">{description}</p>
      )}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}

