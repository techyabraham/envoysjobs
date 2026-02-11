import { Body, Controller, Get, Param, Post, Put, Req, UseGuards, UseInterceptors, UploadedFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { z } from "zod";
import { ZodValidationPipe } from "../../common/zod-validation.pipe";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { RolesGuard } from "../../common/roles.guard";
import { Roles } from "../../common/roles.decorator";
import { ServicesService } from "./services.service";

const serviceSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  rate: z.string().min(2)
});

const serviceUpdateSchema = serviceSchema.partial();

@Controller("services")
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ENVOY")
  create(@Req() req: any, @Body(new ZodValidationPipe(serviceSchema)) body: z.infer<typeof serviceSchema>) {
    return this.servicesService.create({ ...body, envoyId: req.user?.id || "" });
  }

  @Get("me")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ENVOY")
  listMine(@Req() req: any) {
    return this.servicesService.listByEnvoy(req.user?.id || "");
  }

  @Get()
  listAll() {
    return this.servicesService.listAll();
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.servicesService.get(id);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ENVOY")
  update(
    @Req() req: any,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(serviceUpdateSchema)) body: z.infer<typeof serviceUpdateSchema>
  ) {
    return this.servicesService.update(id, req.user?.id || "", body);
  }

  @Post(":id/image")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ENVOY")
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
}
