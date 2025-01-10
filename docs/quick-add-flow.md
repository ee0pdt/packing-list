# Quick Add Flow

## Overview
A streamlined process for adding multiple items to a packing list quickly and efficiently.

## User Experience

### Desktop Flow
1. Click "Add Item" button
2. Type item name and press Enter
3. Previous item is saved and new input field appears immediately
4. Continue adding items until either:
   - Press Enter on empty field (ends flow)
   - Press Escape (ends flow)
   - Click away from input (ends flow)

### Mobile Flow
1. Tap "Add Item" button
2. Type item name and tap save/done on keyboard
3. Previous item is saved and new input field appears with keyboard still active
4. Continue adding items until either:
   - Tap save on empty field (ends flow)
   - Tap away from input (ends flow)

## Technical Implementation

### State Management
```typescript
interface QuickAddState {
  isAdding: boolean;
  currentValue: string;
  focusedItemId: string | null;
}

type QuickAddAction =
  | { type: 'START_ADDING' }
  | { type: 'SAVE_ITEM'; value: string }
  | { type: 'END_ADDING' }
  | { type: 'UPDATE_VALUE'; value: string };
```

### Component Structure
```typescript
const QuickAdd: React.FC<{
  onSave: (name: string) => void;
  onComplete: () => void;
}>;

const QuickAddTrigger: React.FC<{
  onStart: () => void;
}>;
```

### Key Behaviours
1. Input Focus Management
   - Auto-focus new input field
   - Maintain focus through multiple adds
   - Clear focus when flow ends

2. Keyboard Navigation
   - Enter: Save current and start new
   - Escape: Cancel current and end flow
   - Empty Enter: End flow

3. Mobile Considerations
   - Maintain keyboard visibility
   - Handle soft keyboard events
   - Touch-friendly save/cancel actions

## Accessibility
- Clear ARIA labels
- Keyboard navigation support
- Visual focus indicators
- Screen reader announcements for saved items

## Animation
Subtle animations for:
- New input field appearance
- Saved item confirmation
- Flow completion

## Future Enhancements
- Batch undo for quick adds
- Template selection for common items
- Paste multiple lines support