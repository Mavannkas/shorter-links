import { RedirectLink } from 'src/shorten/entity/redirect-link.entity';
import { Role } from 'src/roles/entity/role.entity';

export interface UserInterface {
  user_id: string;
  name: string;
  email: string;
  password_hash: string;
  activation_hash: string;
  activated: boolean;
  created_at: Date;
  roles: Role[];
  redirect_links: RedirectLink[];
}
