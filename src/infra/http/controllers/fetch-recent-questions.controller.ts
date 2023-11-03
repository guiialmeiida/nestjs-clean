import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { z } from 'zod'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryValitionPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

  @Get()
  async handle(@Query('page', queryValitionPipe) page: PageQueryParamSchema) {
    const questions = await this.fetchRecentQuestions.execute({
      page,
    })

    return { questions }
  }
}
