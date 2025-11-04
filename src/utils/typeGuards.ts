import { Item, ListItem } from '../types/packing';

export const isItem = (item: ListItem): item is Item => {
  return 'checked' in item;
};