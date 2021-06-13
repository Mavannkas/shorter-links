import { RedirectLink } from 'src/shorten/entity/redirect-link.entity';

export interface RedirectLogInterface {
  redirect_log_id: string;
  ip: string;
  agent: string;
  referrer: string;
  created_at: Date;
  redirect_link_id: RedirectLink;
}
