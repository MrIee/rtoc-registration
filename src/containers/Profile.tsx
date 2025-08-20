import { useEffect, useState, type FC, type JSX } from 'react';
import useHigherEducation from '../hooks/useHigherEducation';
import useIndustryExperience from '../hooks/useIndustryExperience';
import useTeachingExperience from '../hooks/useTeachingExperience';
import useUnitsICanTeach from '../hooks/useUnitsICanTeach';
import useVETQualifications from '../hooks/useVETQualifications';
import VETQualificationsContainer from '../components/Profile/VETQualificationsContainer';
import HigherEducationContainer from '../components/Profile/HigherEducationContainer';
import ExperienceContainer from '../components/Profile/ExperienceContainer';
import Loader from '../components/Loader';

const Profile: FC = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  useEffect(() => {
    setIsLoading(false);
  }, [vetQualifications, teQualifications, teachingExperience, industryExperience, unitsICanTeach]);

  return (
    <>
      { isLoading ? (
        <Loader typeToBeLoaded="Profile" />
      ) : (
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
      )}
    </>
  );
};

export default Profile;