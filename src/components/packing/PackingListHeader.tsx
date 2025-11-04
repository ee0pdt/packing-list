import { useState } from 'react';
import { useTheme } from '@mui/material';
import { IconButton } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { List } from '../../types/packing';
import EditableListHeader from './EditableListHeader'; // Changed to default import
import { PackingListMenu } from './PackingListMenu';

interface PackingListHeaderProps {
  list: List;
  isExpanded: boolean;
  progress: number;
  packedCount: number;
  totalCount: number;
  onExpand: () => void;
  onEdit: (name: string) => void;
  onMarkAll: (e: React.MouseEvent) => void;
  onAddItem?: () => void;
  onAddSublist?: () => void;
  onDelete?: () => void;
}

export const PackingListHeader = ({
  list,
  isExpanded,
  progress,
  packedCount,
  totalCount,
  onExpand,
  onEdit,
  onMarkAll,
  onAddItem,
  onAddSublist,
  onDelete,
}: PackingListHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const theme = useTheme();

  return (
    <div style={{
      backgroundColor: !isExpanded
        ? progress === 100
          ? theme.palette.success.light
          : theme.palette.info.light
        : theme.palette.background.paper,
    }}>
      <EditableListHeader
        list={{...list, name: `${list.name} (${packedCount}/${totalCount})`}}
        onSave={(name) => {
          onEdit(name);
          setIsEditing(false);
        }}
        isEditing={isEditing}
        onClick={onExpand}
        suffix={
          <>
            <IconButton onClick={onExpand} size="small">
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
            <PackingListMenu
              progress={progress}
              onMarkAll={onMarkAll}
              onAdd={onAddItem}
              onAddSublist={onAddSublist}
              onEdit={() => setIsEditing(true)}
              onDelete={onDelete}
              disabled={false}
            />
          </>
        }
      />
    </div>
  );
};