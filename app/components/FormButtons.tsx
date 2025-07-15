import classNames from 'classnames';
import type { FC, JSX } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '~/store/store';
import { goToPreviousStep, goToNextStep } from '~/store/registrationSlice';

interface FormButtonsProps {
  classes?: string;
  enableForwardNav?: boolean;
};

const FormButtons: FC<FormButtonsProps> = ({ classes, enableForwardNav }): JSX.Element => {
  const step = useSelector((state: RootState) => state.registration.step);
  const dispatch = useDispatch();

  return (
    <div className={ classNames('tw:flex tw:justify-between', classes)}>
      { step > 1 && <button className="btn btn--hollow" onClick={() => dispatch(goToPreviousStep())}>Back</button> }
      <div className="tw:ml-auto">
        <button type="submit" className="btn" onClick={() => enableForwardNav && dispatch(goToNextStep())}>Next</button>
      </div>
    </div>
  );
};

export default FormButtons;
