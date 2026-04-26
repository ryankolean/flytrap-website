import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

import { dataset, projectId } from '../env';

const builder = imageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
});

export const urlFor = (source: SanityImageSource) => builder.image(source);
