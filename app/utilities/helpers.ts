import { AQF_LEVEL_OPTIONS } from './constants';
import type { ReactSelectOption } from './interfaces';

export const getAQFString = (level: string): string => {
  const aqf = AQF_LEVEL_OPTIONS.find((aqf: ReactSelectOption) => aqf.value === level);
  return aqf?.label || '';
};

/**
 * Compares two dates and returns true if the first date occurs before the second date
 *
 * Expects dates to be in the format 'yyyy-mm-dd'
 * @param {string} date1 The first date in chronological order to be compared
 * @param {string} date2 the second date in chronological to be compared
 */

export const isDateRangeValid = (date1: string, date2: string) => {
  const dateStarted = new Date(date1);
  const dateCompleted= new Date(date2);
  return dateCompleted > dateStarted;
};

export const isValidABN = (abn: string) => {
  // Remove spaces from the ABN string
  const formattedABN = abn.replace(/\s/g, '');

  // Check if the ABN is 11 digits long and contains only numbers
  if (!abn || !/^\d{11}$/.test(formattedABN)) {
    return false;
  }

  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  let weightedSum = 0;

  // Apply the ABN validation algorithm
  for (let i = 0; i < weights.length; i++) {
    let digit = parseInt(formattedABN[i], 10);
    // Subtract 1 from the first digit
    if (i === 0) {
      digit -= 1;
    }
    weightedSum += digit * weights[i];
  }

  // Check if the remainder after dividing by 89 is zero
  return weightedSum % 89 === 0;
};

// For later use if NZBN is accepted
export const isValidNZBN = (nzbn: string) => {
  if (nzbn.trim() === '') {
    return false;
  }

  // Remove any spaces or hyphens from the input
  const formattedNzbn = nzbn.replace(/[\s-]/g, '');

  // Check if the cleaned NZBN has exactly 13 digits
  if (!/^\d{13}$/.test(formattedNzbn)) {
    return false;
  }

  return true;
};

export const generatePassword = () => {
  const length: number = 10;
  const characters: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  let password: string = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }

  return password;
};
