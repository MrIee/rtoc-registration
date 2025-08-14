import type { ChangeEvent, FC, JSX } from 'react';
import type { InputProps } from '../../utilities/interfaces';

interface TextAreaProps extends Omit<InputProps, 'onChange'> {
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea: FC<TextAreaProps> = ({ value, defaultValue, onChange }): JSX.Element => {
  return (
    <textarea
      className="tw:w-full tw:p-2 tw:rounded-lg tw:border tw:border-gray-300 tw:focus:outline-rtoc-purple-500"
      value={value}
      defaultValue={defaultValue}
      onChange={(e) => onChange?.(e)}
    />
  );
};

export default TextArea;
