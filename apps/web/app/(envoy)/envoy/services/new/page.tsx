"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateService } from "@/lib/services";
import { useApi } from "@/lib/useApi";
import { useSession } from "next-auth/react";
import { CONTACT_LABELS, type ContactMethod } from "@/lib/contact";

export default function Page() {
  const router = useRouter();
  const createService = useCreateService();
  const api = useApi();
  const { data: session, status } = useSession();
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (status === "loading") {
      setError("Please wait, loading session...");
      return;
    }
    const role = (session as any)?.user?.role as string | undefined;
    if (!session) {
      setError("Please sign in to create a service.");
      router.push("/auth/login");
      return;
    }
    if (role !== "ENVOY") {
      setError("Envoy account required to create services.");
      return;
    }
    try {
      const service = await createService.mutateAsync({
        title,
        description,
        rate,
        contactMethods,
        contactEmail: contactEmail || undefined,
        contactWebsite: contactWebsite || undefined,
        contactWhatsapp: contactWhatsapp || undefined
      });
      if (imageFile && service?.id) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await api(`/services/${service.id}/image`, {
          method: "POST",
          body: formData
        });
        if (uploadRes.error) throw new Error("Unable to upload image");
      }
      router.push("/envoy/services");
    } catch (err: any) {
      setError(err?.message || "Unable to save service");
    }
  };

  return (
    <DashboardShell userName="Grace">
      <PageShell title="Create Service" description="List a service for other Envoys to discover.">
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
                  setPreviewUrl(file ? URL.createObjectURL(file) : null);
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
            <button className="cta" type="submit" disabled={createService.isPending}>
              {createService.isPending ? "Saving..." : "Save Service"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => router.push("/envoy/services")}
              disabled={createService.isPending}
            >
              Cancel
            </button>
          </div>
        </form>
      </PageShell>
    </DashboardShell>
  );
}
