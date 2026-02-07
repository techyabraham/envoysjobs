import { Card } from "../Card";

export function JobReviewPage() {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h1 className="text-xl font-semibold text-foreground">Leave a Review</h1>
        <p className="mt-2 text-foreground-secondary">Share feedback for the completed job.</p>
      </Card>
    </div>
  );
}
