import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards, UseInterceptors, UploadedFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { z } from "zod";
import { ZodValidationPipe } from "../../common/zod-validation.pipe";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { RolesGuard } from "../../common/roles.guard";
import { Roles } from "../../common/roles.decorator";
import { ServicesService } from "./services.service";

const contactMethodEnum = z.enum(["PLATFORM", "EMAIL", "WEBSITE", "WHATSAPP"]);
const contactInfoSchema = z.object({
  contactMethods: z.array(contactMethodEnum).optional(),
  contactEmail: z.string().email().optional(),
  contactWebsite: z.string().url().optional(),
  contactWhatsapp: z.string().min(8).optional()
});

function validateContact(data: { contactMethods?: string[]; contactEmail?: string; contactWebsite?: string; contactWhatsapp?: string }, ctx: z.RefinementCtx) {
  const methods = data.contactMethods ?? [];
  if (methods.includes("EMAIL") && !data.contactEmail) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["contactEmail"], message: "Email is required." });
  }
  if (methods.includes("WEBSITE") && !data.contactWebsite) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["contactWebsite"], message: "Website is required." });
  }
  if (methods.includes("WHATSAPP") && !data.contactWhatsapp) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["contactWhatsapp"], message: "WhatsApp number is required." });
  }
}

const serviceBaseSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  rate: z.string().min(2)
});

const serviceSchema = serviceBaseSchema.merge(contactInfoSchema).superRefine(validateContact);
const serviceUpdateSchema = serviceBaseSchema.partial().merge(contactInfoSchema).superRefine(validateContact);

const inquirySchema = z.object({
  method: contactMethodEnum.optional(),
  message: z.string().max(500).optional()
});

@Controller("services")
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ENVOY", "ADMIN")
  create(@Req() req: any, @Body(new ZodValidationPipe(serviceSchema)) body: z.infer<typeof serviceSchema>) {
    return this.servicesService.create({ ...body, envoyId: req.user?.id || "" });
  }

  @Get("me")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ENVOY")
  listMine(@Req() req: any) {
    return this.servicesService.listByEnvoy(req.user?.id || "");
  }

  @Get("mine")
  @UseGuards(JwtAuthGuard)
  listMyServices(@Req() req: any) {
    return this.servicesService.listByEnvoy(req.user?.id || "");
  }

  @Get()
  listAll(@Query("q") q?: string) {
    return this.servicesService.listAll(q);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.servicesService.get(id);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ENVOY", "ADMIN")
  update(
    @Req() req: any,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(serviceUpdateSchema)) body: z.infer<typeof serviceUpdateSchema>
  ) {
    return this.servicesService.update(id, req.user?.id || "", body);
  }

  @Post(":id/image")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ENVOY", "ADMIN")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png"];
        if (!allowed.includes(file.mimetype)) {
          return cb(new Error("Invalid file type"), false);
        }
        cb(null, true);
      }
    })
  )
  uploadImage(@Req() req: any, @Param("id") id: string, @UploadedFile() file: Express.Multer.File) {
    return this.servicesService.uploadImage(id, req.user?.id || "", file);
  }

  @Post(":id/inquiries")
  @UseGuards(JwtAuthGuard)
  inquire(
    @Req() req: any,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(inquirySchema)) body: z.infer<typeof inquirySchema>
  ) {
    return this.servicesService.inquire(id, req.user?.id || "", body);
  }
}
