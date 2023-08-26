import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { validate } from 'class-validator';
import { CreateReviewDto } from './dto/create.review.dto';
import { DbService } from '../dbcustomqueries/db.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private readonly dbService: DbService,
  ) {}

  async createReview(createReviewObj: CreateReviewDto) {
    const validationErrors = await validate(createReviewObj);

    if (validationErrors.length > 0) {
      throw new BadRequestException('Validation failed');
    }

    const review = this.reviewRepository.create(createReviewObj);

    const rsp = await this.reviewRepository.save(review);

    /*const newScore = */ await this.setScore(rsp.movie_id.toString());

    return rsp;
  }

/**
   * Actualiza el promedio de calificación de cada película
   * 
   * async function (params(1)) return []
   * 
   * @param   idMovie : string - Es el _id en formato string de la película. Se hará
   *                            la conversión a tipo ObjectId para hacer la búsqueda.
   * 
   * @returns []      : array  - Es el resultado del comando. El pipeline actualiza 
   *                            directamente la base de datos mediante $merge, por lo
   *                            cual no hay retorno.
   * 
*/

  async setScore(idMovie: string) {
    const objectIDParam = new ObjectId(idMovie);

    const setScoreCommand = await this.dbService.cAggregate('reviews', [
      {
        $match: {
          movie_id: objectIDParam,
        },
      },
      {
        $group: {
          _id: '$movie_id',
          score: { $avg: { $ifNull: ['$score', 0] } },
          total_votaciones: { $sum: 1 },
          total_general: { $sum: { $ifNull: ['$score', 0] } },
        },
      },
      {
        $project: {
          score: { $round: ['$score', 1] },
          total_votaciones: 1,
          total_general: 1,
        },
      },
      {
        $merge: {
          into: 'movies',
          on: '_id',
          whenMatched: 'merge',
          whenNotMatched: 'discard',
        },
      },
    ]);

    return setScoreCommand;
  }
}
