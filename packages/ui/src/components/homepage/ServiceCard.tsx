import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';

interface ServiceCardProps {
  name: string;
  photo?: string | null;
  skill: string;
  description?: string;
  tags?: string[];
  rating?: number;
  reviewCount?: number;
  onAction?: () => void;
}

export function ServiceCard({ name, photo, skill, description, tags, rating, reviewCount, onAction }: ServiceCardProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "EJ";
  return (
    <Card hover className="!p-4 sm:!p-5 flex flex-col h-full">
      <div className="flex items-start gap-3 mb-4">
        {photo ? (
          <img
            src={photo}
            alt=""
            className="w-14 h-14 rounded-full object-cover shrink-0"
          />
        ) : (
          <div aria-hidden="true" className="w-14 h-14 rounded-full bg-deep-blue text-white flex items-center justify-center text-lg font-semibold shrink-0">
            {initials}
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-base font-semibold text-foreground mb-1 leading-snug line-clamp-2">{skill}</h3>
          <p className="text-sm text-foreground-secondary mb-2 line-clamp-1">Provided by {name}</p>
          {rating != null && reviewCount != null && reviewCount > 0 && <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-soft-gold text-soft-gold" />
            <span className="font-medium text-foreground">{rating}</span>
            <span className="text-foreground-tertiary">({reviewCount})</span>
          </div>}
        </div>
      </div>

      {description && <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-foreground-secondary">{description}</p>}

      {tags?.length ? <div className="flex flex-wrap gap-2 mb-4">
        {tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div> : null}

      <div className="mt-auto">
        <Button variant="success" size="sm" className="w-full min-h-12" onClick={onAction}>
          View service
          <ArrowRight aria-hidden="true" className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

