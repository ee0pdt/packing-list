# Quick Add Flow

## Overview
A streamlined process for adding items to a packing list that provides intuitive interactions for both mouse and keyboard users, with a consistent visual language.

## User Experience

### Mouse Flow
1. Hover over any list item
2. Insert buttons appear above and below the item
3. Click desired insert point (above/below)
4. Type item name and:
   - Press Enter to save
   - Press Escape to cancel
   - Click away to cancel

### Keyboard Flow
1. Navigate items using Tab key
2. When an item is focused:
   - Insert buttons appear above and below the item
   - Alt+Up to insert above current item
   - Alt+Down to insert below current item
3. When inserting:
   - Input field appears at insertion point
   - Press Enter to save
   - Press Escape to cancel

### Mobile Flow
1. Long press on an item to reveal insert options
2. Tap insert point (above/below)
3. Virtual keyboard appears with input field
4. Tap done/return to save
5. Tap outside to cancel

## Technical Implementation

### State Management
```typescript
interface InsertState {
  focusedItemId: string | null;
  insertPosition: 'above' | 'below' | null;
  isInserting: boolean;
  inputValue: string;
}

type InsertAction =
  | { type: 'FOCUS_ITEM'; id: string }
  | { type: 'BLUR_ITEM' }
  | { type: 'START_INSERT'; position: 'above' | 'below' }
  | { type: 'CANCEL_INSERT' }
  | { type: 'SAVE_ITEM'; value: string }
  | { type: 'UPDATE_VALUE'; value: string };
```

### Component Structure
```typescript
const ListItemWithInsert: React.FC<{
  id: string;
  name: string;
  onInsertAbove: (name: string) => void;
  onInsertBelow: (name: string) => void;
}>;

const InsertButton: React.FC<{
  position: 'top' | 'bottom';
  onClick: () => void;
  label: string;
}>;
```

### Key Behaviours
1. Focus Management
   - Clear visual focus indicators
   - Keyboard navigation between items
   - Auto-focus input when inserting

2. Keyboard Support
   - Tab: Navigate between items
   - Alt+Up/Down: Quick insert shortcuts
   - Enter: Save new item
   - Escape: Cancel insertion

3. Touch Considerations
   - Large enough touch targets
   - Clear visual feedback
   - Handle virtual keyboard properly

## Accessibility
- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader announcements for:
  * Focus changes
  * Insert options
  * Success/failure of insertions
- High contrast visual indicators

## Animation
- Smooth reveal/hide of insert buttons
- Subtle transitions for input field
- Visual feedback for successful insertion

## Future Enhancements
- Quick add mode for multiple items
- Template suggestions
- Recent items list
- Paste multiple lines support