import {
  ListItem,
  ListItemButton,
  ListItemText,
  Checkbox,
  Typography,
} from "@mui/material";
import { Item } from "../../types/packing";
import { useEditMode } from "../../contexts/EditModeContext";
import DeleteItemDialog from "../dialogs/DeleteItemDialog";
import { useState } from "react";
import EditableListItem from "./EditableListItem";
import { strikethrough, unstrike } from "../../styles/animations";

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

  const handleToggle = () => {
    if (!editMode) {
      onToggle(item.id);
    }
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(item.id);
    setDeleteDialogOpen(false);
  };

  if (editMode || isEditing) {
    return (
      <>
        <EditableListItem
          item={item}
          onSave={(newName) => onEdit(item.id, newName)}
          onDelete={handleDelete}
          autoFocus={isEditing}
        />
        <DeleteItemDialog
          open={deleteDialogOpen}
          itemName={item.name}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      </>
    );
  }

  return (
    <ListItem
      disablePadding
      sx={{
        backgroundColor: (theme) =>
          item.checked
            ? theme.palette.success.light
            : theme.palette.background.paper,
      }}
      secondaryAction={
        <Checkbox
          onClick={handleToggle}
          checked={item.checked}
          disableRipple
          color={item.checked ? "success" : "info"}
        />
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
};

export default PackingListItem;