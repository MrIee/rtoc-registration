import { useState, useEffect } from 'react';
import { createVETQualifications, deleteVETQualification, getVETQualifications } from '../utilities/data';
import type { VETQualificationDetails } from '../utilities/interfaces';

const useVETQualifications = () => {
  const [vetQualifications, setVETQualifications] = useState<Array<VETQualificationDetails>>([]);

  const loadQualifications = async () => {
    const qualifications: Array<VETQualificationDetails> = await getVETQualifications();

    if (qualifications) {
      setVETQualifications(qualifications);
    }
  };

  const deleteQualification = async (id: number) => {
    await deleteVETQualification(id);
    loadQualifications();
  };
  const submitQualification = async (isFormValid: boolean, qualificationDetails: VETQualificationDetails): Promise<void> => {
    if (isFormValid) {

      const res = await createVETQualifications({ ...qualificationDetails });

      if (res) {
        loadQualifications();
      }
    }
  };

  useEffect(() => {
    loadQualifications();
  }, []);

  return { vetQualifications, submitQualification, deleteQualification };
};

export default useVETQualifications;
