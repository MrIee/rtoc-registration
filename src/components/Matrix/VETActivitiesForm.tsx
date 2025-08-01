import { type FC, type JSX, type ReactNode } from 'react';
import Dropdown from '../Inputs/Dropdown';
import TextInput from '../Inputs/TextInput';
import TextArea from '../Inputs/TextArea';
import DatePicker from '../Inputs/DatePicker';
import type { ReactSelectOption } from '../../utilities/interfaces';

interface VETActivitiesFormProps {
  activities?: Array<number>;
};

const VETActivitiesForm: FC<VETActivitiesFormProps> = (): JSX.Element => {
  const deliveryOptions: Array<ReactSelectOption> = [
    { id: '0', value: 0, label: 'Online' },
    { id: '1', value: 1, label: 'Webinar' },
    { id: '2', value: 2, label: 'Face to Face' },
  ];

  const durationOptions: Array<ReactSelectOption> = ['1', '2', '4', '8'].map((hour: string, i: number) => ({
    id: i.toString(), value: hour, label: `${hour} Hour${parseInt(hour, 10) > 1 ? 's' : ''}`
  }));

  const printTableRows = (x: Array<number>): ReactNode =>
    x.map((_, i: number) =>
      <tr className="tw:border-b tw:border-gray-300" key={i}>
        <td>{i + 1}</td>
        <td></td>
        <td>
          <Dropdown options={deliveryOptions} hasBorder />
        </td>
        <td><TextArea /></td>
        <td><TextInput classes="tw:!flex" hasBorder /></td>
        <td><DatePicker useDay hasBorder /></td>
        <td><Dropdown options={durationOptions} hasBorder /></td>
      </tr>
    );

  const printTable: ReactNode = [0].map((_, i: number) =>
    <table className="matrix-table" key={i}>
      <thead>
        <tr className="tw:border-b tw:border-gray-300">
          <th>#</th>
          <th className="matrix-table__col-md">Activity Name</th>
          <th>Mode of Delivery</th>
          <th>Learning Outcomes</th>
          <th>Provider</th>
          <th>Date</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        {printTableRows([0])}
      </tbody>
    </table>
  );

  return (
    <>{printTable}</>
  );
};

export default VETActivitiesForm;
