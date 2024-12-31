import { useState } from "react";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Collapse,
  List,
  Chip,
  Stack,
  LinearProgress,
  Box,
  useTheme,
  Paper,
  IconButton,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { ListItem as PackingListItem, isList } from "../../types/packing";
import MarkPackedDialog from "../dialogs/MarkPackedDialog";

interface ListItemComponentProps {
  item: PackingListItem;
  level?: number;
  onToggle?: (id: string) => void;
  onMarkAllPacked?: (id: string, markAsPacked: boolean) => void;
}

// Keep this for total counts in the dialog
const countSubItems = (item: PackingListItem): number => {
  if (!isList(item)) {
    return 0;
  }
  return item.items.reduce((count, subItem) => {
    return count + 1 + countSubItems(subItem);
  }, 0);
};

const calculateDirectProgress = (item: PackingListItem): number => {
  if (!isList(item)) return 0;

  const checkedDirectChildren = item.items.reduce((count, child) => {
    // For direct children, count them as complete if:
    // - They're a single item and checked
    // - They're a list and their check state is complete
    if (isList(child)) {
      const childState = calculateCheckState(child);
      return count + (childState.checked ? 1 : 0);
    }
    return count + (child.checked ? 1 : 0);
  }, 0);

  return (checkedDirectChildren / item.items.length) * 100;
};

const calculateCheckState = (
  item: PackingListItem,
): { checked: boolean; indeterminate: boolean } => {
  if (!isList(item)) {
    return { checked: item.checked, indeterminate: false };
  }

  const totalItems = item.items.length;
  const checkedItems = item.items.reduce((count, childItem) => {
    if (!isList(childItem)) {
      return count + (childItem.checked ? 1 : 0);
    }
    const childState = calculateCheckState(childItem);
    return count + (childState.checked ? 1 : 0);
  }, 0);

  return {
    checked: checkedItems === totalItems,
    indeterminate: checkedItems > 0 && checkedItems < totalItems,
  };
};

const ListItemComponent = ({
  item,
  level = 0,
  onToggle,
  onMarkAllPacked,
}: ListItemComponentProps) => {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const theme = useTheme();
  const hasSubItems = isList(item);
  const checkState = calculateCheckState(item);
  const totalItemCount = hasSubItems ? countSubItems(item) : 0;
  const directChildCount = hasSubItems ? item.items.length : 0;
  const progress = hasSubItems ? calculateDirectProgress(item) : 0;
  const isInProgress = hasSubItems && progress >= 0 && progress <= 100;

  const handleClick = () => {
    if (hasSubItems) {
      setOpen(!open);
    } else {
      onToggle?.(item.id);
    }
  };

  const handleCheckboxClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (hasSubItems && (checkState.checked || !checkState.indeterminate)) {
      setDialogOpen(true);
    } else {
      onToggle?.(item.id);
    }
  };

  const handleConfirmMarkAll = () => {
    onMarkAllPacked?.(item.id, !checkState.checked);
    setDialogOpen(false);
  };

  const collapseTitle = open ? "Click to collapse" : "Click to expand";
  const packTitle = checkState.checked ? "Mark as Unpacked" : "Mark as Packed";
  const buttonTitle = hasSubItems ? collapseTitle : packTitle;

  return (
    <Paper elevation={level} sx={{ m: 2 }}>
      <ListItem
        disablePadding
        secondaryAction={
          !hasSubItems ? (
            <Checkbox
              onClick={handleCheckboxClick}
              edge="start"
              checked={checkState.checked}
              indeterminate={checkState.indeterminate}
              disableRipple
              color={checkState.checked ? "success" : "info"}
            />
          ) : (
            <IconButton edge="end" onClick={handleCheckboxClick}>
              ...
            </IconButton>
          )
        }
      >
        <ListItemButton
          onClick={handleClick}
          title={buttonTitle}
          sx={{ flexDirection: "column", alignItems: "flex-start" }}
        >
          <Stack
            direction="row"
            spacing={0}
            alignItems="center"
            sx={{ width: "100%" }}
          >
            {hasSubItems && (
              <>
                {/* <Chip
                  label={directChildCount}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ marginInlineEnd: 1, minWidth: "32px" }}
                /> */}
                {open ? <ExpandLess /> : <ExpandMore />}
              </>
            )}
            <ListItemText primary={item.name} />
            {/* <ListItemIcon onClick={handleCheckboxClick}>
              <Checkbox
                edge="start"
                checked={checkState.checked}
                indeterminate={checkState.indeterminate}
                disableRipple
                color={checkState.checked ? "success" : "info"}
              />
            </ListItemIcon> */}
          </Stack>
          {isInProgress && (
            <Box sx={{ width: "100%", mt: 1, px: 0 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  "& .MuiLinearProgress-bar": {
                    backgroundColor:
                      progress == 100
                        ? theme.palette.success.main
                        : theme.palette.info.main,
                  },
                }}
              />
            </Box>
          )}
        </ListItemButton>
      </ListItem>
      {hasSubItems && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List disablePadding>
            {item.items.map((subItem) => (
              <ListItemComponent
                key={subItem.id}
                item={subItem}
                level={level + 1}
                onToggle={onToggle}
                onMarkAllPacked={onMarkAllPacked}
              />
            ))}
          </List>
        </Collapse>
      )}
      {hasSubItems && (
        <MarkPackedDialog
          open={dialogOpen}
          itemCount={totalItemCount}
          isUnpacking={checkState.checked}
          onClose={() => setDialogOpen(false)}
          onConfirm={handleConfirmMarkAll}
        />
      )}
    </Paper>
  );
};

export default ListItemComponent;
