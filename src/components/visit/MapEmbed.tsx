'use client';

import { useState } from 'react';

// Map embed uses a parameterized query URL — no API key required.
// The iframe is intentionally withheld until the user clicks to avoid
// loading Google tracking scripts without consent.
const MAP_EMBED_URL =
  'https://www.google.com/maps/embed/v1/place?q=22950+Woodward+Ave+Ferndale+MI+48220&zoom=15&maptype=roadmap';

export function MapEmbed() {
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center bg-stone-100 rounded-sm h-64 md:h-80">
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="px-5 py-2.5 bg-stone-900 text-white text-sm font-semibold rounded-sm hover:bg-stone-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
        >
          Load map
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-64 md:h-80 rounded-sm overflow-hidden">
      <iframe
        title="The Fly Trap on Google Maps"
        src={MAP_EMBED_URL}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
