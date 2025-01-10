import {
  ListItem,
  ListItemButton,
  ListItemText,
  Checkbox,
  Typography,
  Box,
  IconButton,
  Fade,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Item } from "../../types/packing";
import DeleteItemDialog from "../dialogs/DeleteItemDialog";
import { useState, useRef, useEffect } from "react";
import EditableListItem from "./EditableListItem";
import { strikethrough, unstrike } from "../../styles/animations";
import SwipeableContainer from "../common/SwipeableContainer";
import InsertButton from "./InsertButton";
import { useInsert } from "../../contexts/InsertContext";

interface PackingListItemProps {
  item: Item;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newName: string) => void;
  onInsert: (id: string, position: "above" | "below", name: string) => void;
  isEditing?: boolean;
}

const PackingListItem = ({
  item,
  onToggle,
  onDelete,
  onEdit,
  onInsert,
  isEditing = false,
}: PackingListItemProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isItemEditing, setIsItemEditing] = useState(isEditing);
  const [isHovering, setIsHovering] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const { state, dispatch } = useInsert();
  const theme = useTheme();
  
  const isTouchDevice = typeof window !== "undefined" && 
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  const isInsertTarget = state.focusedItemId === item.id;
  const showInsertButtons = isHovering || isInsertTarget;
  const showInsertForm = isInsertTarget && state.insertPosition !== null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isInsertTarget) return;
      
      if (e.altKey) {
        if (e.key === "ArrowUp") {
          dispatch({ type: "START_INSERT", position: "above" });
          e.preventDefault();
        } else if (e.key === "ArrowDown") {
          dispatch({ type: "START_INSERT", position: "below" });
          e.preventDefault();
        }
      } else if (e.key === "Escape" && state.insertPosition) {
        dispatch({ type: "CANCEL_INSERT" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isInsertTarget, dispatch, state.insertPosition]);

  const handleToggle = () => {
    onToggle(item.id);
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

  const handleInsert = (position: "above" | "below") => {
    dispatch({ type: "START_INSERT", position });
  };

  const handleInsertSave = (name: string) => {
    if (state.insertPosition) {
      onInsert(item.id, state.insertPosition, name);
      dispatch({ type: "CANCEL_INSERT" });
    }
  };

  const handleInsertCancel = () => {
    dispatch({ type: "CANCEL_INSERT" });
  };

  if (isItemEditing) {
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
    <Box
      ref={itemRef}
      tabIndex={0}
      onFocus={() => dispatch({ type: "FOCUS_ITEM", id: item.id })}
      onBlur={() => dispatch({ type: "BLUR_ITEM" })}
      sx={{ position: "relative" }}
    >
      {showInsertForm && state.insertPosition === "above" && (
        <EditableListItem
          onSave={handleInsertSave}
          onCancel={handleInsertCancel}
          initiallyEditing={true}
          autoFocus={true}
        />
      )}
      <InsertButton
        position="top"
        visible={showInsertButtons}
        onClick={() => handleInsert("above")}
      />
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
              onClick={(e) => {
                e.preventDefault();
                handleToggle();
              }}
              checked={item.checked}
              disableRipple
              color={item.checked ? "success" : "info"}
            />
          </Box>
        }
      >
        <ListItemButton
          onClick={(event) => {
            if (isTouchDevice && !event.defaultPrevented) {
              handleEdit();
              event.preventDefault();
            } else {
              handleToggle();
            }
          }}
        >
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
      <InsertButton
        position="bottom"
        visible={showInsertButtons}
        onClick={() => handleInsert("below")}
      />
      {showInsertForm && state.insertPosition === "below" && (
        <EditableListItem
          onSave={handleInsertSave}
          onCancel={handleInsertCancel}
          initiallyEditing={true}
          autoFocus={true}
        />
      )}
    </Box>
  );

  return (
    <>
      <SwipeableContainer onDelete={handleDelete}>
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