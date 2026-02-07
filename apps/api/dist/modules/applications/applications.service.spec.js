"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const applications_service_1 = require("./applications.service");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const prismaMock = {
    application: {
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn()
    },
    job: {
        findUnique: jest.fn()
    }
};
const notificationsMock = {
    create: jest.fn()
};
describe("ApplicationsService", () => {
    beforeEach(() => {
        process.env.USE_MEMORY = "false";
        jest.clearAllMocks();
    });
    it("notifies hirer when application is created", async () => {
        prismaMock.application.create.mockResolvedValue({ id: "app-1", jobId: "job-1", envoyId: "envoy-1" });
        prismaMock.job.findUnique.mockResolvedValue({ id: "job-1", hirerId: "hirer-1" });
        const moduleRef = await testing_1.Test.createTestingModule({
            providers: [
                applications_service_1.ApplicationsService,
                { provide: prisma_service_1.PrismaService, useValue: prismaMock },
                { provide: notifications_service_1.NotificationsService, useValue: notificationsMock }
            ]
        }).compile();
        const service = moduleRef.get(applications_service_1.ApplicationsService);
        await service.apply("job-1", "envoy-1");
        expect(notificationsMock.create).toHaveBeenCalledWith("hirer-1", "New application", "You received a new application.");
    });
    it("notifies envoy on status update", async () => {
        prismaMock.application.update.mockResolvedValue({ id: "app-1", envoyId: "envoy-1" });
        const moduleRef = await testing_1.Test.createTestingModule({
            providers: [
                applications_service_1.ApplicationsService,
                { provide: prisma_service_1.PrismaService, useValue: prismaMock },
                { provide: notifications_service_1.NotificationsService, useValue: notificationsMock }
            ]
        }).compile();
        const service = moduleRef.get(applications_service_1.ApplicationsService);
        await service.updateStatus("app-1", "HIRED");
        expect(notificationsMock.create).toHaveBeenCalledWith("envoy-1", "Application update", "Your application is now HIRED.");
    });
});
