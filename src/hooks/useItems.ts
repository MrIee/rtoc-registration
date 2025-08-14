import { useState } from 'react';
import { type Row } from '../utilities/interfaces';

const useItems = <T extends Row>(itemArray: Array<T>, onChange?: (type: T) => void) => {
  const [items, setItems] = useState<Array<T>>(itemArray);

  const handleOnChange = (value: unknown, key: string, rowID: number) => {
    let updatedItem: T | null = null;
    const updatedItems: Array<T> = items.map((item: T) => {
      if (item.rowID === rowID) {
        updatedItem = { ...item, [key]: value };
        return updatedItem;
        } else {
          return item;
      }
    });

    setItems(updatedItems);

    if (updatedItem) {
      onChange?.(updatedItem);
    }
  };

  return { items, handleOnChange };
};

export default useItems;