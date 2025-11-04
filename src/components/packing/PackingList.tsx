import { useState, useMemo } from "react";
import {
  List as MuiList,
  Paper,
  Collapse,
  LinearProgress,
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
import { morphIn, jellyBounce } from "../../styles/animations";

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
  editingItemId,
  level = 0,
}: PackingListProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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

  const expandCollapseButton = (
    <IconButton
      onClick={handleExpand}
      size="small"
      sx={{
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
        '&:hover': {
          transform: isExpanded ? 'rotate(0deg) scale(1.2)' : 'rotate(180deg) scale(1.2)',
        }
      }}
    >
      {isExpanded ? <ExpandLess /> : <ExpandMore />}
    </IconButton>
  );

  return (
    <>
      <Paper
        elevation={2}
        sx={{
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(25px) saturate(180%) brightness(120%)',
          WebkitBackdropFilter: 'blur(25px) saturate(180%) brightness(120%)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: `
            0 8px 32px 0 rgba(31, 38, 135, 0.15),
            inset 0 1px 1px 0 rgba(255, 255, 255, 0.4)
          `,
          pl: 2,
          mt: 2,
          overflow: "hidden",
          borderRadius: "20px",
          position: 'relative',
          animation: `${morphIn} 0.6s ease-out`,
          marginLeft: `${level * 16}px`,
          transition: 'all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(30px) saturate(190%) brightness(125%)',
            WebkitBackdropFilter: 'blur(30px) saturate(190%) brightness(125%)',
            border: '1px solid rgba(255, 255, 255, 0.35)',
            transform: 'translateY(-2px)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: !isExpanded
              ? progress === 100
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(110, 231, 183, 0.2) 100%)'
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(147, 197, 253, 0.2) 100%)'
              : 'transparent',
            pointerEvents: 'none',
            transition: 'all 0.6s ease',
            opacity: isExpanded ? 0 : 1,
          },
        }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: 1,
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
              position: 'relative',
              zIndex: 1,
              "& .MuiLinearProgress-bar": {
                animation: progress > 0 ? `${jellyBounce} 0.6s ease` : 'none',
              },
            }}
          />
        )}

        <Collapse
          in={isExpanded}
          timeout={{
            enter: 600,
            exit: 400,
          }}
          unmountOnExit
          sx={{
            '& .MuiCollapse-wrapper': {
              transition: 'all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)',
            }
          }}
        >
          <MuiList
            disablePadding
            sx={{
              position: 'relative',
              zIndex: 1,
              padding: '8px',
            }}
          >
            {list.items.map((item) =>
              isItem(item) ? (
                <PackingListItem
                  key={item.id}
                  item={item}
                  onToggle={handleItemToggle}
                  onDelete={onDeleteItem}
                  onEdit={onEditItem}
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