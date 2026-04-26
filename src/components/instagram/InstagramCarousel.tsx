import { getInstagramFeed } from '@/lib/instagram';
import InstagramPost from './InstagramPost';

export default async function InstagramCarousel() {
  const posts = await getInstagramFeed();
  const showMockBadge = process.env.NEXT_PUBLIC_INSTAGRAM_LIVE !== 'true';

  return (
    <section aria-label="Instagram feed">
      {showMockBadge && (
        <p className="mb-3 text-xs text-neutral-400">
          Showing recent posts (mock data &mdash; live feed at handoff)
        </p>
      )}
      <div
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {posts.map((post) => (
          <InstagramPost key={post.id} post={post} />
        ))}
      </div>
      <p className="mt-3 text-xs text-neutral-400">
        Tag us @theflytrapferndale
      </p>
    </section>
  );
}
