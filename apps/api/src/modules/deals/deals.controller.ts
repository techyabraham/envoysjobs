import { Body, Controller, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { ContactMethod } from "@prisma/client";
import { z } from "zod";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { Roles } from "../../common/roles.decorator";
import { RolesGuard } from "../../common/roles.guard";
import { ZodValidationPipe } from "../../common/zod-validation.pipe";
import { DealsService } from "./deals.service";

const contactMethods = z.array(z.nativeEnum(ContactMethod)).optional();
const dealBaseSchema = z.object({
  title: z.string().trim().min(4).max(100),
  description: z.string().trim().min(10).max(3000),
  offer: z.string().trim().min(2).max(120),
  category: z.enum(["Food & drink", "Shopping", "Health & beauty", "Home & lifestyle", "Professional services", "Events", "Other"]),
  promoCode: z.string().trim().max(80).optional(),
  redemptionInstructions: z.string().trim().min(5).max(1000),
  location: z.string().trim().max(120).optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
  contactMethods,
  contactEmail: z.string().email().optional(),
  contactWebsite: z.string().url().optional(),
  contactWhatsapp: z.string().min(8).max(30).optional()
});
const validateOffer = (data: Partial<z.infer<typeof dealBaseSchema>>, ctx: z.RefinementCtx, requireContact: boolean) => {
  if (data.startsAt && data.endsAt && new Date(data.endsAt) <= new Date(data.startsAt)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["endsAt"], message: "End date must be after the start date." });
  }
  const methods = data.contactMethods ?? [];
  if (requireContact && !data.contactEmail && !data.contactWebsite && !data.contactWhatsapp) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["contactEmail"], message: "Provide at least one way for members to contact the seller." });
  }
  if (methods.includes(ContactMethod.EMAIL) && !data.contactEmail) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["contactEmail"], message: "Email is required." });
  if (methods.includes(ContactMethod.WEBSITE) && !data.contactWebsite) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["contactWebsite"], message: "Website is required." });
  if (methods.includes(ContactMethod.WHATSAPP) && !data.contactWhatsapp) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["contactWhatsapp"], message: "WhatsApp is required." });
};
const dealSchema = dealBaseSchema.superRefine((data, ctx) => validateOffer(data, ctx, true));
const dealUpdateSchema = dealBaseSchema.partial().superRefine((data, ctx) => validateOffer(data, ctx, false));
const ownerStatusSchema = z.object({ status: z.enum(["ACTIVE", "PAUSED"]) });

@Controller("deals")
@UseGuards(JwtAuthGuard)
export class DealsController {
  constructor(private deals: DealsService) {}

  @Get()
  list(@Query("q") q?: string, @Query("category") category?: string) {
    return this.deals.listActive(q, category);
  }

  @Get("mine")
  mine(@Req() req: any) {
    return this.deals.listMine(req.user.id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles("ENVOY", "HIRER")
  create(@Req() req: any, @Body(new ZodValidationPipe(dealSchema)) body: z.infer<typeof dealSchema>) {
    return this.deals.create(req.user.id, body);
  }

  @Put(":id")
  @UseGuards(RolesGuard)
  @Roles("ENVOY", "HIRER", "ADMIN")
  update(@Req() req: any, @Param("id") id: string, @Body(new ZodValidationPipe(dealUpdateSchema)) body: z.infer<typeof dealUpdateSchema>) {
    return this.deals.update(id, req.user.id, body);
  }

  @Patch(":id/status")
  @UseGuards(RolesGuard)
  @Roles("ENVOY", "HIRER")
  updateOwnStatus(@Req() req: any, @Param("id") id: string, @Body(new ZodValidationPipe(ownerStatusSchema)) body: z.infer<typeof ownerStatusSchema>) {
    return this.deals.updateOwnStatus(id, req.user.id, body.status);
  }

  @Get(":id")
  get(@Req() req: any, @Param("id") id: string) {
    return this.deals.get(id, req.user.id, req.user.role);
  }
}
