import { Card } from "../Card";

export function JobPreviewPage() {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h1 className="text-xl font-semibold text-foreground">Job Preview</h1>
        <p className="mt-2 text-foreground-secondary">Review details before publishing.</p>
      </Card>
    </div>
  );
}
