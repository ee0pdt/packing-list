import { useEffect, useState } from 'react';
import { Paper, List, Typography } from '@mui/material';
import { ListItem } from '../../types/packing';
import { useLocation, useNavigate } from 'react-router-dom';
import ListItemComponent from './ListItemComponent';

const ListContainer = () => {
  const [list, setList] = useState<{ name: string; items: ListItem[] } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Get everything after /list/
    const encodedData = location.pathname.slice(6);
    console.log('Location:', location);
    console.log('Encoded data:', encodedData);

    if (encodedData) {
      try {
        const decodedData = JSON.parse(atob(encodedData));
        console.log('Decoded data:', decodedData);
        setList(decodedData);
      } catch (error) {
        console.error('Failed to decode list data:', error);
      }
    }
  }, [location]);

  const handleToggle = (id: string) => {
    if (!list) return;

    const toggleItem = (items: ListItem[]): ListItem[] => {
      return items.map(item => {
        if (item.id === id) {
          return 'checked' in item 
            ? { ...item, checked: !item.checked }
            : item;
        }
        if ('items' in item) {
          return {
            ...item,
            items: toggleItem(item.items)
          };
        }
        return item;
      });
    };

    const updatedList = {
      ...list,
      items: toggleItem(list.items)
    };

    setList(updatedList);
    const encodedData = btoa(JSON.stringify(updatedList));
    navigate(`/list/${encodedData}`);
  };

  if (!list) {
    return (
      <Paper elevation={2} className="p-4">
        <Typography>Loading list...</Typography>
        <Typography variant="body2" color="text.secondary">
          Path: {location.pathname}
          Hash: {location.hash}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} className="p-4">
      <Typography variant="h5" component="h1" className="mb-4">
        {list.name}
      </Typography>
      <List>
        {list.items.map(item => (
          <ListItemComponent 
            key={item.id} 
            item={item}
            onToggle={handleToggle}
          />
        ))}
      </List>
    </Paper>
  );
};

export default ListContainer;