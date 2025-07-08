import classNames from 'classnames';
import type { FC } from 'react';
import type { InputProps } from '~/utilities/interfaces';

interface TextInputProps extends InputProps {
  isPassword?: boolean;
};

export const TextInput: FC<TextInputProps> = ({ label, placeholder, name, value, error, isPassword, required = true, onChange, onBlur }) => {
  return (
    <label className="tw:w-full tw:inline-flex tw:flex-col tw:justify-start tw:mb-4">
      { label && <span>{label}{ required && (<span>*</span>)}</span> }
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
