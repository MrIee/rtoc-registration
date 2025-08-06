import { type FC, type JSX, type ReactNode } from 'react';
import Dropdown from '../Inputs/Dropdown';
import TextInput from '../Inputs/TextInput';
import TextArea from '../Inputs/TextArea';
import DatePicker from '../Inputs/DatePicker';
import type { Activity, ReactSelectOption } from '../../utilities/interfaces';
import { getDefaultOption } from '../../utilities/helpers';

interface VETActivitiesFormProps {
  activities: Array<Activity>;
};

const VETActivitiesForm: FC<VETActivitiesFormProps> = ({ activities }): JSX.Element => {
  const deliveryOptions: Array<ReactSelectOption> = [
    { id: '0', value: 'webinar', label: 'Webinar' },
    { id: '1', value: 'in-person', label: 'Face to Face' },
  ];

  const durationOptions: Array<ReactSelectOption> = ['1', '2', '4', '8'].map((hour: string, i: number) => ({
    id: i.toString(), value: `${hour}hour`, label: `${hour} Hour${parseInt(hour, 10) > 1 ? 's' : ''}`
  }));

  const printTableRows = (): ReactNode =>
    activities.map((activity: Activity, i: number) =>
      <tr key={i}>
        <td>{i + 1}</td>
        <td>{activity.activity}</td>
        <td>
          <Dropdown options={deliveryOptions} defaultValue={getDefaultOption(deliveryOptions, activity.mode)} isSlim hasBorder />
        </td>
        <td><TextArea value={activity.outcomes} /></td>
        <td><TextInput classes="tw:!flex" value={activity.provider} isSlim hasBorder /></td>
        <td><DatePicker value={activity.date} useDay isSlim hasBorder /></td>
        <td><Dropdown options={durationOptions} defaultValue={getDefaultOption(durationOptions, activity.duration)} isSlim hasBorder /></td>
      </tr>
    );

  const printTable: ReactNode = [0].map((_, i: number) =>
    <table className="matrix-table" key={i}>
      <thead>
        <tr>
          <th>#</th>
          <th className="matrix-table__col-md">Activity Name</th>
          <th className="matrix-table__col-sm">Mode of Delivery</th>
          <th>Learning Outcomes</th>
          <th className="matrix-table__col-md">Provider</th>
          <th>Date</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        {printTableRows()}
      </tbody>
    </table>
  );

  return (
    <>{printTable}</>
  );
};

export default VETActivitiesForm;
