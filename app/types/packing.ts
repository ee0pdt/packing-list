export interface Item {
  id: string;
  name: string;
  checked: boolean;
}

export interface List {
  id: string;
  name: string;
  items: ListItem[];
}

export type ListItem = Item | List;

// Type guard to check if an item is a List
export const isList = (item: ListItem): item is List => {
  return Array.isArray((item as List).items);
};