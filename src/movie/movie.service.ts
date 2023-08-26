import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import { validate } from 'class-validator';
import { CreateMovieDto } from './dto/create.movie.dto';
import { UpdateMovieDto } from './dto/update.movie.dto';
import { SlugService } from '../slug/slug.service';
import { DbService } from '../dbcustomqueries/db.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    private readonly slugService: SlugService,
    private readonly dbService: DbService,
  ) {}

  async listAllMovies(limit?: number, page?: number) {
    let _page: number = 1;
    let _limit: number = 50;
    let _skip: number = 0;
    if (page && page > 0) {
      _page = Number(page);
    }

    if (limit && limit > 0) {
      _limit = Number(limit);
    }

    _skip = (_page - 1) * _limit;

    const movies = await this.moviesRepository.find({
      skip: _skip,
      take: _limit,
    });

    const moviesRsp = movies.map((movie) => ({
      id : movie._id,//para efectos de las pruebas
      title: movie.title,
      director: movie.director,
      score: movie.score,
      slug: movie.slug,
      image: movie.image,
    }));

    return moviesRsp;
  }

 

  async getById(id: string) {
    const objectIDParam = new ObjectId(id);

    const movieDetail = await this.moviesRepository.findOne({
      where: {
        _id: objectIDParam,
      },
    });

    if (!movieDetail) {
      throw new NotFoundException('Película no encontrada.');
    }

    const rspMovie = {
      id : movieDetail._id,//para hacer las pruebas
      title: movieDetail.title,
      director: movieDetail.director,
      score: movieDetail.score,
      slug: movieDetail.slug,
      image: movieDetail.image,
      reviews: {},
    };

    const reviewsData = await this.dbService.cAggregate('reviews', [
      {
        $match: {
          movie_id: objectIDParam,
        },
      },
      {
        $lookup: {
          from: 'platforms',
          localField: 'platform_id',
          foreignField: '_id',
          as: 'platform',
        },
      },
      {
        $unwind: '$platform',
      },
      {
        $group: {
          _id: '$platform.name',
          reviews: {
            $push: {
              author: '$author',
              body: '$body',
              score: '$score',
            },
          },
        },
      },
      {
        $project: {
          review: {
            k: '$_id',
            v: '$reviews',
          },
        },
      },
      {
        $group: {
          _id: null,
          cv: { $push: '$review' },
        },
      },
      {
        $replaceRoot: {
          newRoot: { $arrayToObject: '$cv' },
        },
      },
    ]);

    rspMovie.reviews = reviewsData[0] || {};

    return rspMovie;
  }

  async createMovie(createMovieObj: CreateMovieDto) {
    if (!createMovieObj.slug) {
      createMovieObj.slug = '';
    }

    if (!createMovieObj.platforms) {
      createMovieObj.platforms = [];
    }

    createMovieObj.slug = this.slugService.slug(createMovieObj.title);
    const validationErrors = await validate(createMovieObj);

    if (validationErrors.length > 0) {
      throw new BadRequestException('Validation failed');
    }

    const movie = this.moviesRepository.create(createMovieObj);

    return await this.moviesRepository.save(movie);
  }

  async deleteMovie(id: string) {
    const objectIDParam = new ObjectId(id);

    const movie = await this.moviesRepository.findOne({
      where: {
        _id: objectIDParam,
      },
    });

    if (!movie) {
      throw new NotFoundException('Película no encontrada.');
    }

    return await this.moviesRepository.remove(movie);
  }

  async updateMovie(id: string, updateMovieDto: UpdateMovieDto) {
    const objectIDParam = new ObjectId(id);

    const movie = await this.moviesRepository.findOne({
      where: {
        _id: objectIDParam,
      },
    });

    if (!movie) {
      throw new NotFoundException('Película no encontrada.');
    }

    //let peliculaActualizar  : { title?: string; image?: string ; director?: string };

    const peliculaActualizar = Object.assign(movie, updateMovieDto);

    return await this.moviesRepository.save(peliculaActualizar);
  }

  async cloneMovie(id: string) {
    const objectIDParam = new ObjectId(id);

    const movie = await this.moviesRepository.findOne({
      where: {
        _id: objectIDParam,
      },
    });

    if (!movie) {
      throw new NotFoundException('Película no encontrada.');
    }

    const cloned = { ...movie };

    delete cloned._id;
    delete cloned.createdAt;
    delete cloned.updatedAt;

    cloned.score = 0;

    if (!cloned.platforms || typeof cloned.platforms == 'undefined') {
      cloned.platforms = [];
    }

    return await this.createMovie(cloned);
  }
}
