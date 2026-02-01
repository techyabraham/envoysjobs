import React from 'react';
import { MapPin, DollarSign, Clock, Award } from 'lucide-react';
import { Card } from '@/app/components/Card';
import { Badge } from '@/app/components/Badge';
import { Button } from '@/app/components/Button';

interface JobCardProps {
  title: string;
  location: string;
  pay: string;
  type: string;
  postedTime: string;
  fromMember?: boolean;
  company?: string;
}

export function JobCard({ title, location, pay, type, postedTime, fromMember, company }: JobCardProps) {
  return (
    <Card hover className="flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
          {company && (
            <p className="text-sm text-foreground-secondary mb-2">{company}</p>
          )}
        </div>
        {fromMember && (
          <Badge variant="gold" className="shrink-0">
            <Award className="w-3 h-3" />
            From Our Members
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center text-sm text-foreground-secondary">
          <MapPin className="w-4 h-4 mr-2" />
          {location}
        </div>
        <div className="flex items-center text-sm text-foreground-secondary">
          <DollarSign className="w-4 h-4 mr-2" />
          {pay}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default">{type}</Badge>
          <span className="flex items-center text-xs text-foreground-tertiary">
            <Clock className="w-3 h-3 mr-1" />
            {postedTime}
          </span>
        </div>
      </div>

      <div className="mt-auto">
        <Button variant="primary" size="sm" className="w-full">
          Apply Now
        </Button>
      </div>
    </Card>
  );
}
