import { RoleInterface } from 'src/interfaces/role';
import { User } from 'src/user/entity/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Role extends BaseEntity implements RoleInterface {
  @PrimaryGeneratedColumn('uuid')
  role_id: string;

  @Column({
    length: 50,
  })
  name: string;

  @Column({
    default: false,
  })
  deleted: boolean;

  @ManyToMany((type) => User, (entity) => entity.roles)
  users: User[];
}
