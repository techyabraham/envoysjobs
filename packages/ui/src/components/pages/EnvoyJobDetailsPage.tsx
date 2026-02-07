import { Card } from "../Card";

export function EnvoyJobDetailsPage() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold text-foreground">Job Details</h1>
        <p className="mt-2 text-foreground-secondary">Senior Developer - Lagos (Hybrid)</p>
        <div className="mt-4 space-y-2 text-sm text-foreground-secondary">
          <p>Budget: ?400k - ?600k</p>
          <p>Posted 2 days ago ? 12 applicants</p>
        </div>
      </Card>
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground">Description</h2>
        <p className="mt-2 text-foreground-secondary">Build and maintain a production-ready platform for EnvoysJobs.</p>
      </Card>
    </div>
  );
}
