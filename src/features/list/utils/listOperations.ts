import { ListItem, Item, List } from '../types';

export const moveItem = (items: ListItem[], fromIndex: number, toIndex: number): ListItem[] => {
  const newItems = [...items];
  const [movedItem] = newItems.splice(fromIndex, 1);
  newItems.splice(toIndex, 0, movedItem);
  return newItems;
};

export const toggleItem = (item: Item): Item => ({
  ...item,
  checked: !item.checked,
});

export const isItem = (item: ListItem): item is Item => {
  return 'checked' in item;
};

export const isList = (item: ListItem): item is List => {
  return 'items' in item;
};