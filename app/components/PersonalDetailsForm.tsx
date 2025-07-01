import { useState, type FormEvent, type FC, type JSX, type ReactNode, type ChangeEvent, useRef, useEffect } from 'react';
import { isPossiblePhoneNumber } from 'libphonenumber-js';
import type { UserDetails } from '~/utilities/interfaces';
import TextInput from './TextInput';
import FormButtons from './FormButtons';

interface RadioButton {
  value: number;
  label: string;
  selected: boolean;
};

interface RoleRadioButtonsProps {
  buttons: Array<RadioButton>;
  onClick?: (value: number | string) => void;
};

interface PersonalDetailsFormProps {
  handleValidate: (isValid: boolean, userDetails: UserDetails) => void;
  onClickBackBtn?: () => void;
  onClickNextBtn?: () => void;
  customErrors?: UserDetails;
}

const RoleRadioButtons: FC<RoleRadioButtonsProps> = ({ buttons, onClick }): JSX.Element => {
  const onClickButton = (value: number) => onClick ? onClick(value) : false;

  const buttonsDOM: ReactNode = buttons.map((button: RadioButton, index: number) =>
    <label key={index} className="tw:!cursor-pointer">
      <input type="radio" name="btn" checked={button.selected} onClick={() => onClickButton(button.value)} readOnly />
      <button className="btn tw:!py-2.5 tw:!px-4 tw:lg:!text-base tw:!text-sm tw:!font-normal tw:!rounded-xl tw:!pointer-events-none">
        {button.label}
      </button>
    </label>
  );

  return (
    <div className="btn-radio-group tw:flex tw:lg:gap-6 tw:gap-4">
      {buttonsDOM}
    </div>
  );
};

const PersonalDetailsForm: FC<PersonalDetailsFormProps> = ({ handleValidate, onClickBackBtn, onClickNextBtn, customErrors }): JSX.Element => {
  const [radioButtons, setRadioButtons] = useState<Array<RadioButton>>([
    { value: 1, label: 'Vet Practitioner', selected: true, },
    { value: 2, label: 'Office - Marketing', selected: false, },
    { value: 3, label: 'Office - CEO', selected: false, },
  ]);

  const [userDetails, setUserDetails] = useState<UserDetails>({
    firstname: '',
    preferredname: '',
    familyname: '',
    phone: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<UserDetails>({} as UserDetails);
  const isFormValid = useRef<boolean>(false);

  useEffect(() => {
    setErrors({ ...errors, ...customErrors });
  }, [customErrors]);

  const onClickPosition = (value: number | string) => {
    const updatedRadioButtons: Array<RadioButton> = radioButtons.map((button: RadioButton) => {
      button.selected = false;

      if (button.value === value) {
        button.selected = true;
      }

      return button;
    });

    setRadioButtons(updatedRadioButtons);
  };

  const updateUserDetails = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserDetails({...userDetails, [name]: value });
  };

  const validateName = (name: string) => {
    let nameString: string = '';

    switch(name) {
      case 'firstname':
        nameString = 'First Name';
        break;
      case 'preferredname':
        nameString = 'Preferred Name';
        break;
      case 'familyname':
        nameString = 'Family Name';
        break;
    }

    if (!userDetails[name as keyof typeof userDetails]) {
      setErrors((prevErrors: UserDetails) => ({ ...prevErrors, [name]: 'Please enter your ' + nameString }));
      isFormValid.current = false;
    } else {
      setErrors((prevErrors: UserDetails) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const validateEmail = () => {
    const regex: RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const isEmailValid: boolean = regex.test(userDetails.email);

    if (!isEmailValid || !userDetails.email) {
      setErrors((prevErrors: UserDetails) => ({ ...prevErrors, email: 'Please enter a valid email' }));
      isFormValid.current = false;
    } else {
      setErrors((prevErrors: UserDetails) => ({ ...prevErrors, email: '' }));
    }
  };

  const validatePhoneNumber = () => {
    const isPhoneValid: boolean = isPossiblePhoneNumber(userDetails.phone, 'AU') || isPossiblePhoneNumber(userDetails.phone, 'NZ');

    if (!isPhoneValid) {
      setErrors((prevErrors: UserDetails) => ({ ...prevErrors, phone: 'Please enter a valid phone number' }));
      isFormValid.current = false;
    } else {
      setErrors((prevErrors: UserDetails) => ({ ...prevErrors, phone: '' }));
    }
  };

  const validatePassword = () => {
    if (!userDetails.password) {
      setErrors((prevErrors: UserDetails) => ({ ...prevErrors, password: 'Please enter a password' }));
      isFormValid.current = false;
    } else {
      setErrors((prevErrors: UserDetails) => ({ ...prevErrors, password: '' }));
    }
  };

  const onSubmit = (event: FormEvent | undefined) => {
    event?.preventDefault();
    isFormValid.current = true;
    validateName('firstname');
    validateName('preferredname');
    validateName('familyname');
    validateEmail();
    validatePhoneNumber();
    validatePassword();
    handleValidate(isFormValid.current, userDetails);
  };

  return (
    <form className="registration-form" onSubmit={onSubmit} noValidate>
      {
        // Hide Role radio buttons for the time being.
        // eslint-disable-next-line no-constant-binary-expression
        false && (
          <div className="tw:flex tw:lg:flex-row tw:flex-col tw:lg:items-center tw:mb-4">
            <span className="tw:lg:mb-0 tw:mb-1 tw:mr-3 tw:text-sm">I'm a:</span>
            <RoleRadioButtons buttons={radioButtons} onClick={onClickPosition} />
          </div>
        )
      }
      <div className="tw:flex tw:gap-4">
        <TextInput
          label="First Name"
          name="firstname"
          value={userDetails?.firstname}
          placeholder="Enter first name"
          error={errors.firstname}
          onChange={updateUserDetails}
          onBlur={() => errors.firstname && validateName('firstname')}
        />
        <TextInput
          label="Preferred Name"
          name="preferredname"
          value={userDetails?.preferredname}
          placeholder="Enter preferred name"
          error={errors.preferredname}
          onChange={updateUserDetails}
          onBlur={() => errors.preferredname && validateName('preferredname')}
        />
      </div>
      <div className="tw:flex tw:gap-4">
        <TextInput
          label="Family Name"
          name="familyname"
          value={userDetails?.familyname}
          placeholder="Enter family name"
          error={errors.familyname}
          onChange={updateUserDetails}
          onBlur={() => errors.familyname && validateName('familyname')}
        />
        <TextInput
          label="Phone"
          name="phone"
          value={userDetails?.phone}
          placeholder="Enter phone"
          error={errors.phone}
          onChange={updateUserDetails}
          onBlur={() => errors.phone && validatePhoneNumber()}
        />
      </div>
      <div className="tw:flex tw:gap-4">
        <TextInput
          label="Email"
          name="email"
          value={userDetails?.email}
          placeholder="Enter email"
          error={errors.email}
          onChange={updateUserDetails}
          onBlur={() => errors.email && validateEmail()}
        />
        <TextInput
          label="Password"
          name="password"
          value={userDetails?.password}
          placeholder="Enter password"
          error={errors.password}
          onChange={updateUserDetails}
          onBlur={() => errors.password && validatePassword()}
        />
      </div>
      <FormButtons classes="tw:mt-auto" onClickBackBtn={onClickBackBtn} onClickNextBtn={onClickNextBtn} />
    </form>
  );
};

export default PersonalDetailsForm;
