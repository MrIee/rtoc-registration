import type { ChangeEvent, FC, JSX } from 'react';
import type { InputProps } from '../../utilities/interfaces';
import classNames from 'classnames';

interface TextAreaProps extends Omit<InputProps, 'onChange'> {
  columns?: number;
  rows?: number;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea: FC<TextAreaProps> = ({ classes, columns, rows, value, defaultValue, label, required, onChange, onBlur, error }): JSX.Element => {
  return (
    <label className={classNames('tw:inline-flex tw:flex-col tw:justify-start tw:grow', classes)}>
      { label &&
        <span>
          { label && <span className="label__text">{label}{ required && (<span>*</span>)}</span> }
        </span>
      }
      <textarea
        className={classNames(
          'tw:w-full tw:p-2 tw:border tw:border-gray-300 tw:focus:outline-rtoc-purple-500',
          {'tw:border-red-500 tw:border-2 tw:outline-red-500': error}
        )}
        cols={columns}
        rows={rows}
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => onChange?.(e)}
        onBlur={onBlur}
      />
      { error && <span className="tw:text-sm tw:text-red-500">{error}</span> }
    </label>
  );
};

export default TextArea;
