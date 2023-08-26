import { Injectable, Inject } from '@nestjs/common';
import { Db } from 'mongodb';

@Injectable()
export class DbService {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private db: Db,
  ) {}

  async cAggregate(_collection: string, pipeline: object[]): Promise<object[]> {
    return await this.db.collection(_collection).aggregate(pipeline).toArray();
  }
  
}
