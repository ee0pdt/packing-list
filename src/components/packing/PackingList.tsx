import { useState } from "react";
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

interface PackingListProps {
  list: List;
  onToggle: (id: string) => void;
  onMarkAllPacked?: (id: string, markAsPacked: boolean) => void;
  level?: number;
}

const PackingList = ({
  list,
  onToggle,
  onMarkAllPacked,
  level = 0,
}: PackingListProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const theme = useTheme();

  // Calculate progress
  const checkedCount = list.items.filter((item) =>
    "checked" in item ? item.checked : false,
  ).length;
  const progress = (checkedCount / list.items.length) * 100;

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMarkAll = () => {
    if (onMarkAllPacked) {
      // Mark as packed if not all items are currently checked
      onMarkAllPacked(list.id, checkedCount < list.items.length);
    }
  };

  const isItem = (item: PackingListItemType): item is Item => {
    return "checked" in item;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        pl: 2,
        m: level > 0 ? 0 : 2,
        mt: level > 0 ? 0 : 2,
        overflow: "hidden",
        borderRadius: "8px 0 0 8px",
        backgroundColor:
          progress === 100
            ? theme.palette.success.dark
            : theme.palette.info.dark,
      }}
    >
      <ListItem
        disablePadding
        sx={{
          backgroundColor: (theme) =>
            progress === 100 && !isExpanded
              ? theme.palette.success.light
              : theme.palette.background.paper,
        }}
      >
        <ListItemButton onClick={handleExpand}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </ListItemIcon>
          <Typography variant="listItem">
            {list.name} ({checkedCount}/{list.items.length})
          </Typography>
          <IconButton
            edge="end"
            onClick={(e) => {
              e.stopPropagation();
              handleMarkAll();
            }}
          >
            <MoreVert />
          </IconButton>
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
              <PackingListItem key={item.id} item={item} onToggle={onToggle} />
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
  );
};

export default PackingList;
