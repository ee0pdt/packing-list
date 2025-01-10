import { IconButton, Menu, MenuItem, Stack } from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  Folder as FolderIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useState } from "react";

interface PackingListMenuProps {
  isEditMode: boolean;
  progress: number;
  onMarkAll: (event: React.MouseEvent) => void;
  onAdd?: () => void;
  onAddSublist?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
}

export const PackingListMenu = ({
  isEditMode,
  progress,
  onMarkAll,
  onAdd,
  onAddSublist,
  onEdit,
  onDelete,
  disabled,
}: PackingListMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (handler: () => void) => {
    handler();
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {isEditMode && onAdd && (
          <MenuItem onClick={() => handleMenuItemClick(onAdd)}>
            <Stack direction="row" spacing={1} alignItems="center">
              <AddCircleOutlineIcon fontSize="small" />
              Add Item
            </Stack>
          </MenuItem>
        )}
        
        {isEditMode && onAddSublist && (
          <MenuItem onClick={() => handleMenuItemClick(onAddSublist)}>
            <Stack direction="row" spacing={1} alignItems="center">
              <FolderIcon fontSize="small" />
              Add Sublist
            </Stack>
          </MenuItem>
        )}

        {isEditMode && onEdit && (
          <MenuItem onClick={() => handleMenuItemClick(onEdit)}>
            <Stack direction="row" spacing={1} alignItems="center">
              <EditIcon fontSize="small" />
              Rename List
            </Stack>
          </MenuItem>
        )}

        {!disabled && (
          <MenuItem onClick={(e) => handleMenuItemClick(() => onMarkAll(e))}>
            {progress === 100 ? "Mark All Unpacked" : "Mark All Packed"}
          </MenuItem>
        )}

        {isEditMode && onDelete && (
          <MenuItem onClick={() => handleMenuItemClick(onDelete)}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'error.main' }}>
              <DeleteIcon fontSize="small" />
              Delete List
            </Stack>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};
