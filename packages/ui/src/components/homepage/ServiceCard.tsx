import React from 'react';
import { Star, MessageCircle } from 'lucide-react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';

interface ServiceCardProps {
  name: string;
  photo: string;
  skill: string;
  tags: string[];
  rating: number;
  reviewCount: number;
}

export function ServiceCard({ name, photo, skill, tags, rating, reviewCount }: ServiceCardProps) {
  return (
    <Card hover className="flex flex-col h-full">
      <div className="flex items-start gap-4 mb-4">
        <img
          src={photo}
          alt={name}
          className="w-16 h-16 rounded-full object-cover"
        />
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
        <Button variant="success" size="sm" className="w-full">
          <MessageCircle className="w-4 h-4" />
          Quick Connect
        </Button>
      </div>
    </Card>
  );
}

