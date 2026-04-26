import { client } from '@/sanity/lib/client';
import {
  getMostRecentSpecialPost,
  getInstagramFeed,
} from '@/lib/instagram';

export interface DailySpecial {
  title: string;
  description?: string;
  image?: {
    url: string;
    alt: string;
  };
  price?: number;
  sourceUrl?: string;
  source: 'sanity' | 'instagram';
}

/**
 * Get the current daily special.
 * 1. Tries to fetch the most recent Sanity dailySpecial document.
 * 2. If none exists or is stale (>7 days), falls back to the most recent
 *    Instagram #flytrapspecial post.
 * 3. Returns null if neither source has a valid special.
 */
export async function getCurrentDailySpecial(): Promise<DailySpecial | null> {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Try Sanity first
  try {
    const query = `*[_type == "dailySpecial" && dateTime(activeDate) > dateTime($sevenDaysAgo)] | order(activeDate desc) [0]`;
    const params = { sevenDaysAgo: sevenDaysAgo.toISOString() };

    const sanitySpecial = await client.fetch(query, params);

    if (sanitySpecial) {
      return {
        title: sanitySpecial.title,
        description: sanitySpecial.description || undefined,
        image: sanitySpecial.image
          ? {
              url: sanitySpecial.image.asset.url,
              alt: sanitySpecial.image.alt || 'Daily Special',
            }
          : undefined,
        price: sanitySpecial.price || undefined,
        source: 'sanity',
      };
    }
  } catch (error) {
    console.error('Error fetching Sanity daily special:', error);
    // Fall through to Instagram fallback
  }

  // Fallback to Instagram #flytrapspecial
  try {
    const feed = await getInstagramFeed();
    const igSpecials = feed.filter((post) =>
      post.caption.toLowerCase().includes('#flytrapspecial')
    );

    if (igSpecials.length === 0) return null;

    const mostRecentSpecial = igSpecials[0];
    const postDate = new Date(mostRecentSpecial.timestamp);

    // Check 7-day staleness rule
    if (postDate < sevenDaysAgo) {
      return null;
    }

    // Extract first 40 words of caption for description
    const words = mostRecentSpecial.caption.split(/\s+/);
    const description = words.slice(0, 40).join(' ').replace(/#\w+/g, '').trim();

    return {
      title: 'Today\'s Special',
      description: description || undefined,
      image: {
        url: mostRecentSpecial.media_url,
        alt: 'Today\'s Special from Instagram',
      },
      sourceUrl: mostRecentSpecial.permalink,
      source: 'instagram',
    };
  } catch (error) {
    console.error('Error fetching Instagram special:', error);
    return null;
  }
}
