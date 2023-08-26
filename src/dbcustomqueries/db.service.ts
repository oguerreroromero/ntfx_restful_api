import { Injectable, Inject } from '@nestjs/common';
import { Db } from 'mongodb';
import { PipelineBuilder } from './pipelines/builder.list.movie.pipeline';

@Injectable()
export class DbService {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private db: Db,
  ) {}

  /**
   *
   * async function( params(2) ) return Promise object
   *
   * Función generica que hace un aggregate a mongodb. Se implementa porque son operaciones
   * muy especificas que al parecer no se pueden mapear en el orm.
   *
   * Recibe el nombre de la colección en formato string y el pipeline como un array de objetos.
   *
   *  @param _collection : string  - Es el nombre de la colección
   *  @param pipeline    : array   - Arreglo de objetos con instrucciones para MongoDB.
   *
   * @returns [] : array  - Resultado del aggregate.
   *
   * */

  async cAggregate(_collection: string, pipeline: object[]): Promise<object[]> {
    return await this.db.collection(_collection).aggregate(pipeline).toArray();
  }

  async getPipelineFindAllMovies(
    searchText: string,
    page: number,
    limit: number,
  ): Promise<object[]> {
    const pipelineAll = new PipelineBuilder()
      .setLookUpReviews(searchText)
      .setUnwindReviews()
      .setMatchForceReviews()
      .setPagination(page, limit)
      .setVisibleFields()
      .build();

    return pipelineAll;
  }
  async getPipelineFindOneMovie(id: string): Promise<object[]> {
    const pipelineById = new PipelineBuilder()
      .setMatchById(id)
      .setLookUpReviews()
      .setUnwindReviews()
      .setPagination(0, 1)
      .setVisibleFields()
      .build();
    return pipelineById;
  }
}
