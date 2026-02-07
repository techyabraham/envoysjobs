import { randomUUID } from "crypto";

export type MemoryUser = {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: "ENVOY" | "HIRER" | "ADMIN";
  stewardStatus?: "PENDING" | "VERIFIED" | "REJECTED";
};

export type MemoryJob = {
  id: string;
  title: string;
  description: string;
  locationType: "ONSITE" | "REMOTE" | "HYBRID";
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  urgency?: string;
  status: "DRAFT" | "PUBLISHED" | "CLOSED";
  hirerId: string;
  createdAt: Date;
};

export type MemoryApplication = {
  id: string;
  jobId: string;
  envoyId: string;
  status: "APPLIED" | "IN_REVIEW" | "INTERVIEW" | "OFFER" | "HIRED" | "REJECTED";
  createdAt: Date;
};

export type MemoryConversation = {
  id: string;
  jobId: string;
  participants: string[];
  createdAt: Date;
};

export type MemoryMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: Date;
};

export type MemoryNotification = {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: Date;
};

export type MemorySavedJob = {
  id: string;
  userId: string;
  jobId: string;
  createdAt: Date;
};

export type MemoryRefreshToken = {
  token: string;
  userId: string;
  role: string;
  createdAt: Date;
};

export type MemoryReview = {
  id: string;
  jobId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  text?: string;
  createdAt: Date;
};

export const memoryStore = {
  users: [] as MemoryUser[],
  jobs: [] as MemoryJob[],
  applications: [] as MemoryApplication[],
  conversations: [] as MemoryConversation[],
  messages: [] as MemoryMessage[],
  notifications: [] as MemoryNotification[],
  refreshTokens: [] as MemoryRefreshToken[],
  reviews: [] as MemoryReview[],
  savedJobs: [] as MemorySavedJob[],
  reports: [] as any[]
};

export const createId = () => randomUUID();
export const useMemory = () => process.env.USE_MEMORY === "true";

export function seedMemory() {
  if (memoryStore.users.length > 0) return;

  const adminId = createId();
  const envoyId = createId();
  const hirerId = createId();

  memoryStore.users.push(
    {
      id: adminId,
      email: "admin@envoysjobs.com",
      passwordHash: "",
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
      stewardStatus: "VERIFIED"
    },
    {
      id: envoyId,
      email: "envoy@envoysjobs.com",
      passwordHash: "",
      firstName: "Tomiwa",
      lastName: "Adeyemi",
      role: "ENVOY",
      stewardStatus: "PENDING"
    },
    {
      id: hirerId,
      email: "hirer@envoysjobs.com",
      passwordHash: "",
      firstName: "Kemi",
      lastName: "Okoro",
      role: "HIRER",
      stewardStatus: "PENDING"
    }
  );

  memoryStore.jobs.push(
    {
      id: createId(),
      title: "Senior Software Engineer",
      description: "Build and maintain EnvoysJobs platform.",
      locationType: "HYBRID",
      location: "Lagos",
      salaryMin: 400000,
      salaryMax: 600000,
      urgency: "Normal",
      status: "PUBLISHED",
      hirerId,
      createdAt: new Date()
    },
    {
      id: createId(),
      title: "Event Setup Assistant",
      description: "Assist with church event setup.",
      locationType: "ONSITE",
      location: "Ibadan",
      salaryMin: 15000,
      salaryMax: 25000,
      urgency: "Urgent",
      status: "PUBLISHED",
      hirerId,
      createdAt: new Date()
    }
  );

  const conversationId = createId();
  memoryStore.conversations.push({
    id: conversationId,
    jobId: memoryStore.jobs[0].id,
    participants: [envoyId, hirerId],
    createdAt: new Date()
  });

  memoryStore.messages.push({
    id: createId(),
    conversationId,
    senderId: hirerId,
    text: "I honour you",
    createdAt: new Date()
  });

  memoryStore.notifications.push({
    id: createId(),
    userId: envoyId,
    title: "New message",
    body: "You have a new message from a hirer.",
    read: false,
    createdAt: new Date()
  });
}
