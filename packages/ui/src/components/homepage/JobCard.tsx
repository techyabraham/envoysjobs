import React from 'react';
import { MapPin, DollarSign, Clock, Award } from 'lucide-react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';

interface JobCardProps {
  title: string;
  location: string;
  pay: string;
  type: string;
  postedTime: string;
  fromMember?: boolean;
  company?: string;
  onAction?: () => void;
}

export function JobCard({ title, location, pay, type, postedTime, fromMember, company, onAction }: JobCardProps) {
  return (
    <Card hover className="!p-4 sm:!p-5 flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1 leading-snug line-clamp-2">
            <button type="button" onClick={onAction} className="text-left rounded-sm hover:text-deep-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-blue">
              {title}
            </button>
          </h3>
          {company && company !== "EnvoysJobs" && (
            <p className="text-sm text-foreground-secondary mb-2">{company}</p>
          )}
        </div>
        {fromMember && (
          <Badge variant="gold" className="shrink-0">
            <Award className="w-3 h-3" />
            From An Envoy
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center text-sm text-foreground-secondary">
          <MapPin aria-hidden="true" className="w-4 h-4 mr-2 shrink-0" />
          {location}
        </div>
        <div className="flex items-center text-sm text-foreground-secondary">
          <DollarSign aria-hidden="true" className="w-4 h-4 mr-2 shrink-0" />
          {pay}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default">{type}</Badge>
          <span className="flex items-center text-xs text-foreground-tertiary">
            <Clock aria-hidden="true" className="w-3 h-3 mr-1" />
            {postedTime}
          </span>
        </div>
      </div>

      <div className="mt-auto">
        <Button variant="primary" size="sm" className="w-full min-h-12" onClick={onAction}>
          View job
        </Button>
      </div>
    </Card>
  );
}

