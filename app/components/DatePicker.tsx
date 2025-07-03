import type { ReactSelectOption } from '~/utilities/interfaces';
import Dropdown from './Dropdown';
import { useState, useEffect } from 'react';

interface DatePickerProps {
  label?: string;
  error?: string;
  onChange?: (date: string) => void
  onBlur?: () => void;
};

const END_YEAR = 1970;

const DatePicker = ({ label, error, onChange, onBlur }: DatePickerProps) => {
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');

  const months: Array<ReactSelectOption> = [...Array(12).keys()].map((key: number): ReactSelectOption => {
    const monthName: string = new Date(0, key).toLocaleString('en', { month: 'long' });
    const monthValue: string = `${key + 1}`.padStart(2, '0');
    return { value: monthValue, label: monthName };
  });

  const years = (): Array<ReactSelectOption> => {
    const startYear: number = new Date().getFullYear();

    return [...Array(startYear - END_YEAR).keys()].map((key: number): ReactSelectOption => {
      const year: number = startYear - key;
      return { value: year.toString(), label: year.toString() };
    });
  };

  useEffect(() => {
    if (month && year) {
      onChange?.(`${year}-${month}-01`);
    } else {
      onChange?.('');
    }
  }, [month, year]);

  const handleOnChangeMonth = (month: ReactSelectOption) => {
    if (typeof month.value === 'string') {
      setMonth(month.value);
    }
  };

  const handleOnChangeYear = (year: ReactSelectOption) => {
    if (typeof year.value === 'string') {
      setYear(year.value);
    }
  };

  return (
    <div className="tw:flex tw:flex-col">
      { label && (<span className="label"><span>{label}<span>*</span></span></span>)}
      <div className="tw:flex tw:gap-4">
        <Dropdown
          className="tw:w-full"
          options={months}
          placeholder="Month"
          onChange={handleOnChangeMonth}
          onBlur={onBlur}
          error={error}
          showErrorText={false}
        />
        <Dropdown
          className="tw:w-full"
          options={years()}
          placeholder="Year"
          onChange={handleOnChangeYear}
          onBlur={onBlur}
          error={error}
          showErrorText={false}
        />
      </div>
      { error && <span className="tw:text-sm tw:text-red-500">{error}</span> }
    </div>
  );
};

export default DatePicker;