import { Card } from "../Card";

export function JobCompletePage() {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h1 className="text-xl font-semibold text-foreground">Mark Job Complete</h1>
        <p className="mt-2 text-foreground-secondary">Confirm delivery and close the job.</p>
      </Card>
    </div>
  );
}
