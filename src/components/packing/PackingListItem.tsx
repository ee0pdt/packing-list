import {
  ListItem,
  ListItemButton,
  ListItemText,
  Checkbox,
  Typography,
  Box,
  IconButton,
  Fade,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Item } from "../../types/packing";
import { useEditMode } from "../../contexts/EditModeContext";
import DeleteItemDialog from "../dialogs/DeleteItemDialog";
import { useState } from "react";
import EditableListItem from "./EditableListItem";
import { strikethrough, unstrike } from "../../styles/animations";
import SwipeableContainer from "../common/SwipeableContainer";

interface PackingListItemProps {
  item: Item;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newName: string) => void;
  isEditing?: boolean;
}

const PackingListItem = ({
  item,
  onToggle,
  onDelete,
  onEdit,
  isEditing = false,
}: PackingListItemProps) => {
  const { editMode } = useEditMode();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isItemEditing, setIsItemEditing] = useState(isEditing);
  const [isHovering, setIsHovering] = useState(false);
  const isTouchDevice = typeof window !== "undefined" && 
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  const handleToggle = () => {
    if (!editMode) {
      onToggle(item.id);
    }
  };

  const handleDelete = () => {
    if (isTouchDevice) {
      onDelete(item.id);
    } else {
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    onDelete(item.id);
    setDeleteDialogOpen(false);
  };

  const handleEdit = () => {
    setIsItemEditing(true);
  };

  if (editMode || isItemEditing) {
    return (
      <>
        <EditableListItem
          item={item}
          onSave={(newName) => {
            onEdit(item.id, newName);
            setIsItemEditing(false);
          }}
          onCancel={() => setIsItemEditing(false)}
          onDelete={handleDelete}
          autoFocus={isItemEditing}
        />
        {!isTouchDevice && (
          <DeleteItemDialog
            open={deleteDialogOpen}
            itemName={item.name}
            onClose={() => setDeleteDialogOpen(false)}
            onConfirm={handleConfirmDelete}
          />
        )}
      </>
    );
  }

  const itemContent = (
    <ListItem
      disablePadding
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      sx={{
        backgroundColor: (theme) =>
          item.checked
            ? theme.palette.success.light
            : theme.palette.background.paper,
      }}
      secondaryAction={
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {!isTouchDevice && (
            <Fade in={isHovering}>
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <IconButton
                  onClick={handleEdit}
                  size="small"
                  sx={{ color: "action.active" }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={handleDelete}
                  size="small"
                  sx={{ color: "error.main" }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Fade>
          )}
          <Checkbox
            onClick={handleToggle}
            checked={item.checked}
            disableRipple
            color={item.checked ? "success" : "info"}
          />
        </Box>
      }
    >
      <ListItemButton onClick={handleToggle}>
        <ListItemText
          primary={
            <Typography
              variant="listItem"
              sx={{
                textDecoration: "line-through",
                textDecorationColor: "transparent",
                animation: item.checked
                  ? `${strikethrough} 0.3s ease-in-out forwards`
                  : `${unstrike} 0.3s ease-in-out forwards`,
              }}
            >
              {item.name}
            </Typography>
          }
        />
      </ListItemButton>
    </ListItem>
  );

  return (
    <>
      <SwipeableContainer onDelete={handleDelete} disabled={editMode}>
        {itemContent}
      </SwipeableContainer>
      {!isTouchDevice && (
        <DeleteItemDialog
          open={deleteDialogOpen}
          itemName={item.name}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default PackingListItem;