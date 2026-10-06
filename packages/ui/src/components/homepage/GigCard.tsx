import React from 'react';
import { MapPin, Calendar, AlertCircle } from 'lucide-react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';

interface GigCardProps {
  title: string;
  amount: string;
  description?: string;
  location: string;
  duration: string;
  urgent?: boolean;
  postedBy: string;
  onAction?: () => void;
}

export function GigCard({ title, amount, description, location, duration, urgent, postedBy, onAction }: GigCardProps) {
  return (
    <Card hover className="!p-4 sm:!p-5 flex flex-col h-full">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold leading-snug text-foreground flex-1 line-clamp-2">
          <button type="button" onClick={onAction} className="text-left rounded-sm hover:text-deep-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-blue">{title}</button>
        </h3>
        {urgent && (
          <Badge variant="urgent" className="shrink-0">
            <AlertCircle className="w-3 h-3" />
            Urgent
          </Badge>
        )}
      </div>

      {description && <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-foreground-secondary">{description}</p>}

      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-emerald-green">{amount}</span>
        </div>
        <div className="flex items-center text-sm text-foreground-secondary">
          <MapPin aria-hidden="true" className="w-4 h-4 mr-2 shrink-0" />
          {location}
        </div>
        <div className="flex items-center text-sm text-foreground-secondary">
          <Calendar aria-hidden="true" className="w-4 h-4 mr-2 shrink-0" />
          {duration}
        </div>
        <p className="text-xs text-foreground-tertiary mt-1">Posted by {postedBy}</p>
      </div>

      <div className="mt-auto">
        <Button variant="success" size="sm" className="w-full min-h-12" onClick={onAction}>
          View gig
        </Button>
      </div>
    </Card>
  );
}

