import { useState, useEffect, useRef } from "react";
import {
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  TextField,
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
  autoFocus?: boolean;
}

const EditableListItem = ({
  item,
  onSave,
  onCancel,
  onDelete,
  initiallyEditing = false,
  autoFocus = false,
}: EditableListItemProps) => {
  const [isEditing, setIsEditing] = useState(initiallyEditing || autoFocus);
  const [name, setName] = useState(item?.name || "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing || autoFocus) {
      inputRef.current?.focus();
      if (item) {
        inputRef.current?.select();
      }
    }
  }, [isEditing, item, autoFocus]);

  const handleStartEdit = () => {
    setIsEditing(true);
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

  if (!item && !isEditing) {
    return null;
  }

  return (
    <ListItem
      disablePadding
      secondaryAction={
        isEditing ? (
          <Stack direction="row" spacing={2}>
            <IconButton
              onClick={handleSave}
              color="success"
              disabled={!name.trim()}
            >
              <SaveIcon />
            </IconButton>
            <IconButton onClick={handleCancel} color="error">
              <CloseIcon />
            </IconButton>
          </Stack>
        ) : (
          <Stack direction="row" spacing={2}>
            <IconButton onClick={handleStartEdit}>
              <EditIcon />
            </IconButton>
            {item && onDelete && (
              <IconButton onClick={onDelete} color="error">
                <DeleteIcon />
              </IconButton>
            )}
          </Stack>
        )
      }
    >
      <ListItemButton
        onClick={handleStartEdit}
        disabled={isEditing}
        sx={{
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