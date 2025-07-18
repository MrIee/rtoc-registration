import logo from '../assets/images/logo-rtoc.png';
import type { Step,  UserDetails } from '../utilities/interfaces';
import { useEffect, useState, type FC, type JSX } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import type { RootState } from '../store/store';
import { goToNextStep, goToStep } from '../store/registrationSlice';
import Steps from '../components/Steps';
import PersonalDetailsForm from '../components/PersonalDetailsForm';
import VETQualificationsContainer from '../components/VETQualificationsContainer';
import HigherEducationContainer from '../components/HigherEducationContainer';
import ExperienceContainer from '../components/ExperienceContainer';
import { authUser, userHasAuth, createUser } from '../utilities/data';
import useVETQualifications from '../hooks/useVETQualifications';
import useHigherEducation from '../hooks/useHigherEducation';
import useTeachingExperience from '../hooks/useTeachingExperience';
import useIndustryExperience from '../hooks/useIndustryExperience';
import useUnitsICanTeach from '../hooks/useUnitsICanTeach';
import FormButtons from '../components/FormButtons';

const CreateProfile: FC = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const step = useSelector((state: RootState) => state.registration.step);
  const maxSteps = useSelector((state: RootState) => state.registration.maxSteps);
  const [profileSteps, setProfileSteps] = useState<Array<Step>>([
    {
      label: '1. Personal details',
      clickable: false,
      active: true,
    },
    {
      label: '2. VET Qualifications',
      clickable: true,
      active: false,
    },
    {
      label: '3. Higher Education',
      clickable: true,
      active: false,
    },
    {
      label: '4. Experience',
      clickable: true,
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
  });

  useEffect(() => {
    if (step > maxSteps) {
      dispatch(goToStep(0));
      navigate('/user-profile');
    }
  }, [step, maxSteps, navigate, dispatch]);

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

  const handleClickStep = (step: number) => {
    if (userHasAuth() && step > 0) {
      return dispatch(goToStep(step));
    }
  };

  // Personal Details
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

  // VET Qualifications
  const {
    vetQualifications,
    submitQualification: handleSubmitVETQualification,
    deleteQualification: handleDeleteVetQualification,
  } = useVETQualifications();

  // Higher Education
  const {
    teQualifications,
    submitQualification: handleSubmitTEQualification,
    deleteQualification: handleDeleteTEQualification,
  } = useHigherEducation();

  // Teaching Experience
  const {
    teachingExperience,
    submitExperience: handleOnSubmitTeachingExperience,
    deleteExperience: handleDeleteTeachingExperience,
  } = useTeachingExperience();

  // Industry Experience
  const {
    industryExperience,
    submitExperience: handleOnSubmitIndustryExperience,
    deleteExperience: handleDeleteIndustryExperience,
  } = useIndustryExperience();

  // Units I can Teach
  const {
    unitsICanTeach,
    submitUnits: handleOnSubmitUnitsICanTeach,
    deleteUnits: handleDeleteUnitsICanTeach,
  } = useUnitsICanTeach();

  return (
    <div className="tw:lg:w-[640px] tw:w-full tw:lg:px-0 tw:px-3 tw:py-9 tw:mx-auto tw:flex tw:flex-col">
      <img className="tw:w-20 tw:mb-1 tw:self-center" src={logo} alt="logo" />
      <h2 className="tw:text-center tw:mb-8">Create a Profile</h2>

      <Steps classes={'tw:mb-8'} steps={profileSteps} onClick={handleClickStep} />
      { step === 0 && <PersonalDetailsForm  onSubmit={handleSubmitPersonalDetails} customErrors={errors.personalDetails} />}
      { step > 0 && <div className="container">
        { step === 1 && <VETQualificationsContainer
          onSubmit={handleSubmitVETQualification}
          onDelete={handleDeleteVetQualification}
          qualifications={vetQualifications}
        />}
        { step === 2 && <HigherEducationContainer
          onSubmit={handleSubmitTEQualification}
          onDelete={handleDeleteTEQualification}
          qualifications={teQualifications}
        />}
        { step === 3 && <ExperienceContainer
          onSubmitTE={handleOnSubmitTeachingExperience}
          onDeleteTE={handleDeleteTeachingExperience}
          teachingExperience={teachingExperience}
          onSubmitIndustry={handleOnSubmitIndustryExperience}
          onDeleteIndustry={handleDeleteIndustryExperience}
          industryExperience={industryExperience}
          onDeleteUnits={handleDeleteUnitsICanTeach}
          onSubmitUnits={handleOnSubmitUnitsICanTeach}
          unitsICanTeach={unitsICanTeach}
        />}
      </div> }
      {step > 0 && <FormButtons classes="tw:mt-auto" enableForwardNav={step > 0} />}
    </div>
  );
};

export default CreateProfile;
