import iconDelete from '../assets/images/icon-delete.svg';
import { nanoid } from 'nanoid';
import { type FC, type JSX, type ReactNode } from 'react';
import type { ListItem, Point } from '../utilities/interfaces';

interface ListProps {
  items: Array<ListItem>;
  onDelete?: (id: number) => void;
  onDeletePoint?: (id: number) => void;
};

const List: FC<ListProps> = ({ items, onDelete, onDeletePoint }): JSX.Element => {

  const itemsList = (items: Array<string>): ReactNode => items.map((item: string, i: number) =>
    <span key={i}>{item}</span>
  );

  const listItems: ReactNode = items.map((item: ListItem) =>
    <div key={item.id || nanoid()}>
      <div className="tw:flex tw:justify-between">
        <div className="tw:w-full tw:flex tw:flex-col tw:gap-1.5 tw:text-sm">
          {item.title && <h5>{ item.title }</h5>}
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
    </div>
  );

  return (
    <>{ listItems }</>
  );
};

export default List;
