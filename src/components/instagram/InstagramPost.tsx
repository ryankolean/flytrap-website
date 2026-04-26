import type { InstagramMedia } from '@/data/instagram-mock.types';

interface InstagramPostProps {
  post: InstagramMedia;
}

export default function InstagramPost({ post }: InstagramPostProps) {
  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-none w-64 snap-start flex flex-col"
    >
      <div className="aspect-square w-full overflow-hidden bg-neutral-100">
        <img
          src={post.media_url}
          alt=""
          loading="lazy"
          width={256}
          height={256}
          className="w-full h-full object-cover"
        />
      </div>
      {post.caption && (
        <p className="mt-2 text-sm text-neutral-700 line-clamp-2 leading-snug">
          {post.caption}
        </p>
      )}
    </a>
  );
}
