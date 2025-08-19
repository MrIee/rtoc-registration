import { useState, type FC, type JSX, type ReactNode } from 'react';
import { ACTIVITY_DELIVERY_OPTIONS, ACTIVITY_DURATION_OPTIONS } from '../../utilities/constants';
import Dropdown from '../Inputs/Dropdown';
import TextInput from '../Inputs/TextInput';
import TextArea from '../Inputs/TextArea';
import DatePicker from '../Inputs/DatePicker';
import { type Activity, type ReactSelectOption } from '../../utilities/interfaces';
import { getDefaultOption } from '../../utilities/helpers';
import useItems from '../../hooks/useItems';
import Modal from '../Modal';
import ActivityForm from './ActivityForm';

interface VETActivitiesTableProps {
  activities: Array<Activity>;
  onChange?: (activity: Activity) => void;
  onSubmit: (isValid: boolean, activity: Activity) => void;
};

const VETActivitiesTable: FC<VETActivitiesTableProps> = ({ activities, onChange,onSubmit }): JSX.Element => {
  const { items, handleOnChange } = useItems<Activity>(activities, onChange);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const handleSubmit = (isValid: boolean, activity: Activity) => {
    if (isValid) {
      setIsModalVisible(false);
      onSubmit(isValid, activity);
    }
  };

  const printTableRows = (): ReactNode =>
    items.map((activity: Activity, i: number) =>
      <tr key={activity.rowID}>
        <td>{i + 1}</td>
        <td>
          {activity.activity}
        </td>
        <td>
          <Dropdown
            options={ACTIVITY_DELIVERY_OPTIONS}
            defaultValue={getDefaultOption(ACTIVITY_DELIVERY_OPTIONS, activity.mode)}
            onChange={(option: ReactSelectOption) => handleOnChange(option.value, 'mode', activity.rowID || 0)}
            isSlim
            hasBorder
          />
        </td>
        <td>
          <TextArea
            classes="tw:w-full"
            value={activity.outcomes}
            rows={4}
            onChange={(e) => handleOnChange(e.target.value, 'outcomes', activity.rowID || 0)}
          />
        </td>
        <td>
          <TextInput
            classes="tw:w-full"
            value={activity.provider}
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
            options={ACTIVITY_DURATION_OPTIONS}
            defaultValue={getDefaultOption(ACTIVITY_DURATION_OPTIONS, activity.duration)}
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
            <th className="matrix-table__col-md">Learning Outcomes</th>
            <th className="matrix-table__col-md">Provider</th>
            <th>Date</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {printTableRows()}
        </tbody>
      </table>
      <button className="btn btn--small tw:my-4" onClick={() => setIsModalVisible(true)}>Add Activity</button>
      <Modal title="Add Activity" showModal={isModalVisible} onClose={() => setIsModalVisible(false)}>
        <ActivityForm onSubmit={handleSubmit} onCancel={() => setIsModalVisible(false)} />
      </Modal>
    </div>
  );

  return (
    <>{printTable}</>
  );
};

export default VETActivitiesTable;
