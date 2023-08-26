import { Module, Global } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';
import { DbService } from './db.service';

@Global()
@Module({
  controllers: [],
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (): Promise<Db> => {
        try {
          const client = await MongoClient.connect(
            process.env.MONGODB_URI ,
            {},
          );

      

          return client.db(process.env.DB_NAME  );
        } catch (e) {
          throw e;
        }
      },
    },
    DbService,
  ],
  exports: ['DATABASE_CONNECTION', DbService],
})
export class DbModule {}
