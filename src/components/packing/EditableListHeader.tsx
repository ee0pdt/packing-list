import { useState, useEffect, useRef } from "react";
import {
  CardHeader,
  TextField,
  styled,
  Typography,
} from "@mui/material";
import { List } from "../../types/packing";

enum EditableHeaderState {
  VIEWING = 'VIEWING',
  EDITING = 'EDITING'
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
  isEditing?: boolean;
  onClick?: () => void;
  suffix?: React.ReactNode;
}

const EditableListHeader = ({
  list,
  onSave,
  isEditing = false,
  onClick,
  suffix,
}: EditableListHeaderProps) => {
  const [state, setState] = useState<EditableHeaderState>(
    isEditing ? EditableHeaderState.EDITING : EditableHeaderState.VIEWING
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

  useEffect(() => {
    setState(isEditing ? EditableHeaderState.EDITING : EditableHeaderState.VIEWING);
  }, [isEditing]);

  const handleClick = () => {
    if (state === EditableHeaderState.VIEWING && onClick) {
      onClick();
    }
  };

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      setState(EditableHeaderState.VIEWING);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSave();
    }
  };

  return (
    <CardHeader
      onClick={handleClick}
      sx={{
        cursor: state === EditableHeaderState.VIEWING ? "pointer" : "default",
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
            onBlur={handleSave}
            inputRef={inputRef}
            placeholder={list ? "Edit list name" : "New list name"}
            autoComplete="off"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <Typography variant="listItem">{list?.name || ""}</Typography>
        )
      }
      action={suffix}
    />
  );
};

export default EditableListHeader;