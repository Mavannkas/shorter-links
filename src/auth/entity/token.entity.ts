import { User } from 'src/user/entity/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  token_id: string;

  @Column()
  token: string;

  @ManyToOne((type) => User, (entity) => entity.tokens)
  user_id: User;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column()
  ip: string;

  @Column({
    nullable: true,
    default: null,
  })
  name: string;

  @Column({
    nullable: true,
    default: null,
  })
  agent: string;

  @Column({
    nullable: true,
    default: null,
  })
  referrer: string;
}
