import { useState, useMemo, useEffect } from "react";
import {
  List as MuiList,
  Paper,
  Typography,
  Collapse,
  ListItem,
  ListItemButton,
  ListItemIcon,
  IconButton,
  LinearProgress,
  useTheme,
} from "@mui/material";
import { ExpandLess, ExpandMore, MoreVert } from "@mui/icons-material";
import {
  List,
  ListItem as PackingListItemType,
  Item,
} from "../../types/packing";
import PackingListItem from "./PackingListItem";
import MarkPackedDialog from "../dialogs/MarkPackedDialog";

interface PackingListProps {
  list: List;
  onToggle: (id: string) => void;
  onMarkAllPacked?: (id: string, markAsPacked: boolean) => void;
  level?: number;
}

const isItem = (item: PackingListItemType): item is Item => {
  return "checked" in item;
};

const PackingList = ({
  list,
  onToggle,
  onMarkAllPacked,
  level = 0,
}: PackingListProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const theme = useTheme();

  // Memoized recursive function to check if an item or list is packed
  const isPackedMemo = useMemo(() => {
    const checkPacked = (item: PackingListItemType): boolean => {
      if (isItem(item)) {
        return item.checked;
      }
      return item.items.every((subItem) => checkPacked(subItem));
    };
    return checkPacked;
  }, []);

  // Calculate packed items and progress
  const { packedCount, totalCount, progress, allSubItems } = useMemo(() => {
    let packed = 0;
    let total = 0;
    let allItems = 0; // This counts ALL items, including those in sublists

    const countItems = (items: PackingListItemType[]) => {
      items.forEach((item) => {
        if (isItem(item)) {
          total++;
          allItems++;
          if (item.checked) packed++;
        } else {
          total++;
          if (item.items.every((subItem) => isPackedMemo(subItem))) packed++;
          // Recursively count items in sublists
          item.items.forEach((subItem) => {
            if (isItem(subItem)) {
              allItems++;
            } else {
              countItems(subItem.items);
            }
          });
        }
      });
    };

    countItems(list.items);
    const progressValue = total > 0 ? (packed / total) * 100 : 0;

    return {
      packedCount: packed,
      totalCount: total,
      progress: progressValue,
      allSubItems: allItems,
    };
  }, [list.items, isPackedMemo]);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMarkAllClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDialogOpen(true);
  };

  const handleConfirmMarkAll = () => {
    if (onMarkAllPacked) {
      onMarkAllPacked(list.id, progress !== 100);
    }
    setDialogOpen(false);
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          pl: 2,
          mt: 2,
          overflow: "hidden",
          borderRadius: "8px 0 0 8px",
          backgroundColor: !isExpanded
            ? progress === 100
              ? theme.palette.success.dark
              : theme.palette.info.dark
            : theme.palette.background.paper,
        }}
      >
        <ListItem
          disablePadding
          sx={{
            backgroundColor: !isExpanded
              ? progress === 100
                ? theme.palette.success.light
                : theme.palette.info.light
              : theme.palette.background.paper,
          }}
          secondaryAction={
            <IconButton onClick={handleMarkAllClick}>
              <MoreVert />
            </IconButton>
          }
        >
          <ListItemButton onClick={handleExpand}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </ListItemIcon>
            <Typography variant="listItem">
              {list.name} ({packedCount}/{totalCount})
            </Typography>
          </ListItemButton>
        </ListItem>

        {isExpanded && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              "& .MuiLinearProgress-bar": {
                backgroundColor:
                  progress === 100
                    ? theme.palette.success.main
                    : theme.palette.info.main,
              },
            }}
          />
        )}

        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <MuiList disablePadding>
            {list.items.map((item) =>
              isItem(item) ? (
                <PackingListItem
                  key={item.id}
                  item={item}
                  onToggle={onToggle}
                />
              ) : (
                <PackingList
                  key={item.id}
                  list={item}
                  onToggle={onToggle}
                  onMarkAllPacked={onMarkAllPacked}
                  level={level + 1}
                />
              ),
            )}
          </MuiList>
        </Collapse>
      </Paper>

      <MarkPackedDialog
        open={dialogOpen}
        itemCount={allSubItems}
        isUnpacking={progress === 100}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmMarkAll}
      />
    </>
  );
};

export default PackingList;
