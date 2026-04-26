import { createImageUrlBuilder } from 'next-sanity';

import { dataset, projectId } from '../env';

export const urlFor = (source: any) =>
  createImageUrlBuilder({
    projectId: projectId || '',
    dataset: dataset || '',
  }).image(source);
