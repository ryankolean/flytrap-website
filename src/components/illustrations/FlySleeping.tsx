// TODO: Placeholder. Replace with commissioned spot-illustrations if Kara engages the original fly-painting artist post-handoff. See OPEN-QUESTIONS.md #1.

export default function FlySleeping({
  className = '',
  'aria-hidden': ariaHidden = true,
}: {
  className?: string;
  'aria-hidden'?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden={ariaHidden}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Head (tilted, sleeping) */}
      <circle cx="48" cy="48" r="12" fill="currentColor" />

      {/* Eyes (closed - curved lines) */}
      <path d="M 44 46 Q 46 48 48 46" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 52 46 Q 54 48 56 46" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Wings (folded, relaxed) */}
      <ellipse cx="36" cy="50" rx="6" ry="9" fill="currentColor" opacity="0.7" />
      <ellipse cx="60" cy="50" rx="6" ry="9" fill="currentColor" opacity="0.7" />

      {/* Body (curled) */}
      <ellipse cx="48" cy="62" rx="8" ry="13" fill="currentColor" />

      {/* Front legs (folded under) */}
      <path d="M 47 75 L 46 80" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 49 75 L 49 80" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 51 75 L 52 80" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

      {/* Z marks (sleep indicator) */}
      <path d="M 62 25 L 68 25 L 62 32 L 68 32" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 66 20 L 72 20 L 66 27 L 72 27" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}
