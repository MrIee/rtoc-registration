import { type FC, type JSX, type ReactNode } from 'react';
import type { IndustryExperience } from '../../utilities/interfaces';

interface WorkExperienceFormProps {
  experience: Array<IndustryExperience>;
};

const WorkExperienceForm: FC<WorkExperienceFormProps> = ({ experience }): JSX.Element => {
  const printTableRows = (): ReactNode =>
    experience.map((exp: IndustryExperience, i: number) =>
      <tr key={i}>
        <td>{i + 1}</td>
        <td>{exp.positionTitle}</td>
        <td>{exp.Company}</td>
        <td>{`${exp.started} - ${exp.completed || 'current'}`}</td>
        <td></td>
      </tr>
    );

  return (
    <table className="matrix-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Employer</th>
          <th>Date</th>
          <th>Key Responsibilities</th>
        </tr>
      </thead>
      <tbody>
        {printTableRows()}
      </tbody>
    </table>
  );
};

export default WorkExperienceForm;
