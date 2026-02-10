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
  applicants: number;
};

export function formatSalary(min?: number | null, max?: number | null) {
  if (min == null && max == null) return "Negotiable";
  if (min != null && max != null) return `₦${min.toLocaleString()} - ₦${max.toLocaleString()}/month`;
  if (min != null) return `₦${min.toLocaleString()}/month`;
  return `₦${max?.toLocaleString()}/month`;
}

export function mapJobToCard(job: Job): JobCard {
  return {
    id: job.id,
    title: job.title,
    company: "EnvoysJobs",
    location: job.location ?? (job.locationType === "REMOTE" ? "Remote" : "Onsite"),
    pay: formatSalary(job.salaryMin, job.salaryMax),
    type: "Full-time",
    postedTime: "Recently",
    fromMember: false,
    remote: job.locationType === "REMOTE",
    skills: [],
    applicants: 0
  };
}
