export type Role = "ENVOY" | "HIRER" | "ADMIN";
export type HirerType = "INDIVIDUAL" | "BUSINESS";
export type JobLocationType = "ONSITE" | "REMOTE" | "HYBRID";
export type ApplicationStatus =
  | "APPLIED"
  | "IN_REVIEW"
  | "INTERVIEW"
  | "OFFER"
  | "HIRED"
  | "REJECTED";
export type StewardStatus = "PENDING" | "VERIFIED" | "REJECTED";
export type ContactMethod = "PLATFORM" | "EMAIL" | "WEBSITE" | "WHATSAPP";

export type UserDTO = {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  phone?: string | null;
};

export type EnvoyProfileDTO = {
  id: string;
  userId: string;
  bio?: string | null;
  location?: string | null;
  availability?: string | null;
  rating: number;
  verified: boolean;
  stewardStatus?: StewardStatus | null;
  stewardDepartment?: string | null;
  stewardMatricNumber?: string | null;
};

export type HirerProfileDTO = {
  id: string;
  userId: string;
  type: HirerType;
  businessName?: string | null;
  rating: number;
  stewardStatus?: StewardStatus | null;
  stewardDepartment?: string | null;
  stewardMatricNumber?: string | null;
};

export type JobDTO = {
  id: string;
  title: string;
  category: string;
  description: string;
  company?: string | null;
  locationType: JobLocationType;
  location?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  urgency?: string | null;
  status: "DRAFT" | "PUBLISHED" | "CLOSED";
  hirerId: string;
  source?: string | null;
  sourceId?: string | null;
  sourceUrl?: string | null;
  applyUrl?: string | null;
  contactMethods?: ContactMethod[];
  contactEmail?: string | null;
  contactWebsite?: string | null;
  contactWhatsapp?: string | null;
};

export type AutoMessageTemplateDTO = {
  id: string;
  key: string;
  text: string;
  audience: "ENVOY" | "HIRER" | "BOTH";
  quickReplies: string[];
  triggerRules: Record<string, unknown>;
};
