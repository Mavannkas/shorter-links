import { RedirectLogInterface } from 'src/interfaces/redirect-log';
import { RedirectLink } from 'src/shorten/entity/redirect-link.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class RedirectLog extends BaseEntity implements RedirectLogInterface {
  @PrimaryGeneratedColumn('uuid')
  redirect_log_id: string;

  @Column()
  ip: string;

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

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @ManyToOne((type) => RedirectLink, (entity) => entity.redirect_logs)
  redirect_link_id: RedirectLink;
}
