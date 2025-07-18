import { useState, useEffect } from 'react';
import { createTEQualifications, deleteTEQualification, getTEQualifications } from '../utilities/data';
import type { TEQualification } from '../utilities/interfaces';

const useHigherEducation = () => {
  const [teQualifications, setTEQualifications] = useState<Array<TEQualification>>([]);

  const loadTEQualifications = async () => {
    const qualifications: Array<TEQualification> = await getTEQualifications();

    if (qualifications.length > 0) {
      setTEQualifications(qualifications);
    }
  };

  const deleteQualification = async (id: number) => {
    await deleteTEQualification(id);
    loadTEQualifications();
  };

  const submitQualification = async (isFormValid: boolean, teDetails: TEQualification) => {
    if (isFormValid) {
      const res = await createTEQualifications(teDetails);

      if (res) {
        loadTEQualifications();
      }
    }
  };

  useEffect(() => {
    loadTEQualifications();
  }, []);

  return { teQualifications, submitQualification, deleteQualification };
};

export default useHigherEducation;
