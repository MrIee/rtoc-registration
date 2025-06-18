import logo from "../assets/images/rtoc-logo.png";
import { useState } from "react";
import Steps from '../components/Steps';
import PersonalDetails from '../components/PersonalDetails';

const CreateProfile = () => {
  const [profileSteps, setProfileSteps] = useState([
    {
      label: '1. Personal details',
      id: 1,
      active: true,
    },
    {
      label: '2. VET Qualifications',
      id: 1,
      active: false,
    },
    {
      label: '3. Higher Education',
      id: 1,
      active: false,
    },
    {
      label: '4. Experience',
      id: 1,
      active: false,
    },
  ]);

  return (
    <div className="tw:h-full tw:w-[640px] tw:mx-auto tw:py-9 tw:flex tw:flex-col">
      <img className="tw:w-20 tw:mb-1 tw:self-center" src={logo} alt="logo" />
      <h2 className="tw:text-center tw:mb-8">Create a Profile</h2>

      <Steps classes={'tw:mb-8'} steps={profileSteps}  />
      <PersonalDetails />

      <div className="tw:flex tw:justify-between tw:mt-auto">
        <button className="btn btn--hollow">Back</button>
        <div>
          <button className="btn btn--clear tw:mr-4">Skip</button>
          <button className="btn">Next</button>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
