import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../common/zod-validation.pipe";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { Roles } from "../../common/roles.decorator";
import { RolesGuard } from "../../common/roles.guard";
import { GigsService } from "./gigs.service";

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

const gigBaseSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  amount: z.string().min(2),
  location: z.string().min(2),
  duration: z.string().min(1),
  urgent: z.boolean().optional()
});

const gigSchema = gigBaseSchema.merge(contactInfoSchema).superRefine(validateContact);
const gigUpdateSchema = gigBaseSchema.partial().merge(contactInfoSchema).superRefine(validateContact);
const gigApplySchema = z.object({
  counterBudget: z.string().min(1).max(120).optional()
});

@Controller("gigs")
export class GigsController {
  constructor(private gigsService: GigsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ENVOY", "ADMIN")
  create(@Req() req: any, @Body(new ZodValidationPipe(gigSchema)) body: z.infer<typeof gigSchema>) {
    return this.gigsService.create({ ...body, postedById: req.user?.id || "" });
  }

  @Get()
  list(@Query("excludeMine") excludeMine?: string, @Req() req?: any) {
    const exclude = excludeMine === "true";
    return this.gigsService.list({
      excludeMine: exclude,
      userId: req?.user?.id
    });
  }

  @Get("mine")
  @UseGuards(JwtAuthGuard)
  listMine(@Req() req: any) {
    return this.gigsService.listByUser(req.user?.id || "");
  }

  @Get("applied")
  @UseGuards(JwtAuthGuard)
  listApplied(@Req() req: any) {
    return this.gigsService.listApplied(req.user?.id || "");
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.gigsService.get(id);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ENVOY", "ADMIN")
  update(
    @Req() req: any,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(gigUpdateSchema)) body: z.infer<typeof gigUpdateSchema>
  ) {
    return this.gigsService.update(id, req.user?.id || "", body);
  }

  @Post(":id/apply")
  @UseGuards(JwtAuthGuard)
  apply(
    @Req() req: any,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(gigApplySchema)) body: z.infer<typeof gigApplySchema>
  ) {
    return this.gigsService.apply(id, req.user?.id || "", body.counterBudget);
  }
}
