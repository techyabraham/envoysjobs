import { Card } from "../Card";

export function JobApplicantsPage() {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h1 className="text-xl font-semibold text-foreground">Applicants</h1>
        <p className="mt-2 text-foreground-secondary">Review and shortlist candidates for this job.</p>
      </Card>
      <Card className="p-6">
        <p className="text-foreground-secondary">No applicants yet.</p>
      </Card>
    </div>
  );
}
