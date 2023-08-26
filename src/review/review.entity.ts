import {
  Entity,
  Column,
  ObjectIdColumn,
  ObjectId,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { ObjectId as cstmObjectId } from 'mongodb';

@Entity('reviews')
export class Review {
  @ObjectIdColumn()
  _id: ObjectId;

  @BeforeInsert()
  async parseObjectId() {
    console.log(this);

    if (this.movie_id) {
      this.movie_id = new cstmObjectId(this.movie_id);
    }
    if (this.platform_id) {
      this.platform_id = new cstmObjectId(this.platform_id);
    }
  }

  @Column({ type: 'string', nullable: false })
  movie_id: ObjectId;

  @Column({ type: 'string', nullable: false })
  platform_id: ObjectId;

  @Column({ type: 'varchar', length: 100, nullable: false })
  author: string;

  @Column({ type: 'text', length: 255, nullable: false })
  body: string;

  @Column()
  score: number;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updatedAt: Date;
}
