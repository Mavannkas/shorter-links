import { RedirectLinkResponse } from './redirect-link';

export interface StatsResponse {
  redirectCount: number;
}

export interface RedirectLinkStatsResponse {
  redirectLink: RedirectLinkResponse;
  redirectCount: number;
}
