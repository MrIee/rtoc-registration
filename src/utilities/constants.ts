import type { ReactSelectOption } from './interfaces';

export const CONTENT_URL = 'https://content.rtoc.w617.com/';

export const AQF_LEVEL_OPTIONS: Array<ReactSelectOption> = [
  { id: '1', value: '1', label: 'AQF Level 1 - Certificate I', },
  { id: '2', value: '2', label: 'AQF Level 2 - Certificate II', },
  { id: '3', value: '3', label: 'AQF Level 3 - Certificate III', },
  { id: '4', value: '4', label: 'AQF Level 4 - Certificate IV', },
  { id: '5', value: '5', label: 'AQF Level 5 - Diploma', },
  { id: '6', value: '6', label: 'AQF Level 6 - Advanced Diploma, Associate Degree', },
  { id: '7', value: '7', label: 'AQF Level 7 - Vocational Degree, Bachelor Degree', },
  { id: '8', value: '8', label: 'AQF Level 8 - Bachelor Honours Degree, Graduate Certificate, Graduate Diploma', },
  { id: '9', value: '9', label: 'AQF Level 9 - Masters Degree', },
  { id: '0', value: '10', label: 'AQF Level 10 - Doctoral Degree', },
];

export const EXPERIENCE_TYPES = {
  VET: 'VET',
  INDUSTRY:'Industry',
};
