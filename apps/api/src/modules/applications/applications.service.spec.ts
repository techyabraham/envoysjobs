import { Test } from "@nestjs/testing";
import { ApplicationsService } from "./applications.service";
import { PrismaService } from "../prisma/prisma.service";
import { NotificationsService } from "../notifications/notifications.service";

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

    const moduleRef = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: NotificationsService, useValue: notificationsMock }
      ]
    }).compile();

    const service = moduleRef.get(ApplicationsService);
    await service.apply("job-1", "envoy-1");

    expect(notificationsMock.create).toHaveBeenCalledWith(
      "hirer-1",
      "New application",
      "You received a new application."
    );
  });

  it("notifies envoy on status update", async () => {
    prismaMock.application.update.mockResolvedValue({ id: "app-1", envoyId: "envoy-1" });

    const moduleRef = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: NotificationsService, useValue: notificationsMock }
      ]
    }).compile();

    const service = moduleRef.get(ApplicationsService);
    await service.updateStatus("app-1", "HIRED" as any);

    expect(notificationsMock.create).toHaveBeenCalledWith(
      "envoy-1",
      "Application update",
      "Your application is now HIRED."
    );
  });
});
