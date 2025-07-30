import type { FC, JSX } from 'react';
import type { InputProps } from '../../utilities/interfaces';

const TextArea: FC<InputProps> = ({ value }): JSX.Element => {
  return (
    <textarea className="tw:w-full tw:p-2 tw:rounded-lg tw:border tw:border-gray-300 tw:focus:outline-rtoc-purple-500">
      {value}
    </textarea>
  );
};

export default TextArea;
