import { type FC, type JSX, type ReactNode } from 'react';
import type { Subscription } from '../../utilities/interfaces';
import TextInput from '../Inputs/TextInput';
import DatePicker from '../Inputs/DatePicker';
import RadioButton from '../Inputs/RadioButton';

interface SubscriptionFormProps {
  subscriptions: Array<Subscription>;
};

const subscriptionLimit = 3;

const SubscriptionForm: FC<SubscriptionFormProps> = ({ subscriptions }): JSX.Element => {
  interface SubscriptionRow {
    header: string;
    key: string;
  };

  const rows: Array<SubscriptionRow> = [
    { header: 'Name', key: 'provider' },
    { header: 'Member Number', key: 'member' },
    { header: 'Date Commenced', key: 'commenced' },
    { header: 'Current', key: 'current' },
  ];

  const printTableCells = (key: string): ReactNode =>
    [...Array(subscriptionLimit).keys()].map((x: number): ReactNode => {
      const subscription: Subscription = subscriptions[x];
      let cell: ReactNode = null;

      if (subscription) {
        const value: string | undefined = subscription[key as keyof Subscription]?.toString();
        switch (key) {
          case rows[0].key:
            cell = <TextInput value={value} isSlim hasBorder />;
            break;
          case rows[1].key:
            cell = <TextInput value={value} isSlim hasBorder />;
            break;
          case rows[2].key:
            cell = <DatePicker value={subscription.commenced} useDay isSlim hasBorder />;
            break;
          case rows[3].key:
            cell = <div className="radio-group">
              <RadioButton name={`currentSubscription_${subscription.rowID}`} label="Yes" checked={value === 'yes'} />
              <RadioButton name={`currentSubscription_${subscription.rowID}`} label="No"  checked={value === 'no'} />
            </div>;
            break;
        }

        return <td key={x}>{cell}</td>;
      } else {
        return <td key={x}></td>;
      }
    });

  const printTableRows = (): ReactNode =>
    rows.map((row: SubscriptionRow, i: number) =>
      <tr key={i}>
        <th>{row.header}</th>
        {printTableCells(row.key)}
      </tr>
    );

  return (
    <table className="matrix-table">
      <thead>
        <tr>
          <th></th>
          <th>Subscription/Membership 1</th>
          <th>Subscription/Membership 2</th>
          <th>Subscription/Membership 3</th>
        </tr>
      </thead>
      <tbody>
        {printTableRows()}
      </tbody>
    </table>
  );
};

export default SubscriptionForm;
