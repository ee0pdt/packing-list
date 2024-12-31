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

const calculateCheckState = (item: PackingListItem): { checked: boolean; indeterminate: boolean } => {
  if (!isList(item)) {
    return { checked: item.checked, indeterminate: false };
  }

  const totalItems = item.items.length;
  const checkedItems = item.items.reduce((count, childItem) => {
    const childState = calculateCheckState(childItem);
    return count + (childState.checked ? 1 : 0);
  }, 0);

  return {
    checked: checkedItems === totalItems,
    indeterminate: checkedItems > 0 && checkedItems < totalItems
  };
};

const ListItemComponent = ({ 
  item, 
  level = 0,
  onToggle 
}: ListItemComponentProps) => {
  const [open, setOpen] = useState(true);
  const hasSubItems = isList(item);
  const checkState = calculateCheckState(item);

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
              checked={checkState.checked}
              indeterminate={checkState.indeterminate}
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