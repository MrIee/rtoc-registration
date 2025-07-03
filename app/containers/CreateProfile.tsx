import logo from '../assets/images/logo-rtoc.png';
import { v4 as uuidv4 } from 'uuid';
import { type Step, type UserDetails, type VETQualificationDetails } from '../utilities/interfaces';
import type { RootState } from '~/store/store';
import { useState, type FC, type JSX } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { goToNextStep } from '~/store/registrationSlice';
import Steps from '../components/Steps';
import PersonalDetailsForm from '../components/PersonalDetailsForm';
import VETQualifications from '../components/VETQualifications';
import { authUser, createUser, createVETQualifications } from '~/utilities/data';

const CreateProfile: FC = (): JSX.Element => {
  const dispatch = useDispatch();
  const step = useSelector((state: RootState) => state.registration.step);
  const [profileSteps, setProfileSteps] = useState<Array<Step>>([
    {
      label: '1. Personal details',
      active: true,
    },
    {
      label: '2. VET Qualifications',
      active: false,
    },
    {
      label: '3. Higher Education',
      active: false,
    },
    {
      label: '4. Experience',
      active: false,
    },
  ]);

  const userDetails: UserDetails = {
      firstname: '',
      familyname: '',
      preferredname: '',
      phone: '',
      email: '',
      password: '',
  };

  const [errors, setErrors] = useState<Record<string, UserDetails>>({
    personalDetails: userDetails,
    VETQualifications: userDetails,
    HigherEducation: userDetails,
    Experience: userDetails,
  });

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
    dispatch(goToNextStep());
    updateProfileSteps(newStep);
  };

  const handleSubmitPersonalDetails = async (isFormValid: boolean, userDetails: UserDetails): Promise<void> => {
      if (isFormValid) {
        const newUser = await createUser(userDetails);

        if (newUser && newUser.error) {
          setErrors((prevErrors: Record<string, UserDetails>) => ({...prevErrors, personalDetails: { ...prevErrors.personalDetails, email: newUser.error }}));
          return;
        }

        const res = await authUser(userDetails.email, userDetails.password);
        console.log('auth:', res);
        updateStep(step + 1);
      }
  };

  const handleSubmitVETQualifications = async (isFormValid: boolean, qualificationDetails: VETQualificationDetails): Promise<void> => {
    if (isFormValid) {
      console.log('details:', qualificationDetails);
      const res = await createVETQualifications({ ...qualificationDetails, userid: uuidv4() });
      console.log('res:', res);
    }
  };

  return (
    <div className="tw:h-full tw:lg:w-[640px] tw:w-full tw:lg:px-0 tw:px-3 tw:py-9 tw:mx-auto tw:flex tw:flex-col">
      <img className="tw:w-20 tw:mb-1 tw:self-center" src={logo} alt="logo" />
      <h2 className="tw:text-center tw:mb-8">Create a Profile</h2>

      <Steps classes={'tw:mb-8'} steps={profileSteps} />
      { step === 0 && <PersonalDetailsForm  onSubmit={handleSubmitPersonalDetails} customErrors={errors.personalDetails} />}
      { step === 1 && <VETQualifications onSubmit={handleSubmitVETQualifications} />}
      { step === 2 && <PersonalDetailsForm onSubmit={handleSubmitPersonalDetails} />}
      { step === 3 && <PersonalDetailsForm onSubmit={handleSubmitPersonalDetails} />}
    </div>
  );
};

export default CreateProfile;
