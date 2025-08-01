import type { InputProps, ReactSelectOption } from '../../utilities/interfaces';
import Dropdown from './Dropdown';
import { useState, type FC, type JSX } from 'react';
interface DatePickerProps extends Omit<InputProps, 'onChange'> {
  useDay?: boolean;
  hasBorder?: boolean;
  onChange?: (date: string) => void;
}

const END_YEAR = 1970;

const DatePicker: FC<DatePickerProps> = ({ useDay = false, label, required = true, hasBorder = false, error, onChange, onBlur }): JSX.Element => {
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');

  const days: Array<ReactSelectOption> = [...Array(31).keys()].map((key: number): ReactSelectOption => {
    const formattedDay: string = `${key + 1}`.padStart(2, '0');
    return { id: key.toString(), value: formattedDay, label: formattedDay };
  });

  const months: Array<ReactSelectOption> = [...Array(12).keys()].map((key: number): ReactSelectOption => {
    const monthName: string = new Date(0, key).toLocaleString('en', { month: 'long' });
    const monthValue: string = `${key + 1}`.padStart(2, '0');
    return { id: key.toString(), value: monthValue, label: monthName };
  });

  const years = (): Array<ReactSelectOption> => {
    const startYear: number = new Date().getFullYear();

    return [...Array(startYear - END_YEAR + 1).keys()].map((key: number): ReactSelectOption => {
      const year: number = startYear - key;
      return { id: key.toString(), value: year.toString(), label: year.toString() };
    });
  };

  const handleOnChangeDay = (dayOption: ReactSelectOption) => {
    console.log(dayOption);
    // if (typeof monthOption.value === 'string') {
    //   setMonth(monthOption.value);

    //   if (monthOption && year) {
    //     onChange?.(`${year}-${monthOption.value}-01`);
    //   } else {
    //     onChange?.('');
    //   }
    // }
  };

  const handleOnChangeMonth = (monthOption: ReactSelectOption) => {
    if (typeof monthOption.value === 'string') {
      setMonth(monthOption.value);

      if (monthOption && year) {
        onChange?.(`${year}-${monthOption.value}-01`);
      } else {
        onChange?.('');
      }
    }
  };

  const handleOnChangeYear = (yearOption: ReactSelectOption) => {
    if (typeof yearOption.value === 'string') {
      setYear(yearOption.value);

      if (month && yearOption) {
        onChange?.(`${yearOption.value}-${month}-01`);
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
            className="tw:w-full"
            options={days}
            placeholder="Day"
            required={required}
            onChange={handleOnChangeDay}
            onBlur={onBlur}
            error={error}
            showErrorText={false}
            hasBorder={hasBorder}
          />
        }
        <Dropdown
          className="tw:w-full"
          options={months}
          placeholder="Month"
          required={required}
          onChange={handleOnChangeMonth}
          onBlur={onBlur}
          error={error}
          showErrorText={false}
          hasBorder={hasBorder}
        />
        <Dropdown
          className="tw:w-full"
          options={years()}
          placeholder="Year"
          required={required}
          onChange={handleOnChangeYear}
          onBlur={onBlur}
          error={error}
          showErrorText={false}
          hasBorder={hasBorder}
        />
      </div>
      { error && <span className="tw:text-sm tw:text-red-500">{error}</span> }
    </div>
  );
};

export default DatePicker;