export type ContactMethod = "PLATFORM" | "EMAIL" | "WEBSITE" | "WHATSAPP";

export const CONTACT_LABELS: Record<ContactMethod, string> = {
  PLATFORM: "Apply on EnvoysJobs",
  EMAIL: "Apply via Email",
  WEBSITE: "Apply on Website",
  WHATSAPP: "Apply via WhatsApp"
};

export function normalizeWhatsappNumber(input?: string | null) {
  if (!input) return "";
  const digits = input.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0") && digits.length === 11) {
    return `234${digits.slice(1)}`;
  }
  return digits;
}

export function buildWhatsappUrl(number?: string | null) {
  const normalized = normalizeWhatsappNumber(number);
  return normalized ? `https://wa.me/${normalized}` : "";
}

export function buildWhatsappIntentUrl(number?: string | null, message?: string) {
  const base = buildWhatsappUrl(number);
  if (!base) return "";
  if (!message?.trim()) return base;
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}
