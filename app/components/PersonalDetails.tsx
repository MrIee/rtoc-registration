import type { ReactNode } from "react";
import TextInput from "../components/TextInput";

interface RadioButtonsProps {
  labels: Array<string>;
};

const RadioButtons = ({ labels }: RadioButtonsProps) => {
  const buttons: ReactNode = labels.map((label: string) =>
    <label className="tw:cursor-pointer">
      <input type="radio" name="btn" />
      <button className="btn tw:!py-2.5 tw:!px-4 tw:!font-normal tw:!rounded-xl tw:!pointer-events-none">{label}</button>
    </label>
  );
  return (
    <div className="btn-radio-group tw:flex tw:gap-6">
      {buttons}
    </div>
  );
};

const PersonalDetails = () => {
  const radioButtons: Array<string> = ['Vet Practitioner', 'Office - Marketing', 'Office - CEO'];

  return (
    <>
      <div className="tw:flex tw:items-center tw:mb-4">
        <span className="tw:mr-3 tw:text-sm">I'm a:</span><RadioButtons labels={radioButtons} />
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
