import { Controller, Body, Post } from '@nestjs/common';
//import { Request } from 'express';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create.review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async createReview(
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<object> {
    const rsp = await this.reviewService.createReview(createReviewDto);

    if (rsp) {
      return { status: 'OK' };
    }
    return { status: 'ERROR' };
  }
}
