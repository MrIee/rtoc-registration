import logo from '../assets/images/logo-rtoc.png';
import type {
  Step,
  TeachingExperience,
  TeachingExperienceData,
  TEQualification,
  UserDetails,
  VETQualificationDetails,
  IndustryExperience,
  IndustryExperienceData,
  UnitsICanTeachData,
  UnitsICanTeach,
} from '../utilities/interfaces';
import type { RootState } from '~/store/store';
import { useEffect, useState, type FC, type JSX } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { goToNextStep, goToStep } from '~/store/registrationSlice';
import Steps from '../components/Steps';
import PersonalDetailsForm from '../components/PersonalDetailsForm';
import VETQualificationsContainer from '../components/VETQualificationsContainer';
import HigherEducationContainer from '../components/HigherEducationContainer';
import ExperienceContainer from '../components/ExperienceContainer';
import {
  authUser,
  userHasAuth,
  createTEQualifications,
  createUser,
  createVETQualifications,
  deleteVETQualification,
  getTEQualifications,
  deleteTEQualification,
  getVETQualifications,
  createTeachingExperience,
  getTeachingExperience,
  deleteTeachingExperience,
  createIndustryExperience,
  getIndustryExperience,
  deleteIndustryExperience,
  createUnitsICanTeach,
  getUnitsICanTeach,
  deleteUnitsICanTeach,
} from '~/utilities/data';

const CreateProfile: FC = (): JSX.Element => {
  const dispatch = useDispatch();
  const step = useSelector((state: RootState) => state.registration.step);
  const [vetQualifications, setVETQualifications] = useState<Array<VETQualificationDetails>>([]);
  const [teQualifications, setTEQualifications] = useState<Array<TEQualification>>([]);
  const [teachingExperience, setTeachingExperience] = useState<Array<TeachingExperience>>([]);
  const [industryExperience, setIndustryExperience] = useState<Array<IndustryExperience>>([]);
  const [unitsICanTeach, setUnitsICanTeach] = useState<Array<UnitsICanTeach>>([]);
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
    loadVETQualifications();
    loadTEQualifications();
    loadTeachingExperience();
    loadIndustryExperience();
    loadUnitsICanTeach();
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

  const handleClickStep = (step: number) => {
    if (userHasAuth() && step > 0) {
      return dispatch(goToStep(step));
    }
  };

  // Personal Details operations
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

  // VET Qualifications operations
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

  // TE Qualifications operations
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

  const handleSubmitTEQualification = async (isFormValid: boolean, teDetails: TEQualification) => {
    if (isFormValid) {
      const res = await createTEQualifications(teDetails);

      if (res) {
        loadTEQualifications();
      }
    }
  };

  // Teaching Experience operations
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

  const handleOnSubmitTE = async (isFormValid: boolean, teachingExperience: TeachingExperienceData) => {
    if (isFormValid) {
      const res = await createTeachingExperience(teachingExperience);

      if (res) {
        loadTeachingExperience();
      }
    }
  };

  // Industry Experience operations
  const loadIndustryExperience = async () => {
    const experience: Array<IndustryExperience> = await getIndustryExperience();

    if (experience.length > 0) {
      setIndustryExperience(experience);
    }
  };

  const handleDeleteIndustryExperience = async (id: number) => {
    await deleteIndustryExperience(id);
    loadIndustryExperience();
  };

  const handleOnSubmitIndustry = async (isFormValid: boolean, industryExperience: IndustryExperienceData) => {
    if (isFormValid) {
      const res = await createIndustryExperience(industryExperience);

      if (res) {
        loadIndustryExperience();
      }
    }
  };

  // Units I can Teach operations
  const loadUnitsICanTeach = async () => {
    const units: Array<UnitsICanTeach> = await getUnitsICanTeach();

    if (units.length > 0) {
      setUnitsICanTeach(units);
    }
  };

  const handleDeleteUnitsICanTeach = async (id: number) => {
    await deleteUnitsICanTeach(id);
    loadUnitsICanTeach();
  };

  const handleOnSubmitUnitsICanTeach = async (isFormValid: boolean, units: UnitsICanTeachData) => {
    if (isFormValid) {
      const res = await createUnitsICanTeach(units);

      if (res) {
        loadUnitsICanTeach();
      }
    }
  };

  return (
    <div className="tw:h-full tw:lg:w-[640px] tw:w-full tw:lg:px-0 tw:px-3 tw:py-9 tw:mx-auto tw:flex tw:flex-col">
      <img className="tw:w-20 tw:mb-1 tw:self-center" src={logo} alt="logo" />
      <h2 className="tw:text-center tw:mb-8">Create a Profile</h2>

      <Steps classes={'tw:mb-8'} steps={profileSteps} onClick={handleClickStep} />
      { step === 0 && <PersonalDetailsForm  onSubmit={handleSubmitPersonalDetails} customErrors={errors.personalDetails} />}
      { step === 1 && <VETQualificationsContainer
        onSubmit={handleSubmitVETQualifications}
        onDelete={handleDeleteVetQualification}
        qualifications={vetQualifications}
      />}
      { step === 2 && <HigherEducationContainer
        onSubmit={handleSubmitTEQualification}
        onDelete={handleDeleteTEQualification}
        qualifications={teQualifications}
      />}
      { step === 3 && <ExperienceContainer
        onSubmitTE={handleOnSubmitTE}
        onDeleteTE={handleDeleteTeachingExperience}
        teachingExperience={teachingExperience}
        onSubmitIndustry={handleOnSubmitIndustry}
        onDeleteIndustry={handleDeleteIndustryExperience}
        industryExperience={industryExperience}
        onDeleteUnits={handleDeleteUnitsICanTeach}
        onSubmitUnits={handleOnSubmitUnitsICanTeach}
        unitsICanTeach={unitsICanTeach}
      />}
    </div>
  );
};

export default CreateProfile;
