import classNames from 'classnames';
import type { FC } from 'react';
import type { InputProps } from '../../utilities/interfaces';

interface TextInputProps extends InputProps {
  classes?: string;
  labelBtnLink?: string;
  labelBtnText?: string;
  labelBtnOnClick?: () => void;
  isPassword?: boolean;
  hasBorder?: boolean;
};

export const TextInput: FC<TextInputProps> = ({
  classes,
  label,
  labelBtnLink,
  labelBtnText,
  labelBtnOnClick,
  placeholder,
  name,
  value,
  error,
  isPassword,
  required = true,
  readOnly = false,
  onChange,
  onBlur,
  hasBorder = false
}) => {
  return (
    <label className={classNames('tw:inline-flex tw:flex-col tw:justify-start tw:grow', classes)}>
      { label || labelBtnText &&
        <span>
          { label && <span className="label__text">{label}{ required && (<span>*</span>)}</span> }
          { labelBtnText &&
            <a className="btn btn--small tw:ml-1.5 tw:select-none" href={labelBtnLink} target="_blank" onClick={labelBtnOnClick}>{labelBtnText}</a> }
        </span>
      }
      <input
        className={classNames(
          'tw:w-full',
          {'tw:border tw:border-solid tw:border-gray-300': hasBorder},
          { 'tw:border-red-500 tw:border-2 tw:outline-red-500': error}
        )}
        type={isPassword ? 'password' : 'text'}
        value={value}
        name={name}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        onChange={onChange}
        onBlur={onBlur}
      />
      { error && <span className="tw:text-sm tw:text-red-500">{error}</span> }
    </label>
  );
};

export default TextInput;
