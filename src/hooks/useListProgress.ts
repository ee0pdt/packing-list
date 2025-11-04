import { useMemo } from 'react';
import { List, ListItem as PackingListItemType } from '../types/packing';
import { isItem } from '../utils/typeGuards';

export const useListProgress = (list: List) => {
  const isPackedMemo = useMemo(() => {
    const checkPacked = (item: PackingListItemType): boolean => {
      if (isItem(item)) {
        return item.checked;
      }
      return item.items.every((subItem) => checkPacked(subItem));
    };
    return checkPacked;
  }, []);

  return useMemo(() => {
    let packed = 0;
    let total = 0;
    let allItems = 0;

    const countItems = (items: PackingListItemType[]) => {
      items.forEach((item) => {
        if (isItem(item)) {
          total++;
          allItems++;
          if (item.checked) packed++;
        } else {
          total++;
          if (item.items.every((subItem) => isPackedMemo(subItem))) packed++;
          item.items.forEach((subItem) => {
            if (isItem(subItem)) {
              allItems++;
            } else {
              countItems(subItem.items);
            }
          });
        }
      });
    };

    countItems(list.items);
    const progress = total > 0 ? (packed / total) * 100 : 0;

    return {
      packedCount: packed,
      totalCount: total,
      progress,
      allSubItems: allItems,
    };
  }, [list.items, isPackedMemo]);
};