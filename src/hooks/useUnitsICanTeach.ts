import { useState, useEffect } from 'react';
import { createUnitsICanTeach, deleteUnitsICanTeach, getUnitsICanTeach } from '../utilities/data';
import type { UnitsICanTeach, UnitsICanTeachData } from '../utilities/interfaces';

const useIndustryExperience = () => {
  const [unitsICanTeach, setUnitsICanTeach] = useState<Array<UnitsICanTeach>>([]);

  const loadUnits = async () => {
    const units: Array<UnitsICanTeach> = await getUnitsICanTeach();

    if (units.length > 0) {
      setUnitsICanTeach(units);
    }
  };

  const deleteUnits = async (id: number) => {
    await deleteUnitsICanTeach(id);
    loadUnits();
  };

  const submitUnits= async (isFormValid: boolean, units: UnitsICanTeachData) => {
    if (isFormValid) {
      const res = await createUnitsICanTeach(units);

      if (res) {
        loadUnits();
      }
    }
  };

  useEffect(() => {
    loadUnits();
  }, []);

  return { unitsICanTeach, submitUnits, deleteUnits };
};

export default useIndustryExperience;
