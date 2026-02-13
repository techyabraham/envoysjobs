"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useService, useUpdateService } from "@/lib/services";
import { useApi } from "@/lib/useApi";
import { API_BASE_URL } from "@/lib/api";
import { CONTACT_LABELS, type ContactMethod } from "@/lib/contact";

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
  const [contactMethods, setContactMethods] = useState<ContactMethod[]>(["PLATFORM"]);
  const [contactEmail, setContactEmail] = useState("");
  const [contactWebsite, setContactWebsite] = useState("");
  const [contactWhatsapp, setContactWhatsapp] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (service) {
      setTitle(service.title);
      setDescription(service.description);
      setRate(service.rate);
      setPreviewUrl(service.imageUrl ? `${API_BASE_URL}${service.imageUrl}` : null);
      setContactMethods(service.contactMethods?.length ? service.contactMethods : ["PLATFORM"]);
      setContactEmail(service.contactEmail ?? "");
      setContactWebsite(service.contactWebsite ?? "");
      setContactWhatsapp(service.contactWhatsapp ?? "");
    }
  }, [service]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await updateService.mutateAsync({
        title,
        description,
        rate,
        contactMethods,
        contactEmail: contactEmail || undefined,
        contactWebsite: contactWebsite || undefined,
        contactWhatsapp: contactWhatsapp || undefined
      });
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
          <div className="bg-background-secondary border border-border rounded-2xl p-4 space-y-3">
            <div>
              <p className="text-sm font-medium text-foreground">How should customers reach you?</p>
              <p className="text-xs text-foreground-tertiary">Select all that apply.</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 text-sm text-foreground-secondary">
              {(["PLATFORM", "EMAIL", "WEBSITE", "WHATSAPP"] as ContactMethod[]).map((method) => (
                <label key={method} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={contactMethods.includes(method)}
                    onChange={() =>
                      setContactMethods((prev) =>
                        prev.includes(method) ? prev.filter((item) => item !== method) : [...prev, method]
                      )
                    }
                  />
                  {CONTACT_LABELS[method]}
                </label>
              ))}
            </div>
            {contactMethods.includes("EMAIL") && (
              <input
                className="input"
                placeholder="Contact email"
                value={contactEmail}
                onChange={(event) => setContactEmail(event.target.value)}
              />
            )}
            {contactMethods.includes("WEBSITE") && (
              <input
                className="input"
                placeholder="Website link"
                value={contactWebsite}
                onChange={(event) => setContactWebsite(event.target.value)}
              />
            )}
            {contactMethods.includes("WHATSAPP") && (
              <input
                className="input"
                placeholder="WhatsApp number (e.g. 0803 000 0000)"
                value={contactWhatsapp}
                onChange={(event) => setContactWhatsapp(event.target.value)}
              />
            )}
          </div>
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
