import React from 'react';
import { Star, MessageCircle } from 'lucide-react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';

interface ServiceCardProps {
  name: string;
  photo?: string | null;
  skill: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  onAction?: () => void;
}

export function ServiceCard({ name, photo, skill, tags, rating, reviewCount, onAction }: ServiceCardProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "EJ";
  return (
    <Card hover className="flex flex-col h-full" onClick={onAction}>
      <div className="flex items-start gap-4 mb-4">
        {photo ? (
          <img
            src={photo}
            alt={name}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-deep-blue text-white flex items-center justify-center text-lg font-semibold">
            {initials}
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-base font-semibold text-foreground mb-1">{name}</h3>
          <p className="text-sm text-foreground-secondary mb-2">{skill}</p>
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-soft-gold text-soft-gold" />
            <span className="font-medium text-foreground">{rating}</span>
            <span className="text-foreground-tertiary">({reviewCount})</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <Badge key={index} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="mt-auto">
        <Button variant="success" size="sm" className="w-full" onClick={onAction}>
          <MessageCircle className="w-4 h-4" />
          Quick Connect
        </Button>
      </div>
    </Card>
  );
}

