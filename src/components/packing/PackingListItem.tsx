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

interface PackingListItemProps {
  item: Item;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newName: string) => void;
}

const PackingListItem = ({
  item,
  onToggle,
  onDelete,
  onEdit,
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

  if (editMode) {
    return (
      <>
        <EditableListItem
          item={item}
          onSave={(newName) => onEdit(item.id, newName)}
          onDelete={handleDelete}
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
                textDecoration: item.checked ? "line-through" : "none",
                textDecorationThickness: "0.2rem",
                textDecorationColor: "rgba(0,20,0,0.5)",
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
