import { useEffect, useState, type FC, type JSX } from 'react';
import type { IndustryExperience, MatrixExperience, MatrixExperienceCourse } from '../utilities/interfaces';
import { getIndustryExperience, getMatrixTeachingExperience } from '../utilities/data';
import Loader from '../components/Loader';
import Accordion from '../components/Accordion';
import ExperienceForm from '../components/Matrix/ExperienceForm';
import VETActivitiesForm from '../components/Matrix/VETActivitiesForm';
import WorkExperienceForm from '../components/Matrix/WorkExperienceForm';

const Matrix: FC = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [experience, setExperience] = useState<Array<MatrixExperience>>([]);
  const [workExperience, setWorkExperience] = useState<Array<IndustryExperience>>([]);

  useEffect(() => {
    const loadData = async () => {
      await loadMatrixTeachingExperience();
      await loadWorkExperience();
      setIsLoading(false);
    };

    loadData();
  }, []);

  const loadMatrixTeachingExperience = async () => {
    const res = await getMatrixTeachingExperience();
    setExperience(res);
  };

  const getTECourses = (experience: Array<MatrixExperience>): Array<MatrixExperienceCourse> => {
    const courseArray: Array<MatrixExperienceCourse> = [];

    experience.forEach((teachingExperience: MatrixExperience) => {
      teachingExperience.courses.forEach((course: MatrixExperienceCourse) => {
        courseArray.push(course);
      });
    });

    return courseArray;
  };

  const loadWorkExperience = async () => {
    const res = await getIndustryExperience();
    setWorkExperience(res);
  };

  return (
    <>
    {
      isLoading ? (
        <Loader typeToBeLoaded="Matrix" />
      ) : (
        <div className="matrix">
          <Accordion title="1. Mapping of Qualifications and Vocational Experience">
            <div className="matrix__section">
              <ExperienceForm courses={getTECourses(experience)} />
            </div>
          </Accordion>
          <Accordion title="2. Professional Development Activities" isNested>
            <Accordion title="2A Record of Vet Activities for Previous Year">
              <div className="matrix__section">
                <VETActivitiesForm />
              </div>
            </Accordion>
            <Accordion title="2B Record of Industry Activities for Previous Year">
              <div className="matrix__section">
                <VETActivitiesForm />
              </div>
            </Accordion>
            <Accordion title="2C Record of Vet Activities for Current Year">
              <div className="matrix__section">
                <VETActivitiesForm />
              </div>
            </Accordion>
            <Accordion title="2D Record of Industry Activities for Current Year">
              <div className="matrix__section">
                <VETActivitiesForm />
              </div>
            </Accordion>
          </Accordion>
          <Accordion title="3. Work Experience">
            <div className="matrix__section">
              <WorkExperienceForm experience={workExperience} />
            </div>
          </Accordion>
          <Accordion title="4. Professional Subscriptions and Memberships">
            <div className="matrix__section tw:rounded-b-lg">
              <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti, repellat! Incidunt, quae! Eveniet, eos ex! Tempora aut corporis modi quasi! At quod voluptas ipsam! Atque minus porro repellat. Blanditiis, temporibus?</p>
            </div>
          </Accordion>
        </div>
      )}
    </>
  );
};

export default Matrix;
