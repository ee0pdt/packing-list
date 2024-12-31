import { useState, useEffect, useRef } from "react";
import {
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  TextField,
  Box,
  styled,
  Typography,
  Stack,
} from "@mui/material";
import {
  Save as SaveIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Item } from "../../types/packing";
import { useEditMode } from "../../contexts/EditModeContext";

// Custom styled TextField to match listItem typography
const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    fontFamily: '"Patrick Hand", cursive',
    fontSize: "1.5rem",
    lineHeight: 1.5,
    fontWeight: 200,
    "&:before, &:after": {
      borderBottomColor: theme.palette.primary.main,
    },
    "& input": {
      padding: "0",
      fontFamily: "inherit",
      fontSize: "inherit",
      lineHeight: "inherit",
      fontWeight: "inherit",
    },
  },
}));

interface EditableListItemProps {
  item?: Item;
  onSave: (name: string) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  initiallyEditing?: boolean;
}

const EditableListItem = ({
  item,
  onSave,
  onCancel,
  onDelete,
  initiallyEditing = false,
}: EditableListItemProps) => {
  const { editMode } = useEditMode();
  const [isEditing, setIsEditing] = useState(initiallyEditing);
  const [name, setName] = useState(item?.name || "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      if (item) {
        inputRef.current?.select();
      }
    }
  }, [isEditing, item]);

  const handleStartEdit = () => {
    if (editMode) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      setIsEditing(false);
      if (!item) {
        setName(""); // Clear input if this was a create
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(item?.name || "");
    onCancel?.();
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSave();
    } else if (event.key === "Escape") {
      handleCancel();
    }
  };

  if (!editMode && !item) {
    return null;
  }

  return (
    <ListItem
      disablePadding
      secondaryAction={
        isEditing ? (
          <Stack direction="row" spacing={2}>
            <IconButton
              edge="end"
              onClick={handleSave}
              color="success"
              disabled={!name.trim()}
            >
              <SaveIcon />
            </IconButton>
            <IconButton edge="end" onClick={handleCancel} color="error">
              <CloseIcon />
            </IconButton>
          </Stack>
        ) : editMode ? (
          <Stack direction="row" spacing={2}>
            <IconButton edge="end" onClick={handleStartEdit}>
              <EditIcon />
            </IconButton>
            {item && onDelete && (
              <IconButton edge="end" onClick={onDelete} color="error">
                <DeleteIcon />
              </IconButton>
            )}
          </Stack>
        ) : null
      }
    >
      <ListItemButton
        onClick={handleStartEdit}
        disabled={isEditing}
        sx={{
          cursor: editMode ? "pointer" : "default",
          "&.Mui-disabled": {
            opacity: 1,
          },
        }}
      >
        <ListItemText>
          {isEditing ? (
            <StyledTextField
              fullWidth
              variant="standard"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyPress}
              inputRef={inputRef}
              placeholder={item ? "Edit item" : "New item"}
              autoComplete="off"
            />
          ) : (
            <Typography variant="listItem">{item?.name || ""}</Typography>
          )}
        </ListItemText>
      </ListItemButton>
    </ListItem>
  );
};

export default EditableListItem;
