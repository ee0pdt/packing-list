import { List, ListItem } from '../types/packing';

export const testData: List = {
  id: 'summer-holiday-2024',
  name: 'Summer Holiday 2024',
  items: [
    {
      id: 'clothes',
      name: 'Clothes',
      items: [
        { id: 'shirts', name: 'T-shirts (7)', checked: true },
        { id: 'shorts', name: 'Shorts (3)', checked: true },
        { id: 'swimwear', name: 'Swimming costume', checked: false }
      ]
    },
    {
      id: 'toiletries',
      name: 'Toiletries',
      items: [
        { id: 'toothbrush', name: 'Toothbrush', checked: false },
        { id: 'toothpaste', name: 'Toothpaste', checked: false }
      ]
    }
  ]
};