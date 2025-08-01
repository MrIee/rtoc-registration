import { useEffect, useState, type FC, type JSX } from 'react';
import type { MatrixExperience, MatrixExperienceCourse } from '../utilities/interfaces';
import { getMatrixTeachingExperience } from '../utilities/data';
import Loader from '../components/Loader';
import Accordion from '../components/Accordion';
import ExperienceForm from '../components/Matrix/ExperienceForm';
import VETActivitiesForm from '../components/Matrix/VETActivitiesForm';

const Matrix: FC = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [experience, setExperience] = useState<Array<MatrixExperience>>([]);

  useEffect(() => {
    const loadData = async () => {
      await loadMatrixTeachingExperience();
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
          <Accordion title="2. Professional Development Activities">
            <div className="matrix__section">
              <VETActivitiesForm />
            </div>
          </Accordion>
          <Accordion title="3. Work Experience">
            <div className="matrix__section">
              <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti, repellat! Incidunt, quae! Eveniet, eos ex! Tempora aut corporis modi quasi! At quod voluptas ipsam! Atque minus porro repellat. Blanditiis, temporibus?</p>
            </div>
          </Accordion>
          <Accordion title="4. Professional Subscriptions and Memberships">
            <div className="matrix__section">
              <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti, repellat! Incidunt, quae! Eveniet, eos ex! Tempora aut corporis modi quasi! At quod voluptas ipsam! Atque minus porro repellat. Blanditiis, temporibus?</p>
            </div>
          </Accordion>
        </div>
      )}
    </>
  );
};

export default Matrix;
