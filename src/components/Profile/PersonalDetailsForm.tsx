import { useState, type FormEvent, type FC, type JSX, type ReactNode, useEffect } from 'react';
import { isPossiblePhoneNumber } from 'libphonenumber-js';
import { newAddress, newUserDetails, type Address, type PersonalDetails, type Postcode, type ReactSelectOption, type UserDetails, type UserDetailsFormFields } from '../../utilities/interfaces';
import { loadReactSelectOptionsAsync } from '../../utilities/helpers';
import { generatePassword } from '../../utilities/helpers';
import useGenericFormProps from '../../hooks/useGenericForm';
import TextInput from '../Inputs/TextInput';
import FormButtons from '../Inputs/FormButtons';
import Dropdown from '../Inputs/Dropdown';
import { getPostcodesAsOptions } from '../../utilities/data';

interface RadioButton {
  value: number;
  label: string;
  selected: boolean;
};

interface RoleRadioButtonsProps {
  buttons: Array<RadioButton>;
  onClick?: (value: number | string) => void;
};

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

interface PersonalDetailsFormProps {
  includeFields?: UserDetailsFormFields;
  personalDetails?: PersonalDetails;
  onSubmit: (isValid: boolean, userDetails: UserDetails, address?: Address) => void;
  customErrors?: UserDetails;
};

const fieldsToInclude: UserDetailsFormFields = {
  preferredname: true,
  password: true,
  address: false,
  nextBtn: true,
};

const PersonalDetailsForm: FC<PersonalDetailsFormProps> = ({
  includeFields = fieldsToInclude,
  personalDetails,
  onSubmit,
  customErrors
}): JSX.Element => {
  const [radioButtons, setRadioButtons] = useState<Array<RadioButton>>([
    { value: 1, label: 'Vet Practitioner', selected: true, },
    { value: 2, label: 'Office - Marketing', selected: false, },
    { value: 3, label: 'Office - CEO', selected: false, },
  ]);

  const {
    formData: userDetails,
    setFormData: setUserDetails,
    errors: userDetailsErrors,
    setErrors: setUserDetailsErrors,
    isFormValid: isUserDetailsValid,
    handleOnChange: handleOnChangeUserDetail,
    validateField: validateUserDetailField,
  } = useGenericFormProps<UserDetails>(newUserDetails);

  const {
    formData: address,
    setFormData: setAddress,
    errors: addressErrors,
    isFormValid: isAddressValid,
    handleOnChange: handleOnChangeAddress,
    handleOnChangeDropdown: handleOnChangeAddressDropdown,
    validateField: validateAddress,
  } = useGenericFormProps<Address>(newAddress);

  const loadPostcodes = loadReactSelectOptionsAsync(getPostcodesAsOptions);

  const STATE_OPTIONS: Array<ReactSelectOption> = [
    { id: '0', value: 'New South Wales', label: 'NSW'},
    { id: '1', value: 'Victoria', label: 'VIC'},
    { id: '2', value: 'Queensland', label: 'QLD'},
    { id: '3', value: 'South Australia', label: 'SA'},
    { id: '4', value: 'Western Australia', label: 'WA'},
    { id: '5', value: 'Tasmania', label: 'TAS'},
    { id: '6', value: 'Northen Territory', label: 'NT'},
    { id: '7', value: 'Australian Capital Territory', label: 'ACT'},
  ];

  useEffect(() => {
    setUserDetails((prevUserDetails: UserDetails) => ({
      ...prevUserDetails,
      firstname: personalDetails?.firstname || prevUserDetails.firstname,
      familyname: personalDetails?.familyname || prevUserDetails.familyname,
      preferredname: personalDetails?.preferredname || prevUserDetails.preferredname,
      phone: personalDetails?.phone || prevUserDetails.phone,
      email: personalDetails?.email || prevUserDetails.email,
    }));
  }, [setUserDetails, personalDetails]);

  useEffect(() => {
    setAddress((prevAddress: Address) => ({
      ...prevAddress,
      address1: personalDetails?.address1 || prevAddress.address1,
      address2: personalDetails?.address2 || prevAddress.address2,
      suburb: personalDetails?.suburb || prevAddress.suburb,
      postcode: personalDetails?.postcode || prevAddress.postcode,
      state: personalDetails?.state || prevAddress.state,
    }));
  }, [setAddress, personalDetails]);

  useEffect(() => {
    setUserDetailsErrors((prevErrors: UserDetails) => ({ ...prevErrors, ...customErrors }));
  }, [setUserDetailsErrors, customErrors]);

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

  const handleOnChangePostcode = (option: ReactSelectOption) => {
    if (typeof option.value === 'object' && Object.hasOwn(option.value || {}, 'postcode')) {
      const value: Postcode = (option.value as Postcode);

      setAddress({
        ...address,
        suburb: value.locality,
        state: value.state,
        postcode: value.postcode || ''
      });
    }
  };

  const validateFirstName = () => {
    validateUserDetailField('firstname', 'Please enter your first name');
  };

  const validatePreferredName = () => {
    validateUserDetailField('preferredname', 'Please enter your preferred name');
  };

  const validateFamilyName = () => {
    validateUserDetailField('familyname', 'Please enter your family name');
  };

  const validateEmail = () => {
    const regex: RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const isEmailValid: boolean = regex.test(userDetails.email);

    if (!isEmailValid || !userDetails.email) {
      setUserDetailsErrors((prevErrors: UserDetails) => ({ ...prevErrors, email: 'Please enter a valid email' }));
      isUserDetailsValid.current = false;
    } else {
      setUserDetailsErrors((prevErrors: UserDetails) => ({ ...prevErrors, email: '' }));
    }
  };

  const validatePhoneNumber = () => {
    const phone: string = userDetails.phone.replaceAll(' ', '');
    const isPhoneValid: boolean = isPossiblePhoneNumber(phone, 'AU') || isPossiblePhoneNumber(phone, 'NZ');

    if (!isPhoneValid) {
      setUserDetailsErrors((prevErrors: UserDetails) => ({ ...prevErrors, phone: 'Please enter a valid phone number' }));
      isUserDetailsValid.current = false;
    } else {
      setUserDetailsErrors((prevErrors: UserDetails) => ({ ...prevErrors, phone: '' }));
    }
  };

  const validatePassword = () => {
    validateUserDetailField('password', 'Please enter a password');
  };

  const validateAddress1 = () => {
    validateAddress('address1', 'Please enter an address');
  };

  const validateSuburb = () => {
    validateAddress('suburb', 'Please enter a suburb');
  };

  const validateState = () => {
    validateAddress('state', 'Please choose a state');
  };

  const validatePostcode = () => {
    validateAddress('postcode', 'Please enter a postcode');
  };

  const handleSubmit = (event: FormEvent) => {
    event?.preventDefault();
    isUserDetailsValid.current = true;
    isAddressValid.current = true;
    validateFirstName();
    validateFamilyName();
    validateEmail();
    validatePhoneNumber();

    if (includeFields.preferredname) {
      validatePreferredName();
    }

    if (includeFields.password) {
      validatePassword();
    }

    if (includeFields.address) {
      validateAddress1();
      validateSuburb();
      validateState();
      validatePostcode();
    }

    onSubmit(isUserDetailsValid.current && isAddressValid.current, userDetails, address);
  };

  const handleGeneratePassword = () => {
    setUserDetails((prevUserDetails: UserDetails) => ({...prevUserDetails, password: generatePassword()}));
  };

  return (
    <form className="tw:w-full tw:inline-flex tw:flex-col" onSubmit={handleSubmit} noValidate>
      <div className="container">
        {
          // Hide Role radio buttons for the time being.
          // eslint-disable-next-line no-constant-binary-expression
          false && (
            <div className="tw:flex tw:lg:flex-row tw:lg:items-center tw:mb-4">
              <span className="tw:lg:mb-0 tw:mb-1 tw:mr-3 tw:text-sm">I'm a:</span>
              <RoleRadioButtons buttons={radioButtons} onClick={onClickPosition} />
            </div>
          )
        }
        <div className="tw:grid tw:grid-cols-2 tw:gap-4 tw:mb-4">
          <TextInput
            classes="tw:w-full"
            label="First Name"
            name="firstname"
            value={userDetails?.firstname}
            placeholder="Enter first name"
            error={userDetailsErrors.firstname}
            onChange={handleOnChangeUserDetail}
            onBlur={() => userDetailsErrors.firstname && validateFirstName()}
          />
          { includeFields.preferredname &&
            <TextInput
              classes="tw:w-full"
              label="Preferred Name"
              name="preferredname"
              value={userDetails?.preferredname}
              placeholder="Enter preferred name"
              error={userDetailsErrors.preferredname}
              onChange={handleOnChangeUserDetail}
              onBlur={() => userDetailsErrors.preferredname && validatePreferredName()}
            />
          }
          <TextInput
            classes="tw:w-full"
            label="Family Name"
            name="familyname"
            value={userDetails?.familyname}
            placeholder="Enter family name"
            error={userDetailsErrors.familyname}
            onChange={handleOnChangeUserDetail}
            onBlur={() => userDetailsErrors.familyname && validateFamilyName()}
          />
          <TextInput
            classes="tw:w-full"
            label="Phone"
            name="phone"
            value={userDetails?.phone}
            placeholder="Enter phone"
            error={userDetailsErrors.phone}
            onChange={handleOnChangeUserDetail}
            onBlur={() => userDetailsErrors.phone && validatePhoneNumber()}
          />
          <TextInput
            classes="tw:w-full"
            label="Email"
            name="email"
            value={userDetails?.email}
            placeholder="Enter email"
            error={userDetailsErrors.email}
            onChange={handleOnChangeUserDetail}
            onBlur={() => userDetailsErrors.email && validateEmail()}
          />
          { includeFields.password &&
            <TextInput
              classes="tw:w-full"
              labelBtnText="Generate Password"
              labelBtnOnClick={handleGeneratePassword}
              label="Password"
              name="password"
              value={userDetails?.password}
              placeholder="Enter password"
              error={userDetailsErrors.password}
              onChange={handleOnChangeUserDetail}
              onBlur={() => userDetailsErrors.password && validatePassword()}
            />
          }
          { includeFields.address &&
            <>
              <TextInput
                classes="tw:w-full"
                label="Address Line 1"
                name="address1"
                value={address?.address1}
                placeholder="Enter address line 1"
                error={addressErrors.address1}
                onChange={handleOnChangeAddress}
                onBlur={() => addressErrors.address1 && validateAddress1()}
              />
              <TextInput
                classes="tw:w-full"
                label="Address Line 2"
                name="address2"
                value={address?.address2}
                placeholder="Enter address line 2"
                onChange={handleOnChangeAddress}
              />
            </>
          }
        </div>
        <div className="tw:grid tw:grid-cols-3 tw:gap-4 tw:mb-4">
          { includeFields.address &&
            <>
              <TextInput
                classes="tw:w-full"
                label="Suburb"
                name="suburb"
                value={address?.suburb}
                placeholder="Enter suburb"
                error={addressErrors.suburb}
                onChange={handleOnChangeAddress}
                onBlur={() => addressErrors.suburb && validateSuburb()}
              />
              <Dropdown
                className="tw:w-full"
                options={STATE_OPTIONS}
                label="State"
                name="state"
                placeholder="Choose state"
                dropdownValue={ address.state ? { label: address.state } : null}
                error={addressErrors.state}
                onChange={handleOnChangeAddressDropdown}
                onBlur={() => addressErrors.state && validateState()}
              />
              <Dropdown
                className="tw:w-full"
                isAsync
                isSearchable
                loadOptions={loadPostcodes}
                label="Postcode"
                placeholder="Enter postcode"
                name="postcode"
                dropdownValue={address.postcode? { label: address.postcode } : null}
                error={addressErrors.postcode}
                onChange={handleOnChangePostcode}
                onBlur={() => addressErrors.postcode && validatePostcode()}
              />
            </>
          }
        </div>
      </div>
      { includeFields.nextBtn ?
        <FormButtons classes="tw:mt-auto" />
        : <button className="btn tw:ml-auto" type="submit">Save</button>
      }
    </form>
  );
};

export default PersonalDetailsForm;
