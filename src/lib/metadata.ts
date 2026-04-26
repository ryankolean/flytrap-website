import type { Metadata } from 'next';

const SITE_URL = 'https://theflytrapferndale.com';
const DEFAULT_TITLE = 'The Fly Trap — a finer diner';
const DEFAULT_DESCRIPTION =
  "Buzzin' since 2004. The Fly Trap is a finer diner at 22950 Woodward Ave, Ferndale MI. Mon–Sun 8am to 3pm.";
const OG_IMAGE = '/og-default.svg';
const OG_ALT = 'The Fly Trap, a finer diner';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: 'The Fly Trap',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: OG_ALT,
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export interface PageMetadataInput {
  title?: string;
  description?: string;
  path?: string;
}

export function pageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  const resolvedTitle = title ? `${title} | The Fly Trap` : DEFAULT_TITLE;
  const resolvedDescription = description ?? DEFAULT_DESCRIPTION;
  const canonical = path
    ? `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
    : SITE_URL;

  return {
    ...defaultMetadata,
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      ...defaultMetadata.openGraph,
      title: resolvedTitle,
      description: resolvedDescription,
      url: canonical,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: resolvedTitle,
      description: resolvedDescription,
    },
  };
}
