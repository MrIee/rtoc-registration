import logo from '../assets/images/logo-rtoc.png';
import type { Step, TeachingExperience, TEQualification, UserDetails, VETQualificationDetails } from '../utilities/interfaces';
import type { RootState } from '~/store/store';
import { useEffect, useState, type FC, type JSX } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { goToNextStep } from '~/store/registrationSlice';
import Steps from '../components/Steps';
import PersonalDetailsForm from '../components/PersonalDetailsForm';
import VETQualificationsContainer from '../components/VETQualificationsContainer';
import HigherEducationContainer from '../components/HigherEducationContainer';
import ExperienceContainer from '../components/ExperienceContainer';
import {
  authUser,
  createTEQualifications,
  createUser,
  createVETQualifications,
  deleteVETQualification,
  getTEQualifications,
  deleteTEQualification,
  getVETQualifications,
  createTeachingExperience,
  getTeachingExperience,
  deleteTeachingExperience
} from '~/utilities/data';

const CreateProfile: FC = (): JSX.Element => {
  const dispatch = useDispatch();
  const step = useSelector((state: RootState) => state.registration.step);
  const [vetQualifications, setVETQualifications] = useState<Array<VETQualificationDetails>>([]);
  const [teQualifications, setTEQualifications] = useState<Array<TEQualification>>([]);
  const [teachingExperience, setTeachingExperience] = useState<Array<TeachingExperience>>([]);
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
    loadTEQualifications();
    loadTeachingExperience();
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

  const loadTEQualifications = async () => {
    const qualifications: Array<TEQualification> = await getTEQualifications();

    if (qualifications.length > 0) {
      setTEQualifications(qualifications);
    }
  };

  const handleDeleteTEQualification = async (id: number) => {
    await deleteTEQualification(id);
    loadTEQualifications();
  };

  const handleSubmitHigherEducation = async (isFormValid: boolean, teDetails: TEQualification) => {
    if (isFormValid) {
      const res = await createTEQualifications(teDetails);

      if (res) {
        loadTEQualifications();
      }
    }
  };

  const loadTeachingExperience = async () => {
    const experience: Array<TeachingExperience> = await getTeachingExperience();

    if (experience.length > 0) {
      setTeachingExperience(experience);
    }
  };

  const handleDeleteTeachingExperience = async (id: number) => {
    await deleteTeachingExperience(id);
    loadTeachingExperience();
  };

  const handleOnSubmitTE = async (isFormValid: boolean, teachingExperience: TeachingExperience) => {
    if (isFormValid) {
      const res = await createTeachingExperience(teachingExperience);

      if (res) {
        loadTeachingExperience();
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
      { step === 2 && <HigherEducationContainer
        onSubmit={handleSubmitHigherEducation}
        onDelete={handleDeleteTEQualification}
        qualifications={teQualifications}
      />}
      { step === 3 && <ExperienceContainer
        onSubmitTE={handleOnSubmitTE}
        onDeleteTE={handleDeleteTeachingExperience}
        teachingExperience={teachingExperience}
      />}
    </div>
  );
};

export default CreateProfile;
