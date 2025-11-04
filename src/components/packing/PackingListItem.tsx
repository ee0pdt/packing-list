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
import DeleteItemDialog from "../dialogs/DeleteItemDialog";
import { useState } from "react";
import EditableListItem from "./EditableListItem";
import { strikethrough, unstrike, jellyBounce, morphIn } from "../../styles/animations";
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isItemEditing, setIsItemEditing] = useState(isEditing);
  const [isHovering, setIsHovering] = useState(false);
  const isTouchDevice = typeof window !== "undefined" && 
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

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
    <ListItem
      disablePadding
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      sx={{
        background: item.checked ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(15px) saturate(180%) brightness(120%)',
        WebkitBackdropFilter: 'blur(15px) saturate(180%) brightness(120%)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: `
          0 8px 32px 0 rgba(31, 38, 135, 0.15),
          inset 0 1px 1px 0 rgba(255, 255, 255, 0.4)
        `,
        borderRadius: '16px',
        marginBottom: '12px',
        overflow: 'hidden',
        position: 'relative',
        animation: `${morphIn} 0.5s ease-out`,
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.18)',
          backdropFilter: 'blur(20px) saturate(180%) brightness(120%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%) brightness(120%)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          transform: 'translateX(8px) scale(1.02)',
          boxShadow: `
            0 12px 40px 0 rgba(31, 38, 135, 0.25),
            inset 0 1px 3px 0 rgba(255, 255, 255, 0.6)
          `,
        },
        '&:active': {
          transform: 'scale(0.95)',
          transition: 'transform 0.1s ease-out',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: item.checked
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(110, 231, 183, 0.15) 100%)'
            : 'transparent',
          pointerEvents: 'none',
          transition: 'all 0.5s ease',
        },
      }}
      secondaryAction={
        <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          zIndex: 2,
        }}>
          {!isTouchDevice && (
            <Fade in={isHovering}>
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <IconButton
                  onClick={handleEdit}
                  size="small"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                      transform: 'scale(1.15) rotate(-5deg)',
                    }
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={handleDelete}
                  size="small"
                  sx={{
                    color: "rgba(236, 72, 153, 0.95)",
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      background: 'rgba(236, 72, 153, 0.2)',
                      transform: 'scale(1.15) rotate(5deg)',
                    }
                  }}
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
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              '&.Mui-checked': {
                color: 'rgba(16, 185, 129, 0.95)',
                animation: `${jellyBounce} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)`,
              },
              '& .MuiSvgIcon-root': {
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
              }
            }}
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
        sx={{
          padding: '16px',
          '&:hover': {
            background: 'transparent',
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
                color: 'rgba(255, 255, 255, 0.95)',
                fontWeight: 500,
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                animation: item.checked
                  ? `${strikethrough} 0.3s ease-in-out forwards`
                  : `${unstrike} 0.3s ease-in-out forwards`,
                transition: 'all 0.3s ease',
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