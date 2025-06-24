import type { ReactSelectOption } from "~/utilities/interfaces";
import Dropdown from "./Dropdown";

interface DatePickerProps {
  label?: string;
};

const DatePicker = ({ label }: DatePickerProps) => {
  const months: Array<ReactSelectOption> = [...Array(12).keys()].map((key: number): ReactSelectOption => {
    const monthName: string = new Date(0, key).toLocaleString('en', { month: 'long' });
    return { value: key + 1, label: monthName };
  });

  const years = (): Array<ReactSelectOption> => {
    const startYear: number = new Date().getFullYear();
    const endYear: number = 1970;

    return [...Array(startYear - endYear).keys()].map((key: number): ReactSelectOption => {
      const year: number = startYear - key;
      return { value: year, label: year.toString() };
    });
  };

  return (
    <div className="tw:flex tw:flex-col">
      { label && (<span className="label"><span>{label}<span>*</span></span></span>)}
      <div className="tw:flex tw:gap-4">
        <Dropdown
          className="tw:w-full"
          options={months}
          placeholder="Month"
        />
        <Dropdown
          className="tw:w-full"
          options={years()}
          placeholder="Year"
        />
      </div>
    </div>
  );
};

export default DatePicker;