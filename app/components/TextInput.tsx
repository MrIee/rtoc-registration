import classNames from 'classnames';
import type { FC } from 'react';
import type { InputProps } from '~/utilities/interfaces';

interface TextInputProps extends InputProps {
  classes?: string;
  labelLink?: string;
  labelLinkText?: string;
  isPassword?: boolean;
};

export const TextInput: FC<TextInputProps> = ({
  classes,
  label,
  labelLink,
  labelLinkText,
  placeholder,
  name,
  value,
  error,
  isPassword,
  required = true,
  onChange,
  onBlur
}) => {
  return (
    <label className={classNames('tw:w-full tw:inline-flex tw:flex-col tw:justify-start', classes)}>
      <span>
        { label && <span className="label__text">{label}{ required && (<span>*</span>)}</span> }
        { labelLink && <a className="btn btn--small tw:ml-1.5" href={labelLink} target="_blank">{labelLinkText}</a> }
      </span>
      <input
        className={classNames('tw:w-full', { 'tw:border-red-500 tw:border-2 tw:outline-red-500': error })}
        type={isPassword ? 'password' : 'text'}
        value={value}
        name={name}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        onBlur={onBlur}
      />
      { error && <span className="tw:text-sm tw:text-red-500">{error}</span> }
    </label>
  );
};

export default TextInput;
