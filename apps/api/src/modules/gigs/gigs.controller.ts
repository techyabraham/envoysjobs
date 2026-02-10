import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../common/zod-validation.pipe";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { GigsService } from "./gigs.service";

const gigSchema = z.object({
  title: z.string().min(2),
  amount: z.string().min(2),
  location: z.string().min(2),
  duration: z.string().min(1),
  urgent: z.boolean().optional()
});

const gigUpdateSchema = gigSchema.partial();

@Controller("gigs")
export class GigsController {
  constructor(private gigsService: GigsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  update(
    @Req() req: any,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(gigUpdateSchema)) body: z.infer<typeof gigUpdateSchema>
  ) {
    return this.gigsService.update(id, req.user?.id || "", body);
  }

  @Post(":id/apply")
  @UseGuards(JwtAuthGuard)
  apply(@Req() req: any, @Param("id") id: string) {
    return this.gigsService.apply(id, req.user?.id || "");
  }
}
