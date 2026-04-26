export default function VisitTeaser() {
  return (
    <section aria-label="Visit us">
      <div className="bg-surface-warm rounded-lg p-5 space-y-4">
        <h2 className="font-display text-2xl leading-tight">Come on in.</h2>

        <div className="space-y-1 text-body">
          <p>22950 Woodward Ave</p>
          <p>Ferndale, MI 48220</p>
        </div>

        <div className="space-y-1 text-body">
          <p className="font-medium">Monday &ndash; Sunday</p>
          <p>8&nbsp;am &ndash; 3&nbsp;pm</p>
        </div>

        <a
          href="https://maps.google.com/?q=22950+Woodward+Ave+Ferndale+MI"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-md bg-brand-primary text-brand-on-primary px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Get directions
        </a>
      </div>
    </section>
  );
}
