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
import MarkPackedDialog from '../dialogs/MarkPackedDialog';

interface ListItemComponentProps {
  item: PackingListItem;
  level?: number;
  onToggle?: (id: string) => void;
  onMarkAllPacked?: (id: string, markAsPacked: boolean) => void;
}

const countSubItems = (item: PackingListItem): number => {
  if (!isList(item)) {
    return 0;
  }
  return item.items.reduce((count, subItem) => {
    return count + 1 + countSubItems(subItem);
  }, 0);
};

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
  onToggle,
  onMarkAllPacked,
}: ListItemComponentProps) => {
  const [open, setOpen] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const hasSubItems = isList(item);
  const checkState = calculateCheckState(item);
  const subItemCount = hasSubItems ? countSubItems(item) : 0;

  const handleClick = () => {
    if (hasSubItems) {
      setOpen(!open);
    }
  };

  const handleCheckboxClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (hasSubItems && (checkState.checked || !checkState.indeterminate)) {
      setDialogOpen(true);
    } else {
      onToggle?.(item.id);
    }
  };

  const handleConfirmMarkAll = () => {
    onMarkAllPacked?.(item.id, !checkState.checked);
    setDialogOpen(false);
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
                onMarkAllPacked={onMarkAllPacked}
              />
            ))}
          </List>
        </Collapse>
      )}
      {hasSubItems && (
        <MarkPackedDialog
          open={dialogOpen}
          itemCount={subItemCount}
          isUnpacking={checkState.checked}
          onClose={() => setDialogOpen(false)}
          onConfirm={handleConfirmMarkAll}
        />
      )}
    </>
  );
};

export default ListItemComponent;