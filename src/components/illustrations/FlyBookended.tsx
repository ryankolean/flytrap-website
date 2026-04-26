// TODO: Placeholder. Replace with commissioned spot-illustrations if Kara engages the original fly-painting artist post-handoff. See OPEN-QUESTIONS.md #1.

export default function FlyBookended({
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
      {/* Left bracket mark */}
      <path d="M 20 35 L 25 35 L 25 65 L 20 65" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Head */}
      <circle cx="50" cy="45" r="12" fill="currentColor" />

      {/* Eyes */}
      <circle cx="47" cy="43" r="2" fill="white" />
      <circle cx="53" cy="43" r="2" fill="white" />

      {/* Wings */}
      <ellipse cx="38" cy="52" rx="7" ry="11" fill="currentColor" opacity="0.7" />
      <ellipse cx="62" cy="52" rx="7" ry="11" fill="currentColor" opacity="0.7" />

      {/* Body */}
      <ellipse cx="50" cy="62" rx="9" ry="15" fill="currentColor" />

      {/* Front legs */}
      <path d="M 48 77 L 48 87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 50 77 L 50 87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 52 77 L 52 87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

      {/* Right bracket mark */}
      <path d="M 80 35 L 75 35 L 75 65 L 80 65" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
