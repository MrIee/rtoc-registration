import logo from '../assets/images/logo-rtoc.png';
import type { FC, JSX } from 'react';
import useHigherEducation from '~/hooks/useHigherEducation';
import useIndustryExperience from '~/hooks/useIndustryExperience';
import useTeachingExperience from '~/hooks/useTeachingExperience';
import useUnitsICanTeach from '~/hooks/useUnitsICanTeach';
import useVETQualifications from '~/hooks/useVETQualifications';
import VETQualificationsContainer from '~/components/VETQualificationsContainer';
import HigherEducationContainer from '~/components/HigherEducationContainer';
import ExperienceContainer from '~/components/ExperienceContainer';

const Profile: FC = (): JSX.Element => {
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
    <div className="tw:w-[980px] tw:flex tw:flex-col tw:py-9 tw:mx-auto">
      <img className="tw:w-20 tw:mb-1 tw:self-center" src={logo} alt="logo" />
      <h2 className="tw:text-center tw:mt-8">Your Profile</h2>
      <div className="tw:mt-8">
        <VETQualificationsContainer
          onSubmit={handleSubmitVETQualification}
          onDelete={handleDeleteVetQualification}
          qualifications={vetQualifications}
        />
        <HigherEducationContainer
          onSubmit={handleSubmitTEQualification}
          onDelete={handleDeleteTEQualification}
          qualifications={teQualifications}
        />
        <ExperienceContainer
          onSubmitTE={handleOnSubmitTeachingExperience}
          onDeleteTE={handleDeleteTeachingExperience}
          teachingExperience={teachingExperience}
          onSubmitIndustry={handleOnSubmitIndustryExperience}
          onDeleteIndustry={handleDeleteIndustryExperience}
          industryExperience={industryExperience}
          onDeleteUnits={handleDeleteUnitsICanTeach}
          onSubmitUnits={handleOnSubmitUnitsICanTeach}
          unitsICanTeach={unitsICanTeach}
        />
      </div>
    </div>
  );
};

export default Profile;