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

export interface ListTemplate {
  id: string;
  name: string;
  items: ListItem[];
}