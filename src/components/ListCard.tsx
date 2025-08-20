import iconDelete from '../assets/images/icon-delete.svg';
import iconDownload from '../assets/images/icon-download.svg';
import  { CONTENT_SERVER_URL } from '../utilities/data';
import { nanoid } from 'nanoid';
import { useState, type FC, type PropsWithChildren, type ReactNode } from 'react';
import classNames from 'classnames';
import type { ListItem, Point } from '../utilities/interfaces';

interface ListCardProps extends PropsWithChildren {
  display?: 'col' | 'row';
  title: string;
  items: Array<ListItem>;
  onDelete?: (id: number) => void;
  onDeletePoint?: (id: number) => void;
};

const ListCard: FC<ListCardProps> = ({ display = 'col', title, items, onDelete, onDeletePoint, children }) => {
  const [isDisplayRow] = useState<boolean>(display === 'row');

  const itemsList = (items: Array<string>): ReactNode => items.map((item: string, i: number) =>
    <span key={i}>{item}</span>
  );

  const listItems: ReactNode = items.map((item: ListItem) =>
    <div className="list__item" key={item.id || nanoid()}>
      <div className="tw:flex tw:justify-between">
        <div className="tw:w-full tw:flex tw:flex-col tw:gap-1.5 tw:text-sm">
          {item.title && <h4>{ item.title }</h4>}
          {item.list && itemsList(item.list)}
          <ul className="tw:list-disc tw:mt-1.5 tw:ml-6">
            {
              item?.points?.map((point: Point) =>
                <li key={point.id || nanoid()} className="tw:mb-2">
                  <div className="tw:w-full tw:inline-flex">
                    <span>{point.label}</span>
                    { onDeletePoint && <img
                      className="tw:ml-auto tw:cursor-pointer"
                      src={iconDelete}
                      alt="delete"
                      onClick={() => onDeletePoint(point.id)}
                    /> }
                  </div>
                </li>
                )
            }
          </ul>
        </div>
        {
        onDelete &&
        <div className="tw:h-4 tw:flex tw:gap-2">
          <img className="tw:cursor-pointer" src={iconDelete} alt="delete" onClick={() => item.id && onDelete(item.id)} />
        </div>
        }
      </div>
      { (item.fileName && item.fileURL) &&
        <a
          className="tw:inline-flex tw:justify-between tw:py-3 tw:px-4 tw:mt-3 tw:text-sm tw:rounded-lg tw:bg-gray-100 tw:cursor-pointer"
          href={CONTENT_SERVER_URL + item.fileURL}
          target="_blank"
        >
          {item.fileName}
          <img src={iconDownload} alt="download" />
        </a>
      }
    </div>
  );

  return (
    <div className={classNames({'list': items.length > 0}, {'list--row': isDisplayRow && items.length > 0})}>
      <div className={classNames('tw:flex tw:items-center tw:justify-between', {'tw:w-56 tw:items-start tw:pr-4 tw:py-4': isDisplayRow})}>
        {items.length > 0 && <h3>{title}</h3>}
        <div className={classNames({'tw:w-full': items.length === 0})}>{children}</div>
      </div>
      {items.length > 0 && <div className="tw:w-full">{ listItems }</div>}
    </div>
  );
};

export default ListCard;
