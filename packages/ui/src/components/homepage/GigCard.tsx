import React from 'react';
import { MapPin, Calendar, AlertCircle } from 'lucide-react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';

interface GigCardProps {
  title: string;
  amount: string;
  location: string;
  duration: string;
  urgent?: boolean;
  postedBy: string;
}

export function GigCard({ title, amount, location, duration, urgent, postedBy }: GigCardProps) {
  return (
    <Card hover className="flex flex-col h-full">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-foreground flex-1">{title}</h3>
        {urgent && (
          <Badge variant="urgent" className="shrink-0">
            <AlertCircle className="w-3 h-3" />
            Urgent
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-emerald-green">{amount}</span>
        </div>
        <div className="flex items-center text-sm text-foreground-secondary">
          <MapPin className="w-4 h-4 mr-2" />
          {location}
        </div>
        <div className="flex items-center text-sm text-foreground-secondary">
          <Calendar className="w-4 h-4 mr-2" />
          {duration}
        </div>
        <p className="text-xs text-foreground-tertiary mt-1">Posted by {postedBy}</p>
      </div>

      <div className="mt-auto">
        <Button variant="success" size="sm" className="w-full">
          Apply for Gig
        </Button>
      </div>
    </Card>
  );
}

