import { RedirectLinkResponse } from './redirect-link';
import { RedirectItemResponse } from './redirect-log';

export interface StatsResponse {
  redirectCount: number;
}
export interface DaysStatsResponse {
  day: number;
  redirectCount: number;
}

export interface RedirectLinkStatsResponse {
  redirectLink: RedirectLinkResponse;
  redirectCount: number;
}

export interface PublicStatsResponse {
  redirectLinks: number;
  redirects: number;
}

export interface RedirectLogPageResponse {
  items: RedirectItemResponse[];
  page: number;
  lastPage: number;
}
