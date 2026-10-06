import type { Job } from "@/lib/jobs";

type JobCard = {
  id: string;
  title: string;
  company: string;
  location: string;
  pay: string;
  type: string;
  postedTime: string;
  fromMember: boolean;
  remote: boolean;
  skills: string[];
};

function postedLabel(createdAt?: string) {
  if (!createdAt) return "Recently posted";
  const timestamp = new Date(createdAt).getTime();
  if (!Number.isFinite(timestamp)) return "Recently posted";
  const days = Math.max(0, Math.floor((Date.now() - timestamp) / 86_400_000));
  if (days === 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  if (days < 30) return `Posted ${days} days ago`;
  return `Posted ${new Date(createdAt).toLocaleDateString()}`;
}

export function formatSalary(min?: number | null, max?: number | null) {
  if (min == null && max == null) return "Salary not provided";
  if (min != null && max != null) return `₦${min.toLocaleString()} – ₦${max.toLocaleString()}`;
  if (min != null) return `From ₦${min.toLocaleString()}`;
  return `Up to ₦${max?.toLocaleString()}`;
}

export function mapJobToCard(job: Job): JobCard {
  return {
    id: job.id,
    title: job.title,
    company: job.company ?? "Member employer",
    location: job.location ?? (job.locationType === "REMOTE" ? "Remote" : "Onsite"),
    pay: formatSalary(job.salaryMin, job.salaryMax),
    type: job.locationType === "REMOTE" ? "Remote" : job.locationType === "HYBRID" ? "Hybrid" : "On-site",
    postedTime: postedLabel(job.createdAt),
    fromMember: !job.source,
    remote: job.locationType === "REMOTE",
    skills: []
  };
}
