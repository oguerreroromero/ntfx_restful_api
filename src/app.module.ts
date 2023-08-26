import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieModule } from './movie/movie.module';
import { ReviewModule } from './review/review.module';

import { SlugModule } from './slug/slug.module';
import { DbModule } from './dbcustomqueries/db.module';

import { Movie } from './movie/movie.entity';
import { Review } from './review/review.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGODB_URI  ,
      username: process.env.DB_USER ,
      password: process.env.DB_PWD  ,
      database: process.env.DB_NAME ,
      entities: [Movie, Review],
      synchronize: true,
    }),
    MovieModule,
    SlugModule,
    DbModule,
    ReviewModule,
  ],
})
export class AppModule {}
