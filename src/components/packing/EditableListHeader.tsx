import { useState, useEffect, useRef } from "react";
import {
  CardHeader,
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
import { List } from "../../types/packing";
import { useEditMode } from "../../contexts/EditModeContext";

enum EditableHeaderState {
  VIEWING = 'VIEWING',
  EDITING = 'EDITING',
  CONFIRMING_DELETE = 'CONFIRMING_DELETE'
}

// Custom styled TextField to match header typography
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

interface EditableListHeaderProps {
  list?: List;
  onSave: (name: string) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  autoFocus?: boolean;
}

const EditableListHeader = ({
  list,
  onSave,
  onCancel,
  onDelete,
  autoFocus = false,
}: EditableListHeaderProps) => {
  const { editMode } = useEditMode();
  const [state, setState] = useState<EditableHeaderState>(
    autoFocus ? EditableHeaderState.EDITING : EditableHeaderState.VIEWING
  );
  const [name, setName] = useState(list?.name || "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state === EditableHeaderState.EDITING) {
      inputRef.current?.focus();
      if (list) {
        inputRef.current?.select();
      }
    }
  }, [state, list]);

  const handleStartEdit = () => {
    if (editMode) {
      setState(EditableHeaderState.EDITING);
    }
  };

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      setState(EditableHeaderState.VIEWING);
      if (!list) {
        setName(""); // Clear input if this was a create
      }
    }
  };

  const handleCancel = () => {
    setState(EditableHeaderState.VIEWING);
    setName(list?.name || "");
    if (!list) {
      onCancel?.();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSave();
    } else if (event.key === "Escape") {
      handleCancel();
    }
  };

  if (!editMode && !list) {
    return null;
  }

  const renderActions = () => {
    switch (state) {
      case EditableHeaderState.EDITING:
        return (
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
        );
      case EditableHeaderState.VIEWING:
        if (!editMode) return null;
        return (
          <Stack direction="row" spacing={2}>
            <IconButton onClick={handleStartEdit}>
              <EditIcon />
            </IconButton>
            {list && onDelete && (
              <IconButton onClick={onDelete} color="error">
                <DeleteIcon />
              </IconButton>
            )}
          </Stack>
        );
      case EditableHeaderState.CONFIRMING_DELETE:
        // TODO: Implement delete confirmation UI
        return null;
    }
  };

  return (
    <CardHeader
      onClick={state === EditableHeaderState.VIEWING ? handleStartEdit : undefined}
      sx={{
        cursor: editMode && state === EditableHeaderState.VIEWING ? "pointer" : "default",
        "& .MuiCardHeader-content": {
          overflow: "hidden",
        },
      }}
      title={
        state === EditableHeaderState.EDITING ? (
          <StyledTextField
            fullWidth
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyPress}
            inputRef={inputRef}
            placeholder={list ? "Edit list name" : "New list name"}
            autoComplete="off"
          />
        ) : (
          <Typography variant="h6">{list?.name || ""}</Typography>
        )
      }
      action={renderActions()}
    />
  );
};

export default EditableListHeader;