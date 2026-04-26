// TODO: Placeholder. Replace with commissioned spot-illustrations if Kara engages the original fly-painting artist post-handoff. See OPEN-QUESTIONS.md #1.

export default function FlyTippingHat({
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
      {/* Hat */}
      <ellipse cx="50" cy="20" rx="18" ry="8" fill="currentColor" />
      <path d="M 32 28 Q 32 26 50 24 Q 68 26 68 28" stroke="currentColor" strokeWidth="2" fill="none" />

      {/* Head */}
      <circle cx="50" cy="45" r="14" fill="currentColor" />

      {/* Eyes */}
      <circle cx="46" cy="42" r="2" fill="white" />
      <circle cx="54" cy="42" r="2" fill="white" />

      {/* Wings */}
      <ellipse cx="38" cy="50" rx="8" ry="12" fill="currentColor" opacity="0.7" />
      <ellipse cx="62" cy="50" rx="8" ry="12" fill="currentColor" opacity="0.7" />

      {/* Body */}
      <ellipse cx="50" cy="62" rx="10" ry="16" fill="currentColor" />

      {/* Front legs (bent in gesture) */}
      <path d="M 48 78 L 45 88" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 50 78 L 50 88" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 52 78 L 55 88" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

      {/* Back legs */}
      <path d="M 46 75 L 40 82" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 54 75 L 60 82" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
