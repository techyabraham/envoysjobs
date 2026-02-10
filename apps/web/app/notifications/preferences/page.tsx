"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";

export default function Page() {
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(true);

  return (
    <PageShell title="Notification Preferences" description="Choose how you want to be notified.">
      <div className="bg-white border border-border rounded-2xl p-6 space-y-5">
        <div>
          <p className="text-sm text-foreground-tertiary">Preferences</p>
          <p className="text-foreground-secondary">Toggle the updates you want to receive.</p>
        </div>
        <div className="space-y-3">
          <label className="flex items-center justify-between rounded-lg bg-background-secondary px-4 py-3">
            <span>Email updates</span>
            <input type="checkbox" checked={emailUpdates} onChange={(e) => setEmailUpdates(e.target.checked)} />
          </label>
          <label className="flex items-center justify-between rounded-lg bg-background-secondary px-4 py-3">
            <span>Message alerts</span>
            <input type="checkbox" checked={messageAlerts} onChange={(e) => setMessageAlerts(e.target.checked)} />
          </label>
          <label className="flex items-center justify-between rounded-lg bg-background-secondary px-4 py-3">
            <span>Job recommendations</span>
            <input type="checkbox" checked={jobAlerts} onChange={(e) => setJobAlerts(e.target.checked)} />
          </label>
        </div>
      </div>
    </PageShell>
  );
}
