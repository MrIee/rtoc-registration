import { type FC, type FormEvent, type JSX } from 'react';
import { ACTIVITY_DELIVERY_OPTIONS, ACTIVITY_DURATION_OPTIONS } from '../../utilities/constants';
import { newActivity, type Activity, type ReactSelectOption } from '../../utilities/interfaces';
import Dropdown from '../Inputs/Dropdown';
import TextArea from '../Inputs/TextArea';
import TextInput from '../Inputs/TextInput';
import DatePicker from '../Inputs/DatePicker';
import useGenericFormProps from '../../hooks/useGenericForm';
import FormAddCancelButtons from '../FormAddCancelButtons';

interface ActivityFormProps {
  onCancel?: () => void;
  onSubmit: (isValid: boolean, activity: Activity) => void;
};

const ActivityForm: FC<ActivityFormProps> = ({ onSubmit, onCancel }): JSX.Element => {
  const {
    formData,
    setFormData,
    errors,
    isFormValid,
    handleOnChangeDropdown,
    validateField,
  } = useGenericFormProps<Activity>(newActivity);

  const sectionOptons: Array<ReactSelectOption> = [
    { id: '0', value: 'Industry', label: 'Industry' },
    { id: '1', value: 'VET', label: 'VET' },
  ];

  const validateActivityName = () => {
    validateField('activity', 'Please enter an Activity Name');
  };

  const validateMode = () => {
    validateField('mode', 'Please choose a mode of delivery');
  };

  const validateOutcomes = () => {
    validateField('outcomes', 'Please enter learning outcomes');
  };

  const validateProvider = () => {
    validateField('provider', 'Please enter a provider');
  };

  const validateDate = () => {
    validateField('date', 'Please choose a date');
  };

  const validateDuration = () => {
    validateField('duration', 'Please choose a duration');
  };

  const validateSection = () => {
    validateField('section', 'Please choose a section');
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    isFormValid.current = true;
    validateActivityName();
    validateMode();
    validateOutcomes();
    validateProvider();
    validateDate();
    validateDuration();
    validateSection();
    onSubmit(isFormValid.current, formData);
  };

  return (
    <form className="form-container" onSubmit={handleSubmit} noValidate>
      <div className="scroll-container">
        <TextInput
          label="Activity Name"
          onChange={(e) => setFormData({...formData, activity: e.target.value})}
          onBlur={() => errors.activity && validateActivityName()}
          error={errors.activity}
        />
        <Dropdown
          label="Mode of Delivery"
          options={ACTIVITY_DELIVERY_OPTIONS}
          name="mode"
          onChange={handleOnChangeDropdown}
          onBlur={() => errors.mode && validateMode()}
          error={errors.mode}
        />
        <TextArea
          label="Learning Outcomes"
          required
          onChange={(e) => setFormData({...formData, outcomes: e.target.value})}
          onBlur={() => errors.outcomes && validateOutcomes()}
          error={errors.outcomes}
        />
        <TextInput
          label="Provider"
          validate="provider"
          onChange={(e) => setFormData({...formData, provider: e.target.value})}
          onBlur={() => errors.provider && validateProvider()}
          error={errors.provider}
        />
        <DatePicker
          label="Date"
          onChange={(date) => setFormData({ ...formData, date })}
          onBlur={() => errors.date && validateDate()}
          useDay
          error={errors.date}
          />
        <Dropdown
          label="Duration"
          options={ACTIVITY_DURATION_OPTIONS}
          name="duration"
          onChange={handleOnChangeDropdown}
          onBlur={() => errors.duration && validateDuration()}
          error={errors.duration}
        />
        <Dropdown
          label="Section"
          options={sectionOptons}
          name="section"
          onChange={handleOnChangeDropdown}
          onBlur={() => errors.section && validateSection()}
          error={errors.section}
        />
        <FormAddCancelButtons onCancel={onCancel} />
      </div>
    </form>
  );
};

export default ActivityForm;
