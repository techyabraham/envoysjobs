import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';

export function DemoInstructions() {
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm hidden lg:block">
      <Card className="bg-deep-blue text-white border-deep-blue-light">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Demo Instructions</h3>
            <Badge variant="gold">Live Demo</Badge>
          </div>
          <div className="text-sm text-white/90 space-y-2">
            <p><strong>Try these accounts:</strong></p>
            <ul className="space-y-1 ml-4">
              <li>• Regular user: any email</li>
              <li>• Admin: admin@envoysjobs.com</li>
            </ul>
            <p className="pt-2"><strong>Explore:</strong></p>
            <ul className="space-y-1 ml-4">
              <li>• Jobs, Services, Gigs modules</li>
              <li>• Real-time messaging UI</li>
              <li>• Admin moderation panel</li>
              <li>• Mobile responsive design</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
