import instagramMockData from '@/data/instagram-mock.json';
import type { InstagramMedia, InstagramFeedResponse } from '@/data/instagram-mock.types';

/**
 * Fetch the Instagram feed.
 * Phase A (current): Returns mock JSON data.
 * Phase B: Replace with `await fetchInstagramGraph(token)` calling the Graph API endpoint.
 */
export async function getInstagramFeed(): Promise<InstagramMedia[]> {
  // TODO Phase B: replace with live Instagram Graph API call
  // const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  // if (!token) throw new Error('INSTAGRAM_ACCESS_TOKEN not set');
  // return await fetchInstagramGraph(token);

  // Mock data shape matches Instagram Graph API response
  const data = instagramMockData as InstagramFeedResponse;
  return data.data;
}

/**
 * Get the 8 most recent posts for the carousel.
 */
export async function getInstagramCarousel(): Promise<InstagramMedia[]> {
  const feed = await getInstagramFeed();
  return feed.slice(0, 8);
}

/**
 * Filter posts with the #flytrapspecial hashtag.
 */
export function getSpecialPosts(posts: InstagramMedia[]): InstagramMedia[] {
  return posts.filter((post) =>
    post.caption.toLowerCase().includes('#flytrapspecial')
  );
}

/**
 * Get the most recent special post.
 */
export async function getMostRecentSpecialPost(): Promise<InstagramMedia | null> {
  const feed = await getInstagramFeed();
  const specials = getSpecialPosts(feed);
  return specials.length > 0 ? specials[0] : null;
}
