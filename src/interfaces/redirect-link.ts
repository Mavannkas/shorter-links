import { RedirectLog } from 'src/stats/entity/redirect-log.entity';
import { User } from 'src/user/entity/user.entity';

export interface RedirectLinkInterface {
  redirect_link_id: string;
  id: string;
  redirect_link: string;
  source: string;
  created_at: Date;
  user_id: User;
  redirect_logs: RedirectLog[];
}

export interface createNewRedirectResponse {
  source: string;
  redirectLink: string;
}

export interface RedirectLinkResponse {
  redirect_link_id: string;
  id: string;
  redirectLink: string;
  source: string;
  created_at: Date;
}

export interface RedirectLinkPageResponse {
  items: RedirectLinkResponse[];
  page: number;
  lastPage: number;
}

export interface DeleteRedirectLinkResponse {
  ok: string;
}
