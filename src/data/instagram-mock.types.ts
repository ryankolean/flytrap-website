export type MediaType = 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';

export interface InstagramMedia {
  id: string;
  caption: string;
  media_type: MediaType;
  media_url: string;
  permalink: string;
  timestamp: string;
  username: string;
}

export interface InstagramFeedResponse {
  data: InstagramMedia[];
}
