import { useEffect, useState } from 'react';
import { Paper, List, Typography } from '@mui/material';
import { ListItem } from '../../types/packing';
import { useLocation } from 'react-router-dom';

const ListContainer = () => {
  const [list, setList] = useState<{ name: string; items: ListItem[] } | null>(null);
  const location = useLocation();

  useEffect(() => {
    // With HashRouter, the path is in location.hash including the '#' prefix
    const parts = location.hash.split('/list/');
    if (parts.length === 2) {
      try {
        const encodedData = parts[1];
        const decodedData = JSON.parse(atob(encodedData));
        setList(decodedData);
      } catch (error) {
        console.error('Failed to decode list data:', error);
      }
    }
  }, [location]);

  if (!list) {
    return (
      <Paper elevation={2} className="p-4">
        <Typography>Loading list...</Typography>
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
          <Typography key={item.id}>{item.name}</Typography>
        ))}
      </List>
    </Paper>
  );
};

export default ListContainer;