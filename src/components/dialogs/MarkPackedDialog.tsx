import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface MarkPackedDialogProps {
  open: boolean;
  itemCount: number;
  onClose: () => void;
  onConfirm: () => void;
}

const MarkPackedDialog = ({
  open,
  itemCount,
  onClose,
  onConfirm,
}: MarkPackedDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="mark-packed-dialog-title"
      aria-describedby="mark-packed-dialog-description"
    >
      <DialogTitle id="mark-packed-dialog-title">
        Mark all sub-items as "Packed"?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="mark-packed-dialog-description">
          This will immediately mark all {itemCount} sub-items in this list as packed
          (including any sublists). It cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} autoFocus>
          Mark as Packed
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MarkPackedDialog;