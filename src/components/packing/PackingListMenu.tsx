import React, { useState } from "react";
import { Menu, MenuItem, IconButton, Divider } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

interface PackingListMenuProps {
  isEditMode?: boolean;
  progress: number;
  onMarkAll: (e: React.MouseEvent) => void;
  onAdd?: () => void;  // New prop for adding items
  onDelete?: () => void;
  disabled?: boolean;
}

export const PackingListMenu: React.FC<PackingListMenuProps> = ({
  isEditMode = false,
  progress,
  onMarkAll,
  onAdd,
  onDelete,
  disabled = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAll = (event: React.MouseEvent) => {
    onMarkAll(event);
    handleClose();
  };

  const handleAdd = (event: React.MouseEvent) => {
    if (onAdd) {
      event.stopPropagation();
      onAdd();
      handleClose();
    }
  };

  const handleDelete = (event: React.MouseEvent) => {
    if (onDelete) {
      event.stopPropagation();
      onDelete();
      handleClose();
    }
  };

  return (
    <>
      <IconButton
        onClick={handleMenuOpen}
        disabled={disabled}
        aria-controls={open ? "list-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="list-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {onAdd && (
          <MenuItem onClick={handleAdd}>
            Add Item
          </MenuItem>
        )}
        <MenuItem onClick={handleMarkAll} disabled={isEditMode}>
          Mark all as {progress === 100 ? "Unpacked" : "Packed"}
        </MenuItem>
        {onDelete && (
          <>
            <Divider />
            <MenuItem onClick={handleDelete}>Delete List</MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};