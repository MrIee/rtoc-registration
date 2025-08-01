import { type FC, type JSX, type ReactNode } from 'react';
import type { MatrixExperienceCourse, MatrixExperienceUnit } from '../../utilities/interfaces';
import RadioButton from '../Inputs/RadioButton';
import TextArea from '../Inputs/TextArea';

interface ExperienceFormProps {
  courses: Array<MatrixExperienceCourse>;
};

const ExperienceForm: FC<ExperienceFormProps> = ({ courses }): JSX.Element => {
  const printTableRows = (units: Array<MatrixExperienceUnit>): ReactNode =>
    units.map((unit: MatrixExperienceUnit, i: number) =>
      <tr className="tw:border-b tw:border-gray-300" key={i}>
        <td>{i + 1}</td>
        <td>{unit.unit} {unit.unitTitle}</td>
        <td>
          <div className="radio-group">
            <RadioButton name={`holdUnit_${unit.unit}`} label="Yes" />
            <RadioButton name={`holdUnit_${unit.unit}`} label="No" />
          </div>
        </td>
        <td></td>
        <td><TextArea /></td>
      </tr>
    );

  const printTable: ReactNode = courses.map((course: MatrixExperienceCourse, i: number) =>
    <table className="matrix-table" key={i}>
      <thead>
        <tr className="tw:border-b tw:border-gray-300">
          <th colSpan={5}>{course.course} {course.courseTitle}</th>
        </tr>
        <tr className="tw:border-b tw:border-gray-300">
          <th>#</th>
          <th className="matrix-table__col-lg">Unit of Competency</th>
          <th>Do you hold this unit of competency</th>
          <th>If "No", what equivalent competencies</th>
          <th>Current industry (vocational) experience in this unit of competency</th>
        </tr>
      </thead>
      <tbody>
        {printTableRows(course.units)}
      </tbody>
    </table>
  );

  return (
    <>{printTable}</>
  );
};

export default ExperienceForm;
