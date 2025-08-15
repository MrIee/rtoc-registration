import { useEffect, useState, type FC, type JSX, type ReactNode } from 'react';
import type { MatrixExperienceCourse, MatrixExperienceUnit, ReactSelectOption } from '../../utilities/interfaces';
import { getUnitsICanTeachAsOptions } from '../../utilities/data';
import RadioButton from '../Inputs/RadioButton';
import TextArea from '../Inputs/TextArea';
import Dropdown from '../Inputs/Dropdown';
import { nanoid } from 'nanoid';

interface ExperienceFormProps {
  courses: Array<MatrixExperienceCourse>;
  onChange?: (unit: MatrixExperienceUnit) => void;
};

const ExperienceForm: FC<ExperienceFormProps> = ({ courses, onChange }): JSX.Element => {
  const [items] = useState<Array<MatrixExperienceCourse>>(courses);
  const [unitsOfCompetency, setUnitsOfCompetency] = useState<Array<ReactSelectOption>>([]);

  useEffect(() => {
    const loadUnitsOfCompetency = async () => {
      const res: Array<ReactSelectOption> = await getUnitsICanTeachAsOptions();
      setUnitsOfCompetency(res);
    };

    loadUnitsOfCompetency();
  }, []);

  const handleOnChange = (courseIndex: number, unitIndex: number, value: unknown, key: string) => {
    let unit: MatrixExperienceUnit = items[courseIndex].units[unitIndex];
    unit = { ...unit, [key]: value };

    onChange?.(unit);
  };

  const updateEQUnits = (courseIndex: number, unitIndex: number, values: Array<ReactSelectOption>) => {
    let unit: MatrixExperienceUnit = items[courseIndex].units[unitIndex];
    unit.eq_unit1 = '';
    unit.eq_unit2 = '';
    unit.eq_unit3 = '';
    unit.hold_unit_text = '';

    if (values.length > 0) {
      let count = 1;
      values.forEach((option: ReactSelectOption) => {
        unit.hold_unit_text = '';

        if (option.__isNew__ && typeof option.value === 'string') {
          unit.hold_unit_text = option.value;
        } else {
          const key: string = `eq_unit${count}`;
          unit = { ...unit, [key]: option.value };
          count++;
        }
      });
    }

    onChange?.(unit);
  };

  const getEQUnitOptions = (unit: MatrixExperienceUnit): Array<ReactSelectOption> => {
    const options: Array<ReactSelectOption> = [];

    const setEQUnitAsOption = (eqUnit: string) => {
      if (eqUnit) {
        const unitOption: ReactSelectOption | undefined = unitsOfCompetency.find((option: ReactSelectOption) => option.value === eqUnit);

        if (unitOption) {
          options.push(unitOption);
        }
      }
    };

    setEQUnitAsOption(unit.eq_unit1);
    setEQUnitAsOption(unit.eq_unit2);
    setEQUnitAsOption(unit.eq_unit3);

    if (unit.hold_unit_text) {
      options.push({ id: nanoid(), value: unit.hold_unit_text, label: unit.hold_unit_text, __isNew__: true });
    }

    return options;
  };

  const printTableRows = (units: Array<MatrixExperienceUnit>, courseKey: number): ReactNode =>
    units.map((unit: MatrixExperienceUnit, i: number) =>
      <tr key={unit.rowID}>
        <td>{i + 1}</td>
        <td>{unit.unit} {unit.unitTitle}</td>
        <td>
          <div className="radio-group">
            <RadioButton
             name={`holdUnit_${unit.unit}_${unit.rowID}`}
             label="Yes"
             defaultChecked={!!unit.hold_unit}
             onChange={() => handleOnChange(courseKey, i, true, 'hold_unit')}
            />
            <RadioButton
             name={`holdUnit_${unit.unit}_${unit.rowID}`}
             label="No"
             defaultChecked={!unit.hold_unit}
             onChange={() => handleOnChange(courseKey, i, false, 'hold_unit')}
            />
          </div>
        </td>
        <td>
          <Dropdown
            isMulti
            isCreatable
            isSearchable
            defaultValue={getEQUnitOptions(unit)}
            options={unitsOfCompetency}
            multiLimit={3}
            isSlim
            hasBorder
            overrideNewOption
            onAddMulti={(options: Array<ReactSelectOption>) => updateEQUnits(courseKey, i, options)}
            onRemoveMulti={(options: Array<ReactSelectOption>) => updateEQUnits(courseKey, i, options)}
          />
        </td>
        <td>
          <TextArea
            defaultValue={unit.experience}
            onChange={(e) => handleOnChange(courseKey, i, e.target.value, 'experience')}
          />
        </td>
      </tr>
    );

  const printTable: ReactNode = items.map((course: MatrixExperienceCourse, i: number) =>
    <table className="matrix-table" key={i}>
      <thead>
        <tr>
          <th colSpan={5}>{course.course} {course.courseTitle}</th>
        </tr>
        <tr>
          <th>#</th>
          <th className="matrix-table__col-lg">Unit of Competency</th>
          <th>Do you hold this unit of competency?</th>
          <th className="matrix-table__col-xl">If "No", what equivalent competencies</th>
          <th className="matrix-table__col-xl">Current industry (vocational) experience in this unit of competency</th>
        </tr>
      </thead>
      <tbody>
        {printTableRows(course.units, i)}
      </tbody>
    </table>
  );

  return (
    <>{printTable}</>
  );
};

export default ExperienceForm;
