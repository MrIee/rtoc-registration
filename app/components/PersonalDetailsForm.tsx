import { useState, type FormEvent, type FC, type JSX, type ReactNode, type PropsWithChildren, type ChangeEvent, useRef } from 'react';
import { isPossiblePhoneNumber } from 'libphonenumber-js';
import type { UserDetails } from '~/utilities/interfaces';
import TextInput from "./TextInput";
import { authUser, createUser } from '~/utilities/data';

interface RadioButton {
  value: number;
  label: string;
  selected: boolean;
};

interface RadioButtonsProps {
  buttons: Array<RadioButton>;
  onClick?: (value: number | string) => void;
};

interface PersonalDetailsProps extends PropsWithChildren {
  onValidate?: (isValid: boolean) => void;
}

const RadioButtons = ({ buttons, onClick }: RadioButtonsProps) => {
  const onClickButton = (value: number) => onClick ? onClick(value) : false;

  const buttonsDOM: ReactNode = buttons.map((button: RadioButton, index: number) =>
    <label key={index} className="tw:cursor-pointer">
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

const PersonalDetailsForm: FC = ({ onValidate, children}: PersonalDetailsProps): JSX.Element => {
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
    if (!isPossiblePhoneNumber(userDetails.phone, 'AU')) {
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

  const onSubmit = async (event: FormEvent | undefined) => {
    event?.preventDefault();
    isFormValid.current = true;
    validateName('firstname');
    validateName('preferredname');
    validateName('familyname');
    validateEmail();
    validatePhoneNumber();
    validatePassword();

    if (isFormValid.current) {
      const newUser = await createUser(userDetails);

      if (newUser && Object.hasOwn(newUser, 'error')) {
        setErrors((prevErrors: UserDetails) => ({ ...prevErrors, email: newUser?.error }));
        return false;
      }

      await authUser(userDetails.email, userDetails.password);
      onValidate?.(isFormValid.current);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="tw:flex tw:lg:flex-row tw:flex-col tw:lg:items-center tw:mb-4">
        <span className="tw:lg:mb-0 tw:mb-1 tw:mr-3 tw:text-sm">I'm a:</span>
        <RadioButtons buttons={radioButtons} onClick={onClickPosition} />
      </div>
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
      {children}
    </form>
  );
};

export default PersonalDetailsForm;
