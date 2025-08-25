import { useState, type FC, type JSX, type ReactNode } from 'react';
import { RENEWAL_OPTIONS } from '../../utilities/constants';
import iconDelete from '../../assets/images/icon-delete.svg';
import type { ReactSelectOption, Subscription } from '../../utilities/interfaces';
import TextInput from '../Inputs/TextInput';
import DatePicker from '../Inputs/DatePicker';
import useItems from '../../hooks/useItems';
import Modal from '../Modal';
import SubscriptionForm from './SubscriptionForm';
import { getDefaultOption } from '../../utilities/helpers';
import Dropdown from '../Inputs/Dropdown';

interface SubscriptionTableProps {
  subscriptions: Array<Subscription>;
  onChange?: (subscription: Subscription) => void;
  onSubmit: (isValid: boolean, subscription: Subscription) => void;
  onDelete: (rowID: number) => void;
};

const subscriptionLimit = 3;

const SubscriptionTable: FC<SubscriptionTableProps> = ({ subscriptions, onChange, onSubmit, onDelete }): JSX.Element => {
  interface SubscriptionRow {
    header: string;
    key: string;
  };

  const { items, handleOnChange } = useItems<Subscription>(subscriptions, onChange);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const handleSubmit = (isValid: boolean, subscription: Subscription) => {
    if (isValid) {
      setIsModalVisible(false);
      onSubmit(isValid, subscription);
    }
  };

  const rows: Array<SubscriptionRow> = [
    { header: 'Name', key: 'provider' },
    { header: 'Member Number', key: 'member' },
    { header: 'Renewal Period', key: 'renewal' },
    { header: 'Date Commenced', key: 'commenced' },
    { header: 'Anniversary', key: 'anniversary' },
  ];

  const printTableCells = (key: string): ReactNode =>
    [...Array(subscriptionLimit).keys()].map((x: number): ReactNode => {
      const subscription: Subscription = items[x];
      let cell: ReactNode = null;

      if (subscription) {
        const value: string | undefined = subscription[key as keyof Subscription]?.toString();
        const rowID: number | undefined = subscription.rowID || -1;
        switch (key) {
          case rows[0].key:
            cell = <TextInput
              classes="tw:w-full"
              value={value}
              isSlim
              hasBorder
              onChange={(e) => handleOnChange(e.target.value, key, rowID) }
            />;
            break;
          case rows[1].key:
            cell = <TextInput
              classes="tw:w-full"
              value={value}
              isSlim
              hasBorder
              onChange={(e) => handleOnChange(e.target.value, key, rowID) }
            />;
            break;
          case rows[2].key:
            cell = <Dropdown
              options={RENEWAL_OPTIONS}
              defaultValue={getDefaultOption(RENEWAL_OPTIONS, value || '')}
              onChange={(option: ReactSelectOption) => handleOnChange(option.value, key, subscription.rowID || 0)}
              isSlim
              hasBorder
            />;
            break;
          case rows[3].key:
            cell = <DatePicker
              value={subscription.commenced}
              useDay
              isSlim
              hasBorder
              onChange={(value) => handleOnChange(value, key, rowID) }
            />;
            break;
          case rows[4].key:
            cell = <DatePicker
              style={{singleValue: { color: subscription.current === 'no' ? 'red' : ''}}}
              classes="tw:text-red-500"
              value={subscription.anniversary}
              yearLimit={2026}
              useDay
              isSlim
              hasBorder
              onChange={(value) => handleOnChange(value, key, rowID) }
            />;
            break;
        }

        return <td key={x}>{cell}</td>;
      } else {
        return <td key={x}></td>;
      }
    });

  const tableRows: ReactNode =
    rows.map((row: SubscriptionRow, i: number) =>
      <tr key={i}>
        <th>{row.header}</th>
        {printTableCells(row.key)}
      </tr>
    );

  const deleteRows: ReactNode =
    subscriptions.map((subscription: Subscription, i: number) =>
      i < subscriptionLimit &&
      <td key={i}>
        <img
          className="tw:cursor-pointer tw:mx-auto"
          src={iconDelete}
          alt="delete activity icon"
          onClick={() => onDelete(subscription.rowID || -1)}
        />
      </td>
    );

  return (
    <>
      <table className="matrix-table">
        <thead>
          <tr>
            <th className="tw:w-1/6"></th>
            <th className="tw:w-1/4">Subscription/Membership 1</th>
            <th className="tw:w-1/4">Subscription/Membership 2</th>
            <th className="tw:w-1/4">Subscription/Membership 3</th>
          </tr>
        </thead>
        <tbody>
          {tableRows}
          <tr>
            <td></td>
            {deleteRows}
          </tr>
        </tbody>
      </table>
      <button className="btn btn--small tw:my-4" onClick={() => setIsModalVisible(true)}>Add Subscription</button>
      <Modal title="Add Subscription" showModal={isModalVisible} onClose={() => setIsModalVisible(false)}>
        <SubscriptionForm onSubmit={handleSubmit} onCancel={() => setIsModalVisible(false)} />
      </Modal>
    </>
  );
};

export default SubscriptionTable;
