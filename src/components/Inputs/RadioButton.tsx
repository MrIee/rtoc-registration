import type { FC, JSX } from 'react';
import type { InputProps } from '../../utilities/interfaces';

const RadioButton: FC<InputProps> = ({ label, name, onChange }): JSX.Element => {
  return (
    <label className="input__radio-wrapper">
      <input type="radio" name={name} onChange={onChange} />
      <span className="input__radio"></span>
      <span>{label}</span>
    </label>
  );
};

export default RadioButton;
