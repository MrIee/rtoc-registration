import { useState, type ReactNode } from "react";
import TextInput from "../components/TextInput";

interface RadioButton {
  value: number;
  label: string;
  selected: boolean;
};

interface RadioButtonsProps {
  buttons: Array<RadioButton>;
  onClick?: (value: number | string) => void;
};

const RadioButtons = ({ buttons, onClick }: RadioButtonsProps) => {
  const onClickButton = (value: number) => onClick ? onClick(value) : false;

  const buttonsDOM: ReactNode = buttons.map((button: RadioButton) =>
    <label className="tw:cursor-pointer">
      <input type="radio" name="btn" checked={button.selected} onClick={() => onClickButton(button.value)} />
      <button className="btn tw:!py-2.5 tw:!px-4 tw:!font-normal tw:!rounded-xl tw:!pointer-events-none">
        {button.label}
      </button>
    </label>
  );
  return (
    <div className="btn-radio-group tw:flex tw:gap-6">
      {buttonsDOM}
    </div>
  );
};

const PersonalDetails = () => {
  const [radioButtons, setRadioButtons] = useState<Array<RadioButton>>([
    { value: 1, label: 'Vet Practitioner', selected: true, },
    { value: 2, label: 'Office - Marketing', selected: false, },
    { value: 3, label: 'Office - CEO', selected: false, },
  ]);

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

  return (
    <>
      <div className="tw:flex tw:items-center tw:mb-4">
        <span className="tw:mr-3 tw:text-sm">I'm a:</span>
        <RadioButtons buttons={radioButtons} onClick={onClickPosition} />
      </div>
      <div className="tw:flex tw:gap-4">
        <TextInput label="First Name" placeholder="Enter first name" />
        <TextInput label="Preferred Name" placeholder="Enter preferred name" />
      </div>
      <TextInput label="Family Name" placeholder="Enter family name" />
      <div className="tw:flex tw:gap-4">
        <TextInput label="Email" placeholder="Enter email" />
        <TextInput label="Phone" placeholder="Enter phone" />
      </div>
    </>
  );
};

export default PersonalDetails;
