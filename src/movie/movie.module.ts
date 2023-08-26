import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';

import { Movie } from './movie.entity';
import { SlugService } from '../slug/slug.service';

@Module({
  imports: [TypeOrmModule.forFeature([Movie])],
  controllers: [MovieController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    MovieService,
    SlugService,
  ],
})
export class MovieModule {}
