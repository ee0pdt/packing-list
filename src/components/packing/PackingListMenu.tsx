import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  Folder as FolderIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useState } from "react";

interface PackingListMenuProps {
  progress: number;
  onMarkAll: (event: React.MouseEvent) => void;
  onAdd?: () => void;
  onAddSublist?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
}

export const PackingListMenu = ({
  progress,
  onMarkAll,
  onAdd,
  onAddSublist,
  onEdit,
  onDelete,
}: PackingListMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (handler: () => void, event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    handler();
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>

      <Menu 
        anchorEl={anchorEl} 
        open={Boolean(anchorEl)} 
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
      >
        {onAdd && (
          <MenuItem onClick={(e) => handleMenuItemClick(onAdd, e)}>
            <ListItemIcon>
              <AddCircleOutlineIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Add Item</ListItemText>
          </MenuItem>
        )}
        
        {onAddSublist && (
          <MenuItem onClick={(e) => handleMenuItemClick(onAddSublist, e)}>
            <ListItemIcon>
              <FolderIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Add Sublist</ListItemText>
          </MenuItem>
        )}

        {onEdit && (
          <MenuItem onClick={(e) => handleMenuItemClick(onEdit, e)}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Rename List</ListItemText>
          </MenuItem>
        )}

        <MenuItem onClick={(e) => handleMenuItemClick(() => onMarkAll(e), e)}>
          {progress === 100 ? "Mark All Unpacked" : "Mark All Packed"}
        </MenuItem>

        {onDelete && (
          <MenuItem onClick={(e) => handleMenuItemClick(onDelete, e)}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
            </ListItemIcon>
            <ListItemText sx={{ color: 'error.main' }}>Delete List</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};