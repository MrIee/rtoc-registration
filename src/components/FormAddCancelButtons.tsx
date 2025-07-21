import type { FC, JSX } from 'react';

interface FormAddCancelButtonsProps {
  onCancel?: () => void;
  onAdd?: () => void;
}

const FormAddCancelButtons: FC<FormAddCancelButtonsProps> = ({ onCancel, onAdd }): JSX.Element => {
  return (
    <div className="tw:flex tw:justify-end tw:mt-auto">
      <button type="button" className="btn btn--secondary tw:mr-6" onClick={onCancel}>Cancel</button>
      <button type="submit" className="btn" onClick={onAdd}>Add</button>
    </div>
  );
};

export default FormAddCancelButtons;
