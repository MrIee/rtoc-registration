import logo from "../assets/images/logo-rtoc.png";
import { type RegistrationFormComponentProps, type Step } from "~/utilities/interfaces";
import { useState, type FC, type JSX } from "react";
import Steps from '../components/Steps';
import PersonalDetailsForm from '../components/PersonalDetailsForm';
import VETQualifications from '../components/VETQualifications';

const CreateProfile: FC = (): JSX.Element => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSaveBtnVisible, setIsSaveBtnVisible] = useState<boolean>(false);
  const [profileSteps, setProfileSteps] = useState<Array<Step>>([
    {
      label: '1. Personal details',
      active: true,
      component: PersonalDetailsForm,
    },
    {
      label: '2. VET Qualifications',
      active: false,
      component: VETQualifications,
    },
    {
      label: '3. Higher Education',
      active: false,
      component: PersonalDetailsForm,
    },
    {
      label: '4. Experience',
      active: false,
      component: PersonalDetailsForm,
    },
  ]);
  const RegistrationFormComponent: FC<RegistrationFormComponentProps> = profileSteps[currentStep].component;

  const updateProfileSteps = (newStep: number) => {
    const updatedProfileSteps = profileSteps.map((step: Step, i: number) => {
      step.active = false;

      if (newStep === i) {
        step.active = true;
      }

      return step;
    });

    setProfileSteps(updatedProfileSteps);
  };

  const updateStep = (newStep: number) => {
    setCurrentStep(newStep);
    updateProfileSteps(newStep);

    if (newStep === profileSteps.length - 1) {
      setIsSaveBtnVisible(true);
    } else {
      setIsSaveBtnVisible(false);
    }
  };

  const handleValidation = (isFormValid: boolean) => {
      if (isFormValid) {
        updateStep(currentStep + 1);
      }
  };

  return (
    <div className="tw:h-full tw:lg:w-[640px] tw:w-full tw:lg:px-0 tw:px-3 tw:py-9 tw:mx-auto tw:flex tw:flex-col">
      <img className="tw:w-20 tw:mb-1 tw:self-center" src={logo} alt="logo" />
      <h2 className="tw:text-center tw:mb-8">Create a Profile</h2>

      <Steps classes={'tw:mb-8'} steps={profileSteps} onClick={updateStep}  />
      <RegistrationFormComponent onValidate={handleValidation}>
        <div className="tw:flex tw:justify-between tw:mt-auto tw:lg:mb-96">
          { currentStep > 0 && <button className="btn btn--hollow" onClick={() => updateStep(currentStep - 1)}>Back</button> }
          <div className="tw:ml-auto">
            {
              isSaveBtnVisible ? (
                <button className="btn">Save</button>
              ) : (
                <div>
                  { currentStep > 0 && <button className="btn btn--clear tw:mr-4" onClick={() => updateStep(currentStep + 1)}>Skip</button> }
                  <button type="submit" className="btn">Next</button>
                </div>
            )}
          </div>
        </div>
      </RegistrationFormComponent>
    </div>
  );
};

export default CreateProfile;
