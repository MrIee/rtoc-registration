import { type FC, type JSX, type ReactNode } from 'react';
import Dropdown from '../Inputs/Dropdown';
import TextInput from '../Inputs/TextInput';
import TextArea from '../Inputs/TextArea';
import DatePicker from '../Inputs/DatePicker';
import { newActivity, type Activity, type ReactSelectOption } from '../../utilities/interfaces';
import { getDefaultOption } from '../../utilities/helpers';
import useItems from '../../hooks/useItems';

interface VETActivitiesFormProps {
  activities: Array<Activity>;
  onChange?: (activity: Activity) => void;
};

const VETActivitiesForm: FC<VETActivitiesFormProps> = ({ activities, onChange }): JSX.Element => {
  const { items, setItems, handleOnChange } = useItems<Activity>(activities, onChange);

  const deliveryOptions: Array<ReactSelectOption> = [
    { id: '0', value: 'webinar', label: 'Webinar' },
    { id: '1', value: 'in-person', label: 'Face to Face' },
  ];

  const durationOptions: Array<ReactSelectOption> = ['1', '2', '4', '8'].map((hour: string, i: number) => ({
    id: i.toString(), value: `${hour}hour`, label: `${hour} Hour${parseInt(hour, 10) > 1 ? 's' : ''}`
  }));

  const addActivity = () => {
    setItems([...items, newActivity]);
  };

  const printTableRows = (): ReactNode =>
    items.map((activity: Activity, i: number) =>
      <tr key={activity.rowID}>
        <td>{i + 1}</td>
        <td>
          {activity.activity ?
            activity.activity
            : <TextArea />
          }
        </td>
        <td>
          <Dropdown
            options={deliveryOptions}
            defaultValue={getDefaultOption(deliveryOptions, activity.mode)}
            onChange={(option: ReactSelectOption) => handleOnChange(option.value, 'mode', activity.rowID || 0)}
            isSlim
            hasBorder
          />
        </td>
        <td>
          <TextArea
            value={activity.outcomes}
            onChange={(e) => handleOnChange(e.target.value, 'outcomes', activity.rowID || 0)}
          />
        </td>
        <td>
          <TextInput
            classes="tw:!flex"
            value={activity.provider}
            validate="provider"
            onChange={(e) => handleOnChange(e.target.value, 'provider', activity.rowID || 0)}
            isSlim
            hasBorder
          />
        </td>
        <td>
          <DatePicker
            value={activity.date}
            onChange={(value) => handleOnChange(value, 'date', activity.rowID || 0)}
            useDay
            isSlim
            hasBorder
          />
        </td>
        <td>
          <Dropdown
            options={durationOptions}
            defaultValue={getDefaultOption(durationOptions, activity.duration)}
            onChange={(option: ReactSelectOption) => handleOnChange(option.value, 'duration', activity.rowID || 0)}
            isSlim
            hasBorder
          />
        </td>
      </tr>
    );

  const printTable: ReactNode = [0].map((_, i: number) =>
    <div key={i}>
      <table className="matrix-table">
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
      <button className="btn btn--small tw:my-4" onClick={addActivity}>Add Activity</button>
    </div>
  );

  return (
    <>{printTable}</>
  );
};

export default VETActivitiesForm;
