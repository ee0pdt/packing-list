import React, { useState } from 'react';
import { 
  Box,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  Collapse
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { testData } from '../data/testData';

interface Item {
  id: string;
  name: string;
  checked?: boolean;
  items?: Item[];
}

interface PackingListItemProps {
  item: Item;
  level?: number;
}

const PackingListItem: React.FC<PackingListItemProps> = ({ item, level = 0 }) => {
  const [open, setOpen] = useState(true);
  const hasSubItems = Array.isArray(item.items);
  
  const handleClick = () => {
    if (hasSubItems) {
      setOpen(!open);
    }
  };

  return (
    <>
      <ListItem 
        disablePadding
        sx={{ pl: level * 2 }}
      >
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={item.checked || false}
              tabIndex={-1}
              disableRipple
            />
          </ListItemIcon>
          <ListItemText primary={item.name} />
          {hasSubItems && (open ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
      </ListItem>
      {hasSubItems && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List disablePadding>
            {item.items.map((subItem) => (
              <PackingListItem 
                key={subItem.id} 
                item={subItem} 
                level={level + 1} 
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

const PackingList: React.FC = () => {
  return (
    <Paper className="w-full max-w-2xl mx-auto p-4">
      <Typography variant="h5" component="h1" className="mb-4">
        {testData.name}
      </Typography>
      <List>
        {testData.items.map((item) => (
          <PackingListItem key={item.id} item={item} />
        ))}
      </List>
    </Paper>
  );
};

export default PackingList;