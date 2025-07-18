import { useState, useEffect } from 'react';
import { createTeachingExperience, deleteTeachingExperience, getTeachingExperience } from '../utilities/data';
import type { TeachingExperience, TeachingExperienceData } from '../utilities/interfaces';

const useTeachingExperience = () => {
  const [teachingExperience, setTeachingExperience] = useState<Array<TeachingExperience>>([]);

  const loadExperience = async () => {
    const experience: Array<TeachingExperience> = await getTeachingExperience();

    if (experience.length > 0) {
      setTeachingExperience(experience);
    }
  };

  const deleteExperience = async (id: number) => {
    await deleteTeachingExperience(id);
    loadExperience();
  };

  const submitExperience = async (isFormValid: boolean, teachingExperience: TeachingExperienceData) => {
    if (isFormValid) {
      const res = await createTeachingExperience(teachingExperience);

      if (res) {
        loadExperience();
      }
    }
  };

  useEffect(() => {
    loadExperience();
  }, []);

  return { teachingExperience, submitExperience, deleteExperience };
};

export default useTeachingExperience;
