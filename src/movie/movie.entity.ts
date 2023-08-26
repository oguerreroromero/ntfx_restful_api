import {
  Entity,
  Column,
  ObjectId,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

import { ObjectId as cstmObjectId } from 'mongodb';

@Entity('movies')
export class Movie {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: 'varchar', length: 100, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  slug: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  image: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  director: string;

  @Column({ type: 'number', length: 255, nullable: false })
  score: number;

  @Column({ type: 'json', array: false, nullable: true })
  platforms: any[];

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updatedAt: Date;

  @BeforeInsert()
  async parseObjectId() {
    if (!this.platforms) {
      this.platforms = [];
    }

    for (let i = 0; i < this.platforms.length; i++) {
      this.platforms[i]._id = new cstmObjectId(this.platforms[i]._id);
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  async getScore() {
    if (!this.score) {
      this.score = 0;
    }
  }
}
