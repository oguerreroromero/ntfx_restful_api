import { Module } from '@nestjs/common';
import { SlugService } from './slug.service';

@Module({
  imports: [],
  controllers: [],
  providers: [SlugService],
})
export class SlugModule {}
