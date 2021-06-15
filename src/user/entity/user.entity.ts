import { Token } from 'src/auth/entity/token.entity';
import { UserInterface } from 'src/interfaces/user';

import { RedirectLink } from 'src/shorten/entity/redirect-link.entity';
import { Role } from 'src/roles/entity/role.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity implements UserInterface {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({
    length: 25,
    nullable: true,
    default: null,
  })
  name: string;

  @Column({
    length: 100,
    nullable: true,
    default: null,
  })
  email: string;

  @Column({
    nullable: true,
    default: null,
  })
  password_hash: string;

  @Column({
    nullable: true,
    default: null,
  })
  activation_hash: string;

  @Column({
    type: 'boolean',
    default: 0,
  })
  activated: boolean;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @ManyToMany((type) => Role, (entity) => entity.users)
  @JoinTable()
  roles: Role[];

  @OneToMany((type) => RedirectLink, (entity) => entity.user_id)
  redirect_links: RedirectLink[];

  @OneToMany((type) => Token, (entity) => entity.user_id)
  tokens: Token[];
}
