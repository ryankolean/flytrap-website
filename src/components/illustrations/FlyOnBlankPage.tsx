// TODO: Placeholder. Replace with commissioned spot-illustrations if Kara engages the original fly-painting artist post-handoff. See OPEN-QUESTIONS.md #1.

export default function FlyOnBlankPage({
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
      <circle cx="50" cy="35" r="11" fill="currentColor" />

      {/* Eyes */}
      <circle cx="47" cy="33" r="2" fill="white" />
      <circle cx="53" cy="33" r="2" fill="white" />

      {/* Wings */}
      <ellipse cx="38" cy="42" rx="7" ry="10" fill="currentColor" opacity="0.7" />
      <ellipse cx="62" cy="42" rx="7" ry="10" fill="currentColor" opacity="0.7" />

      {/* Body */}
      <ellipse cx="50" cy="55" rx="8" ry="14" fill="currentColor" />

      {/* Front legs */}
      <path d="M 48 69 L 47 78" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 50 69 L 50 78" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 52 69 L 53 78" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

      {/* Back legs */}
      <path d="M 46 66 L 40 73" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 54 66 L 60 73" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

      {/* Horizon line (empty page reference) */}
      <line x1="25" y1="88" x2="75" y2="88" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}
