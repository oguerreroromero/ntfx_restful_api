import {
  Entity,
  Column,
  ObjectId,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('platforms')
export class Review {
  @ObjectIdColumn()
  _id: ObjectId;
  @Column()
  icon: string;
  @Column()
  name: string;
  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updatedAt: Date;
}
