import logo from '../assets/images/logo-rtoc.png';
import { type Step, type TEDetails, type UserDetails, type VETQualificationDetails } from '../utilities/interfaces';
import type { RootState } from '~/store/store';
import { useEffect, useState, type FC, type JSX } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { goToNextStep } from '~/store/registrationSlice';
import Steps from '../components/Steps';
import PersonalDetailsForm from '../components/PersonalDetailsForm';
import VETQualificationsContainer from '../components/VETQualificationsContainer';
import HigherEducationContainer from '../components/HigherEducationContainer';
import { authUser, createTEQualifications, createUser, createVETQualifications, deleteVETQualification, getTEQualifications, getVETQualifications } from '~/utilities/data';

const CreateProfile: FC = (): JSX.Element => {
  const dispatch = useDispatch();
  const step = useSelector((state: RootState) => state.registration.step);
  const [vetQualifications, setVETQualifications] = useState<Array<VETQualificationDetails>>([]);
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

  useEffect(() => {
    loadVETQualifications();
  }, []);

  useEffect(() => {
    const activeStepIndex = profileSteps.findIndex((profileStep: Step) => profileStep.active === true);
    const updateProfileSteps = (newStep: number) => {
      const updatedProfileSteps = profileSteps.map((profileStep: Step, i: number) => {
        profileStep.active = false;

        if (newStep === i) {
          profileStep.active = true;
        }

        return profileStep;
      });

      setProfileSteps(updatedProfileSteps);
    };

    if (activeStepIndex !== step) {
      updateProfileSteps(step);
    }
  }, [step, profileSteps]);

  const handleSubmitPersonalDetails = async (isFormValid: boolean, userDetails: UserDetails): Promise<void> => {
      if (isFormValid) {
        const newUser = await createUser(userDetails);

        if (newUser && newUser.error) {
          setErrors((prevErrors: Record<string, UserDetails>) => ({...prevErrors, personalDetails: { ...prevErrors.personalDetails, email: newUser.error }}));
          return;
        }

        const auth = await authUser(userDetails.email, userDetails.password);

        if (auth) {
          dispatch(goToNextStep());
        }
      }
  };

  const loadVETQualifications = async () => {
    const qualifications: Array<VETQualificationDetails> = await getVETQualifications();

    if (qualifications) {
      setVETQualifications(qualifications);
    }
  };

  const handleSubmitVETQualifications = async (isFormValid: boolean, qualificationDetails: VETQualificationDetails): Promise<void> => {
    if (isFormValid) {

      const res = await createVETQualifications({ ...qualificationDetails });

      if (res) {
        loadVETQualifications();
      }
    }
  };

  const handleDeleteVetQualification = async (id: number) => {
    await deleteVETQualification(id);
    loadVETQualifications();
  };

  const handleSubmitHigherEducation = async (isFormValid: boolean, teDetails: TEDetails) => {
    if (isFormValid) {
      const res = await createTEQualifications(teDetails);

      if (res) {
        const teQualifications = await getTEQualifications();
        console.log('teQualifications:', teQualifications);
      }
    }
  };

  return (
    <div className="tw:h-full tw:lg:w-[640px] tw:w-full tw:lg:px-0 tw:px-3 tw:py-9 tw:mx-auto tw:flex tw:flex-col">
      <img className="tw:w-20 tw:mb-1 tw:self-center" src={logo} alt="logo" />
      <h2 className="tw:text-center tw:mb-8">Create a Profile</h2>

      <Steps classes={'tw:mb-8'} steps={profileSteps} />
      { step === 0 && <PersonalDetailsForm  onSubmit={handleSubmitPersonalDetails} customErrors={errors.personalDetails} />}
      { step === 1 && <VETQualificationsContainer
        onSubmit={handleSubmitVETQualifications}
        onDelete={handleDeleteVetQualification}
        qualifications={vetQualifications}
      />}
      { step === 2 && <HigherEducationContainer onSubmit={handleSubmitHigherEducation} />}
      { step === 3 && <PersonalDetailsForm onSubmit={handleSubmitPersonalDetails} />}
    </div>
  );
};

export default CreateProfile;
