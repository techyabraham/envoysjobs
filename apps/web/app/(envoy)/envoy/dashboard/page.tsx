import DashboardShell from "@/components/DashboardShell";
import { DashboardOverview } from "@envoysjobs/ui";

export default function Page() {
  return (
    <DashboardShell userName="Grace">
      <DashboardOverview />
    </DashboardShell>
  );
}
