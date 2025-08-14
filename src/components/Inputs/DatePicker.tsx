import { getDefaultOption } from '../../utilities/helpers';
import type { InputProps, ReactSelectOption } from '../../utilities/interfaces';
import Dropdown from './Dropdown';
import { useEffect, useState, type FC, type JSX } from 'react';

interface DatePickerProps extends Omit<InputProps, 'onChange'> {
  useDay?: boolean;
  hasBorder?: boolean;
  onChange?: (date: string) => void;
};

const startYear: number = new Date().getFullYear();
const endYear = 1970;

const DatePicker: FC<DatePickerProps> = ({
  useDay = false,
  label,
  value,
  required = true,
  hasBorder = false,
  error,
  onChange,
  onBlur,
  isSlim = false
}): JSX.Element => {
  const [day, setDay] = useState<string>('01');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');

  useEffect(() => {
    const values: Array<string> | undefined = value?.split('-');

    if (values && values.length > 0) {
      setDay(values[0]);
      setMonth(values[1]);
      setYear(values[2]);
    }
  }, [value]);

  const days: Array<ReactSelectOption> = [...Array(31).keys()].map((key: number): ReactSelectOption => {
    const formattedDay: string = `${key + 1}`.padStart(2, '0');
    return { id: key.toString(), value: formattedDay, label: formattedDay };
  });

  const months: Array<ReactSelectOption> = [...Array(12).keys()].map((key: number): ReactSelectOption => {
    const monthName: string = new Date(0, key).toLocaleString('en', { month: 'long' });
    const monthValue: string = `${key + 1}`.padStart(2, '0');
    return { id: key.toString(), value: monthValue, label: monthName };
  });

  const years: Array<ReactSelectOption> =
    [...Array(startYear - endYear + 1).keys()].map((key: number): ReactSelectOption => {
      const year: number = startYear - key;
      return { id: key.toString(), value: year.toString(), label: year.toString() };
    });

  const getDateValue = (y = year, m = month, d = day) => {
    if (useDay) {
      return `${d}-${m}-${y}`;
    } else {
      return `${y}-${m}-${d}`;
    }
  };

  const handleOnChangeDay = (dayOption: ReactSelectOption) => {
    if (typeof dayOption.value === 'string') {
      setDay(dayOption.value);

      if (year && month && dayOption) {
        onChange?.(getDateValue(year, month, dayOption.value));
      } else {
        onChange?.('');
      }
    }
  };

  const handleOnChangeMonth = (monthOption: ReactSelectOption) => {
    if (typeof monthOption.value === 'string') {
      setMonth(monthOption.value);

      if (year && monthOption && day) {
        onChange?.(getDateValue(year, monthOption.value, day));
      } else {
        onChange?.('');
      }
    }
  };

  const handleOnChangeYear = (yearOption: ReactSelectOption) => {
    if (typeof yearOption.value === 'string') {
      setYear(yearOption.value);

      if (yearOption && month && day) {
        onChange?.(getDateValue(yearOption.value, month, day));
      } else {
        onChange?.('');
      }
    }
  };

  return (
    <div className="tw:flex tw:flex-col">
      { label && (<span className="label">
        <span className="label__text">{label}{ required && (<span>*</span>)}</span>
      </span>)}
      <div className="tw:flex tw:gap-4">
        { useDay &&
          <Dropdown
            options={days}
            placeholder="Day"
            defaultValue={getDefaultOption(days, day)}
            required={required}
            onChange={handleOnChangeDay}
            onBlur={onBlur}
            error={error}
            showErrorText={false}
            isSlim={isSlim}
            hasBorder={hasBorder}
          />
        }
        <Dropdown
          className="tw:w-32"
          options={months}
          placeholder="Month"
          defaultValue={getDefaultOption(months, month)}
          required={required}
          onChange={handleOnChangeMonth}
          onBlur={onBlur}
          error={error}
          showErrorText={false}
          isSlim={isSlim}
          hasBorder={hasBorder}
        />
        <Dropdown
          options={years}
          placeholder="Year"
          defaultValue={getDefaultOption(years, year)}
          required={required}
          onChange={handleOnChangeYear}
          onBlur={onBlur}
          error={error}
          showErrorText={false}
          isSlim={isSlim}
          hasBorder={hasBorder}
        />
      </div>
      { error && <span className="tw:text-sm tw:text-red-500">{error}</span> }
    </div>
  );
};

export default DatePicker;