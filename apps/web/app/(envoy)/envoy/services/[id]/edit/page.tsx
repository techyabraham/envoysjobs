"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useService, useUpdateService } from "@/lib/services";
import { useApi } from "@/lib/useApi";
import { API_BASE_URL } from "@/lib/api";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  const router = useRouter();
  const api = useApi();
  const { data: service } = useService(params.id);
  const updateService = useUpdateService(params.id);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rate, setRate] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (service) {
      setTitle(service.title);
      setDescription(service.description);
      setRate(service.rate);
      setPreviewUrl(service.imageUrl ? `${API_BASE_URL}${service.imageUrl}` : null);
    }
  }, [service]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await updateService.mutateAsync({ title, description, rate });
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await api(`/services/${params.id}/image`, {
          method: "POST",
          body: formData
        });
        if (uploadRes.error) throw new Error("Unable to upload image");
      }
      router.push("/envoy/services");
    } catch (err: any) {
      setError(err?.message || "Unable to update service");
    }
  };

  return (
    <DashboardShell userName="Grace">
      <PageShell title="Edit Service" description="Update your service listing details.">
        <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl bg-background-secondary border border-border flex items-center justify-center overflow-hidden">
              {previewUrl ? (
                <img src={previewUrl} alt="Service preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-foreground-tertiary text-sm">No image</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Service Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null;
                  setImageFile(file);
                  setPreviewUrl(file ? URL.createObjectURL(file) : previewUrl);
                }}
              />
              <p className="text-xs text-foreground-tertiary mt-1">PNG or JPG, max 5MB.</p>
            </div>
          </div>
          <input
            className="input"
            placeholder="Service title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
          <textarea
            className="input min-h-[140px]"
            placeholder="Describe your service"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
          <input
            className="input"
            placeholder="Rate or range (e.g. NGN 20,000 - 60,000)"
            value={rate}
            onChange={(event) => setRate(event.target.value)}
            required
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex flex-wrap gap-3">
            <button className="cta" type="submit" disabled={updateService.isPending}>
              {updateService.isPending ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => router.push("/envoy/services")}
              disabled={updateService.isPending}
            >
              Cancel
            </button>
          </div>
        </form>
      </PageShell>
    </DashboardShell>
  );
}
