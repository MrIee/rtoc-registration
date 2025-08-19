import { type FC, type FormEvent, type JSX } from 'react';
import { newSubscription, type ReactSelectOption, type Subscription } from '../../utilities/interfaces';
import TextInput from '../Inputs/TextInput';
import DatePicker from '../Inputs/DatePicker';
import useGenericFormProps from '../../hooks/useGenericForm';
import FormAddCancelButtons from '../FormAddCancelButtons';
import Dropdown from '../Inputs/Dropdown';

interface SubscriptionFormProps {
  onCancel?: () => void;
  onSubmit: (isValid: boolean, subscription: Subscription) => void;
};

const ActivityForm: FC<SubscriptionFormProps> = ({ onSubmit, onCancel }): JSX.Element => {
  const {
    formData,
    setFormData,
    errors,
    isFormValid,
    validateField,
    handleOnChangeDropdown,
  } = useGenericFormProps<Subscription>(newSubscription);

  const renewalOptions: Array<ReactSelectOption> = [
    { id: '0', value: 'monthly', label: 'monthly' },
    { id: '1', value: 'annual', label: 'annual' },
  ];

  const sectionOptions: Array<ReactSelectOption> = [
    { id: '0', value: 'Industry', label: 'Industry' },
    { id: '1', value: 'VET', label: 'VET' },
  ];

  const validateSection = () => {
    validateField('section', 'Please choose a subscription type');
  };

  const validateProvider = () => {
    validateField('provider', 'Please enter a provider name');
  };

  const validateMemberNumber = () => {
    validateField('member', 'Please enter a member number');
  };

  const validateRenewal = () => {
    validateField('renewal', 'Please choose a renewal period');
  };

  const validateCommenced = () => {
    validateField('commenced', 'Please choose a commencement date');
  };

  const validateAnniversary = () => {
    validateField('anniversary', 'Please choose an anniversary date');
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    isFormValid.current = true;
    validateSection();
    validateProvider();
    validateMemberNumber();
    validateRenewal();
    validateCommenced();
    validateAnniversary();
    onSubmit(isFormValid.current, formData);
  };

  return (
    <form className="form-container" onSubmit={handleSubmit} noValidate>
      <div className="scroll-container">
        <Dropdown
          label="Type of Subscription"
          options={sectionOptions}
          name="section"
          onChange={handleOnChangeDropdown}
          onBlur={() => errors.section && validateSection()}
          error={errors.section}
        />
        <TextInput
          label="Provider"
          onChange={(e) => setFormData({...formData, provider: e.target.value})}
          onBlur={() => errors.provider && validateProvider()}
          error={errors.provider}
        />
        <TextInput
          label="Member Number"
          onChange={(e) => setFormData({...formData, member: e.target.value})}
          onBlur={() => errors.member && validateMemberNumber()}
          error={errors.member}
        />
        <Dropdown
          label="Renewal Period"
          options={renewalOptions}
          name="renewal"
          onChange={handleOnChangeDropdown}
          onBlur={() => errors.renewal && validateRenewal()}
          error={errors.renewal}
        />
        <DatePicker
          label="Date Commenced"
          useDay
          onChange={(commenced) => setFormData({ ...formData, commenced })}
          onBlur={() => errors.commenced && validateCommenced()}
          error={errors.commenced}
        />
        <DatePicker
          label="Subscription Anniversary"
          useDay
          onChange={(anniversary) => setFormData({ ...formData, anniversary })}
          onBlur={() => errors.anniversary && validateAnniversary()}
          error={errors.anniversary}
        />
        <FormAddCancelButtons onCancel={onCancel} />
      </div>
    </form>
  );
};

export default ActivityForm;
