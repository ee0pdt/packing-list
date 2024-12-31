import { useState, useEffect, useRef } from "react";
import {
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  TextField,
  Box,
} from "@mui/material";
import {
  Save as SaveIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Item } from "../../types/packing";
import { useEditMode } from "../../contexts/EditModeContext";

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

  // When entering edit mode, focus the input
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      // Select all text when editing existing item
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

  // If we're not in edit mode and this is a create field, don't render
  if (!editMode && !item) {
    return null;
  }

  return (
    <ListItem
      disablePadding
      secondaryAction={
        isEditing ? (
          <Box>
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
          </Box>
        ) : editMode ? (
          <Box>
            <IconButton edge="end" onClick={handleStartEdit}>
              <EditIcon />
            </IconButton>
            {item && onDelete && (
              <IconButton edge="end" onClick={onDelete} color="error">
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ) : null
      }
    >
      <ListItemButton 
        onClick={handleStartEdit}
        disabled={isEditing}
        sx={{ 
          cursor: editMode ? 'pointer' : 'default',
          "&.Mui-disabled": {
            opacity: 1,
          }
        }}
      >
        <ListItemText>
          {isEditing ? (
            <TextField
              fullWidth
              variant="standard"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyPress}
              inputRef={inputRef}
              placeholder={item ? "Edit item" : "New item"}
              InputProps={{
                sx: {
                  fontSize: "inherit",
                  "& .MuiInput-input": {
                    padding: 0,
                  },
                },
              }}
              autoComplete="off"
            />
          ) : (
            item?.name || ""
          )}
        </ListItemText>
      </ListItemButton>
    </ListItem>
  );
};

export default EditableListItem;