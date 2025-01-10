import { useState, useMemo } from "react";
import {
  List as MuiList,
  Paper,
  Collapse,
  LinearProgress,
  useTheme,
  IconButton,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  List,
  ListItem as PackingListItemType,
  Item,
} from "../../types/packing";
import PackingListItem from "./PackingListItem";
import EditableListHeader from "./EditableListHeader";
import MarkPackedDialog from "../dialogs/MarkPackedDialog";
import { PackingListMenu } from "./PackingListMenu";

interface PackingListProps {
  list: List;
  onToggle: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onEditItem: (id: string, newName: string) => void;
  onEditList: (id: string, newName: string) => void;
  onMarkAllPacked?: (id: string, markAsPacked: boolean) => void;
  onAddItem?: (listId: string) => void;
  onAddSublist?: (listId: string) => void;
  onDeleteList?: (id: string) => void;
  onInsertItem?: (id: string, position: "above" | "below", name: string) => void;
  editingItemId?: string | null;
  level?: number;
}

const isItem = (item: PackingListItemType): item is Item => {
  return "checked" in item;
};

const PackingList = ({
  list,
  onToggle,
  onDeleteItem,
  onEditItem,
  onEditList,
  onMarkAllPacked,
  onAddItem,
  onAddSublist,
  onDeleteList,
  onInsertItem,
  editingItemId,
  level = 0,
}: PackingListProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const theme = useTheme();

  const isPackedMemo = useMemo(() => {
    const checkPacked = (item: PackingListItemType): boolean => {
      if (isItem(item)) {
        return item.checked;
      }
      return item.items.every((subItem) => checkPacked(subItem));
    };
    return checkPacked;
  }, []);

  const { packedCount, totalCount, progress, allSubItems } = useMemo(() => {
    let packed = 0;
    let total = 0;
    let allItems = 0;

    const countItems = (items: PackingListItemType[]) => {
      items.forEach((item) => {
        if (isItem(item)) {
          total++;
          allItems++;
          if (item.checked) packed++;
        } else {
          total++;
          if (item.items.every((subItem) => isPackedMemo(subItem))) packed++;
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
      const willBePacked = progress !== 100;
      onMarkAllPacked(list.id, willBePacked);
      setIsExpanded(!willBePacked);
    }
    setDialogOpen(false);
  };

  const handleAddItem = () => {
    if (onAddItem) {
      onAddItem(list.id);
    }
  };

  const handleAddSublist = () => {
    if (onAddSublist) {
      onAddSublist(list.id);
    }
  };

  const handleDeleteList = () => {
    if (onDeleteList && list.id !== "root") {
      onDeleteList(list.id);
    }
  };

  const handleEditList = (newName: string) => {
    onEditList(list.id, newName);
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleItemToggle = (id: string) => {
    onToggle(id);
    const itemToToggle = list.items.find(
      (item) => isItem(item) && item.id === id,
    );
    if (itemToToggle && isItem(itemToToggle)) {
      const willBePacked = !itemToToggle.checked;
      if (willBePacked && packedCount === totalCount - 1) {
        setIsExpanded(false);
      }
      if (!willBePacked && !isExpanded) {
        setIsExpanded(true);
      }
    }
  };

  const handleInsertItem = (id: string, position: "above" | "below", name: string) => {
    if (onInsertItem) {
      onInsertItem(id, position, name);
    }
  };

  const expandCollapseButton = (
    <IconButton onClick={handleExpand} size="small">
      {isExpanded ? <ExpandLess /> : <ExpandMore />}
    </IconButton>
  );

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
        <div
          style={{
            backgroundColor: !isExpanded
              ? progress === 100
                ? theme.palette.success.light
                : theme.palette.info.light
              : theme.palette.background.paper,
          }}
        >
          <EditableListHeader
            list={{...list, name: `${list.name} (${packedCount}/${totalCount})`}}
            onSave={handleEditList}
            isEditing={isEditing}
            onClick={handleExpand}
            suffix={
              <>
                {expandCollapseButton}
                <PackingListMenu
                  progress={progress}
                  onMarkAll={handleMarkAllClick}
                  onAdd={onAddItem ? handleAddItem : undefined}
                  onAddSublist={onAddSublist ? handleAddSublist : undefined}
                  onEdit={handleStartEdit}
                  onDelete={list.id !== "root" ? handleDeleteList : undefined}
                  disabled={!onMarkAllPacked}
                />
              </>
            }
          />
        </div>

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
                  onToggle={handleItemToggle}
                  onDelete={onDeleteItem}
                  onEdit={onEditItem}
                  onInsert={handleInsertItem}
                  isEditing={item.id === editingItemId}
                />
              ) : (
                <PackingList
                  key={item.id}
                  list={item}
                  onToggle={onToggle}
                  onDeleteItem={onDeleteItem}
                  onEditItem={onEditItem}
                  onEditList={onEditList}
                  onMarkAllPacked={onMarkAllPacked}
                  onAddItem={onAddItem}
                  onAddSublist={onAddSublist}
                  onDeleteList={onDeleteList}
                  onInsertItem={onInsertItem}
                  editingItemId={editingItemId}
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