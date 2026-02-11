"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useApi } from "@/lib/useApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { API_BASE_URL } from "@/lib/api";

export default function Page() {
  const api = useApi();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { data, isLoading, error } = useQuery({
    queryKey: ["hirer-profile"],
    queryFn: async () => {
      const res = await api<any>("/hirer/profile");
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    const formData = new FormData();
    formData.append("file", file);
    const res = await api<{ imageUrl: string }>("/me/avatar", {
      method: "POST",
      body: formData
    });
    setUploading(false);
    if (res.error) {
      setUploadError("Failed to upload image.");
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["hirer-profile"] });
  };

  return (
    <DashboardShell userName="Daniel">
      <PageShell title="My Profile" description="Your hirer profile.">
        {isLoading && <p className="text-foreground-secondary">Loading profile...</p>}
        {error && <p className="text-destructive">Failed to load profile.</p>}
        {data ? (
          <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-deep-blue text-white flex items-center justify-center text-lg font-semibold overflow-hidden">
                {data.user?.imageUrl ? (
                  <img
                    src={`${API_BASE_URL}${data.user.imageUrl}`}
                    alt={`${data.user?.firstName ?? "User"} profile`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{data.user?.firstName?.[0] ?? "E"}</span>
                )}
              </div>
              <div>
                <h3 className="text-xl">{data.user?.firstName} {data.user?.lastName}</h3>
                <p className="text-foreground-secondary">{data.type}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
              {uploadError && <p className="text-sm text-destructive mt-2">{uploadError}</p>}
            </div>
            {data.businessName && <p className="text-foreground-secondary">{data.businessName}</p>}
          </div>
        ) : null}
      </PageShell>
    </DashboardShell>
  );
}
