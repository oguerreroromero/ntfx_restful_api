import {
  Controller,
  Body,
  Put,
  Get,
  Post,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
//import { Request } from 'express';
import { MovieService } from './movie.service';

import { CreateMovieDto } from './dto/create.movie.dto';
import { UpdateMovieDto } from './dto/update.movie.dto';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  listAllMovies(
    @Query('limit') limit: number,
    @Query('page') page: number,
  ): Promise<object[]> {
    return this.movieService.listAllMovies(limit, page);
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<object> {
    const data = this.movieService.getById(id);
    return data;
  }

  @Post()
  async createMovie(@Body() createMovieDto: CreateMovieDto): Promise<object> {
    const rsp = await this.movieService.createMovie(createMovieDto);

    if (rsp) {
      return { status: 'OK' };
    }
    return { status: 'ERROR' };
  }

  @Post(':id')
  cloneMovie(@Param('id') id: string): Promise<object> {
    return this.movieService.cloneMovie(id);
  }

  @Put(':id')
  updateMovie(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<object> {
    return this.movieService.updateMovie(id, updateMovieDto);
  }

  @Delete(':id')
  deleteMovie(@Param('id') id: string): Promise<object> {
    return this.movieService.deleteMovie(id);
  }
}
