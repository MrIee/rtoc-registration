import { AQF_LEVEL_OPTIONS } from './constants';
import type { ReactSelectOption } from './interfaces';

export const getAQFString = (level: string): string => {
  const aqf = AQF_LEVEL_OPTIONS.find((aqf: ReactSelectOption) => aqf.value === level);
  return aqf?.label || '';
};
