"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useMarkNotificationRead, useNotifications } from "@/lib/notifications";

export default function Page() {
  const { data, isLoading, error } = useNotifications();
  const markRead = useMarkNotificationRead();

  return (
    <DashboardShell userName="Grace">
      <PageShell title="Notifications" description="Stay updated with your activity.">
        {isLoading && <p className="text-foreground-secondary">Loading notifications...</p>}
        {error && <p className="text-destructive">Failed to load notifications.</p>}
        {!isLoading && data?.length === 0 && (
          <div className="bg-white border border-border rounded-2xl p-6">
            <p className="text-foreground-secondary">No new notifications.</p>
          </div>
        )}
        <div className="grid gap-4">
          {data?.map((notification) => (
            <div key={notification.id} className="bg-white border border-border rounded-2xl p-5 space-y-2">
              <p className="font-semibold">{notification.title}</p>
              <p className="text-sm text-foreground-secondary">{notification.body}</p>
              <div className="flex items-center gap-3">
                <span className="text-xs text-foreground-tertiary">
                  {notification.read ? "Read" : "Unread"}
                </span>
                {!notification.read && (
                  <button
                    className="btn-secondary"
                    onClick={() => markRead.mutate(notification.id)}
                  >
                    Mark Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </PageShell>
    </DashboardShell>
  );
}
