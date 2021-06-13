import { RedirectLinkInterface } from 'src/interfaces/redirect-link';
import { RedirectLog } from 'src/stats/entity/redirect-log.entity';
import { User } from 'src/user/entity/user.entity';
import {
  AfterInsert,
  AfterUpdate,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['id'])
export class RedirectLink extends BaseEntity implements RedirectLinkInterface {
  @PrimaryGeneratedColumn('uuid')
  redirect_link_id: string;

  @Column()
  source: string;

  @Column()
  id: string;

  @Column()
  redirect_link: string;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @ManyToOne((type) => User, (entity) => entity.redirect_links)
  user_id: User;

  @OneToMany((type) => RedirectLog, (entity) => entity.redirect_link_id)
  redirect_logs: RedirectLog[];

  @BeforeInsert()
  @BeforeUpdate()
  generateRedirectLink(): void {
    this.redirect_link = `localhost:3000/${this.id}`;
  }
}
