// TODO: Placeholder. Replace with commissioned spot-illustrations if Kara engages the original fly-painting artist post-handoff. See OPEN-QUESTIONS.md #1.

export default function FlyPouringCoffee({
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
      <circle cx="45" cy="35" r="12" fill="currentColor" />

      {/* Eyes */}
      <circle cx="42" cy="33" r="2" fill="white" />
      <circle cx="48" cy="33" r="2" fill="white" />

      {/* Wings */}
      <ellipse cx="32" cy="42" rx="7" ry="11" fill="currentColor" opacity="0.7" />
      <ellipse cx="58" cy="42" rx="7" ry="11" fill="currentColor" opacity="0.7" />

      {/* Body */}
      <ellipse cx="45" cy="55" rx="9" ry="15" fill="currentColor" />

      {/* Front legs */}
      <path d="M 43 70 L 42 80" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 45 70 L 45 80" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 47 70 L 48 80" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

      {/* Coffee pot (tilted) */}
      <path d="M 65 30 L 75 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="78" cy="18" r="3" fill="currentColor" opacity="0.7" />

      {/* Coffee stream */}
      <path d="M 75 22 Q 72 35 70 45" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

      {/* Cup */}
      <rect x="55" y="48" width="12" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M 67 52 Q 72 50 72 56" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
