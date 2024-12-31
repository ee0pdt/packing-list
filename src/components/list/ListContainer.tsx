import { useEffect, useState } from 'react';
import { Paper, List, Typography, Box } from '@mui/material';
import { ListItem } from '../../types/packing';
import { useLocation, useNavigate } from 'react-router-dom';
import ListItemComponent from './ListItemComponent';

const ListContainer = () => {
  const [list, setList] = useState<{ name: string; items: ListItem[] } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const encodedData = location.pathname.slice(6);
    if (encodedData) {
      try {
        const decodedData = JSON.parse(atob(encodedData));
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

  const markSubItemsAsPacked = (items: ListItem[]): ListItem[] => {
    return items.map(item => {
      if ('items' in item) {
        // For a sublist, recursively mark all its items
        return {
          ...item,
          items: markSubItemsAsPacked(item.items)
        };
      }
      // For a regular item, mark it as checked
      return {
        ...item,
        checked: true
      };
    });
  };

  const handleMarkAllPacked = (id: string) => {
    if (!list) return;

    const markAllPacked = (items: ListItem[]): ListItem[] => {
      return items.map(item => {
        if (item.id === id && 'items' in item) {
          // If this is the target list, mark all its items as checked
          return {
            ...item,
            items: markSubItemsAsPacked(item.items)
          };
        }
        // If this isn't the target list but has subitems, 
        // keep searching for the target
        if ('items' in item) {
          return {
            ...item,
            items: markAllPacked(item.items)
          };
        }
        // Leave other items unchanged
        return item;
      });
    };

    const updatedList = {
      ...list,
      items: markAllPacked(list.items)
    };

    setList(updatedList);
    const encodedData = btoa(JSON.stringify(updatedList));
    navigate(`/list/${encodedData}`);
  };

  if (!list) {
    return (
      <Box p={2}>
        <Paper elevation={2} sx={{ maxWidth: 600, p: 2 }}>
          <Typography>Loading list...</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Paper 
        elevation={2} 
        sx={{ 
          maxWidth: 600,
          p: 2,
        }}
      >
        <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
          {list.name}
        </Typography>
        <List>
          {list.items.map(item => (
            <ListItemComponent 
              key={item.id} 
              item={item}
              onToggle={handleToggle}
              onMarkAllPacked={handleMarkAllPacked}
            />
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default ListContainer;