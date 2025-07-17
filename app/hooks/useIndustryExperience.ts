import { useState, useEffect } from 'react';
import { createIndustryExperience, deleteIndustryExperience, getIndustryExperience } from '~/utilities/data';
import type { IndustryExperience, IndustryExperienceData } from '~/utilities/interfaces';

const useIndustryExperience = () => {
  const [industryExperience, setIndustryExperience] = useState<Array<IndustryExperience>>([]);

  const loadExperience = async () => {
    const experience: Array<IndustryExperience> = await getIndustryExperience();

    if (experience.length > 0) {
      setIndustryExperience(experience);
    }
  };

  const deleteExperience = async (id: number) => {
    await deleteIndustryExperience(id);
    loadExperience();
  };

  const submitExperience = async (isFormValid: boolean, industryExperience: IndustryExperienceData) => {
    if (isFormValid) {
      const res = await createIndustryExperience(industryExperience);

      if (res) {
        loadExperience();
      }
    }
  };

  useEffect(() => {
    loadExperience();
  }, []);

  return { industryExperience, submitExperience, deleteExperience };
};

export default useIndustryExperience;
