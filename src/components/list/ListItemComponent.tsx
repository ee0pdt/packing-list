import { useState } from 'react';
import { 
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Collapse,
  List,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { ListItem as PackingListItem, isList } from '../../types/packing';

interface ListItemComponentProps {
  item: PackingListItem;
  level?: number;
  onToggle?: (id: string) => void;
}

const ListItemComponent = ({ 
  item, 
  level = 0,
  onToggle 
}: ListItemComponentProps) => {
  const [open, setOpen] = useState(true);
  const hasSubItems = isList(item);

  const handleClick = () => {
    if (hasSubItems) {
      setOpen(!open);
    }
  };

  const handleCheckboxClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onToggle?.(item.id);
  };

  return (
    <>
      <ListItem 
        disablePadding 
        sx={{ pl: level * 2 }}
      >
        <ListItemButton onClick={handleClick}>
          <ListItemIcon onClick={handleCheckboxClick}>
            <Checkbox
              edge="start"
              checked={'checked' in item ? item.checked : false}
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
              <ListItemComponent
                key={subItem.id}
                item={subItem}
                level={level + 1}
                onToggle={onToggle}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default ListItemComponent;