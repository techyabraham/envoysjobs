"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMemory = exports.createId = exports.memoryStore = void 0;
exports.seedMemory = seedMemory;
const crypto_1 = require("crypto");
exports.memoryStore = {
    users: [],
    jobs: [],
    applications: [],
    conversations: [],
    messages: [],
    notifications: [],
    refreshTokens: [],
    reviews: []
};
const createId = () => (0, crypto_1.randomUUID)();
exports.createId = createId;
const useMemory = () => process.env.USE_MEMORY === "true";
exports.useMemory = useMemory;
function seedMemory() {
    if (exports.memoryStore.users.length > 0)
        return;
    const adminId = (0, exports.createId)();
    const envoyId = (0, exports.createId)();
    const hirerId = (0, exports.createId)();
    exports.memoryStore.users.push({
        id: adminId,
        email: "admin@envoysjobs.com",
        passwordHash: "",
        firstName: "Admin",
        lastName: "User",
        role: "ADMIN",
        stewardStatus: "VERIFIED"
    }, {
        id: envoyId,
        email: "envoy@envoysjobs.com",
        passwordHash: "",
        firstName: "Tomiwa",
        lastName: "Adeyemi",
        role: "ENVOY",
        stewardStatus: "PENDING"
    }, {
        id: hirerId,
        email: "hirer@envoysjobs.com",
        passwordHash: "",
        firstName: "Kemi",
        lastName: "Okoro",
        role: "HIRER",
        stewardStatus: "PENDING"
    });
    exports.memoryStore.jobs.push({
        id: (0, exports.createId)(),
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
    }, {
        id: (0, exports.createId)(),
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
    });
    const conversationId = (0, exports.createId)();
    exports.memoryStore.conversations.push({
        id: conversationId,
        jobId: exports.memoryStore.jobs[0].id,
        participants: [envoyId, hirerId],
        createdAt: new Date()
    });
    exports.memoryStore.messages.push({
        id: (0, exports.createId)(),
        conversationId,
        senderId: hirerId,
        text: "I honour you",
        createdAt: new Date()
    });
    exports.memoryStore.notifications.push({
        id: (0, exports.createId)(),
        userId: envoyId,
        title: "New message",
        body: "You have a new message from a hirer.",
        read: false,
        createdAt: new Date()
    });
}
