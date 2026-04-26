// TODO: Placeholder. Replace with commissioned spot-illustrations if Kara engages the original fly-painting artist post-handoff. See OPEN-QUESTIONS.md #1.

export default function FlyAtCheckout({
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
      <circle cx="48" cy="30" r="11" fill="currentColor" />

      {/* Eyes */}
      <circle cx="45" cy="28" r="2" fill="white" />
      <circle cx="51" cy="28" r="2" fill="white" />

      {/* Wings */}
      <ellipse cx="36" cy="38" rx="7" ry="10" fill="currentColor" opacity="0.7" />
      <ellipse cx="60" cy="38" rx="7" ry="10" fill="currentColor" opacity="0.7" />

      {/* Body */}
      <ellipse cx="48" cy="52" rx="8" ry="14" fill="currentColor" />

      {/* Front legs (standing upright) */}
      <path d="M 46 66 L 46 76" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 48 66 L 48 76" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 50 66 L 50 76" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

      {/* Back legs */}
      <path d="M 44 64 L 38 72" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 52 64 L 58 72" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

      {/* Small checkout counter */}
      <rect x="62" y="55" width="20" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <line x1="62" y1="61" x2="82" y2="61" stroke="currentColor" strokeWidth="1" />

      {/* Register/drawer detail */}
      <rect x="68" y="58" width="6" height="4" rx="0.5" fill="currentColor" opacity="0.6" />
    </svg>
  );
}
