import iconDelete from '../assets/images/icon-delete.svg';
import iconDownload from '../assets/images/icon-download.svg';
import { nanoid } from 'nanoid';
import type { FC, PropsWithChildren, ReactNode } from 'react';
import classNames from 'classnames';
import type { ListItem } from '~/utilities/interfaces';

interface ListProps extends PropsWithChildren {
  title: string;
  items: Array<ListItem>;
  onDelete: (id: number) => void;
};


const List: FC<ListProps> = ({ title, items, onDelete, children }) => {
  const itemsList = (items: Array<string>): ReactNode => items.map((item: string, i: number) =>
    <span key={i}>{item}</span>
  );

  const listItems: ReactNode = items.map((item: ListItem) =>
    <div className="list__item" key={item.id || nanoid()}>
      <div className="tw:flex tw:justify-between">
        <div className="tw:flex tw:flex-col tw:gap-1.5 tw:text-sm">
          <strong className="tw:text-black tw:text-lg tw:font-semibold">{ item.title }</strong>
          {itemsList(item.list)}
          <ul className="tw:list-disc tw:mt-1.5 tw:ml-6">
            {
              item?.points?.map((point: string, key: number) => <li key={key} className="tw:mb-2">{point}</li> )
            }
          </ul>
        </div>
        <div className="tw:h-4 tw:flex tw:gap-2">
          <img className="tw:cursor-pointer" src={iconDelete} alt="delete" onClick={() => onDelete(item.id)} />
        </div>
      </div>
      {item.fileName && <div className="tw:flex tw:justify-between tw:py-3 tw:px-4 tw:mt-3 tw:text-sm tw:rounded-lg tw:bg-gray-100">
          {item.fileName}
          <img className="tw:cursor-pointer" src={iconDownload} alt="download" />
        </div>}
    </div>
  );

  return (
    <div className={classNames({'list': items.length > 0})}>
      <div className="tw:flex tw:items-center tw:justify-between">
        {items.length > 0 && <h3>{title}</h3>}
        <div className={classNames({'tw:w-full': items.length === 0})}>{children}</div>
      </div>
      {items.length > 0 && <div>{ listItems }</div>}
    </div>
  );
};

export default List;
