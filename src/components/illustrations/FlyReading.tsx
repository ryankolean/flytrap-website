// TODO: Placeholder. Replace with commissioned spot-illustrations if Kara engages the original fly-painting artist post-handoff. See OPEN-QUESTIONS.md #1.

export default function FlyReading({
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
      {/* Head */}
      <circle cx="45" cy="38" r="11" fill="currentColor" />

      {/* Eyes (focused) */}
      <circle cx="42" cy="36" r="2" fill="white" />
      <circle cx="48" cy="36" r="2" fill="white" />

      {/* Wings */}
      <ellipse cx="33" cy="45" rx="7" ry="10" fill="currentColor" opacity="0.7" />
      <ellipse cx="57" cy="45" rx="7" ry="10" fill="currentColor" opacity="0.7" />

      {/* Body */}
      <ellipse cx="45" cy="58" rx="8" ry="14" fill="currentColor" />

      {/* Front legs (holding book) */}
      <path d="M 43 72 L 42 81" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 45 72 L 45 81" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 47 72 L 48 81" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

      {/* Back legs */}
      <path d="M 41 66 L 35 73" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 49 66 L 55 73" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

      {/* Open book */}
      <path d="M 60 35 L 65 32 L 65 58 L 60 55 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.5" />
      <line x1="62.5" y1="32" x2="62.5" y2="58" stroke="currentColor" strokeWidth="1" />

      {/* Book lines (text) */}
      <line x1="60" y1="38" x2="64" y2="37" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      <line x1="60" y1="44" x2="64" y2="43" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      <line x1="60" y1="50" x2="64" y2="49" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
    </svg>
  );
}
