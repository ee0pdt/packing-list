import {
  ListItem,
  ListItemButton,
  ListItemText,
  Checkbox,
  Typography,
  IconButton,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Item } from "../../types/packing";
import { useEditMode } from "../../contexts/EditModeContext";

interface PackingListItemProps {
  item: Item;
  onToggle: (id: string) => void;
}

const PackingListItem = ({ item, onToggle }: PackingListItemProps) => {
  const { editMode } = useEditMode();

  const handleClick = () => {
    if (!editMode) {
      onToggle(item.id);
    }
  };

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
        editMode ? (
          <>
            <IconButton edge="end" aria-label="edit">
              <EditIcon />
            </IconButton>
            <IconButton edge="end" aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </>
        ) : (
          <Checkbox
            edge="end"
            checked={item.checked}
            disableRipple
            color={item.checked ? "success" : "info"}
          />
        )
      }
    >
      <ListItemButton onClick={handleClick}>
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