// TODO: Placeholder. Replace with commissioned spot-illustrations if Kara engages the original fly-painting artist post-handoff. See OPEN-QUESTIONS.md #1.

export default function FlyWaving({
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
      <circle cx="50" cy="40" r="12" fill="currentColor" />

      {/* Eyes (happy) */}
      <circle cx="46" cy="38" r="2" fill="white" />
      <circle cx="54" cy="38" r="2" fill="white" />
      <path d="M 46 41 Q 48 42 50 41" stroke="white" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M 50 41 Q 52 42 54 41" stroke="white" strokeWidth="1" fill="none" strokeLinecap="round" />

      {/* Wings */}
      <ellipse cx="38" cy="48" rx="7" ry="11" fill="currentColor" opacity="0.7" />
      <ellipse cx="62" cy="48" rx="7" ry="11" fill="currentColor" opacity="0.7" />

      {/* Body */}
      <ellipse cx="50" cy="60" rx="9" ry="15" fill="currentColor" />

      {/* Front legs (standing) */}
      <path d="M 48 75 L 48 85" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 50 75 L 50 85" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 52 75 L 52 85" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

      {/* Back legs */}
      <path d="M 46 72 L 40 80" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 54 72 L 60 80" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

      {/* Raised front leg (waving) */}
      <path d="M 48 30 L 42 20 L 44 25" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
