# Quick Add Flow

## Overview
A streamlined process for adding items to a packing list that provides intuitive interactions for both mouse and keyboard users, with a consistent visual language.

## Implementation Status

### Completed
1. State Management
   - Created `useInsertReducer` hook for managing insert state
   - Added `InsertContext` for sharing state
   - Basic actions: FOCUS_ITEM, BLUR_ITEM, START_INSERT, CANCEL_INSERT

2. Core Components
   - Created `InsertButton` component with position and visibility props
   - Added insert functionality to `PackingListContainer`
   - Updated `PackingList` to pass down insert handlers

### Remaining Tasks
1. Editing Integration
   - Add `EditableListItem` when insertion is active
   - Wire up ESC/Enter key handlers
   - Handle focus management during edit

2. Keyboard Support
   - Add Alt+Up/Down keyboard shortcuts
   - Focus handling between items
   - ARIA labels for accessibility

3. Mobile Support
   - Long press gesture
   - Touch-friendly insert buttons
   - Virtual keyboard handling

4. Animation & Polish
   - Smooth transitions for insert buttons
   - Visual feedback for hover/focus states
   - Progress indication during insertion

## Technical Details

### State Management
```typescript
interface InsertState {
  focusedItemId: string | null;
  insertPosition: 'above' | 'below' | null;
}

type InsertAction =
  | { type: 'FOCUS_ITEM'; id: string }
  | { type: 'BLUR_ITEM' }
  | { type: 'START_INSERT'; position: 'above' | 'below' }
  | { type: 'CANCEL_INSERT' };
```

### Component Structure
```typescript
const InsertButton: React.FC<{
  position: 'top' | 'bottom';
  visible: boolean;
  onClick: () => void;
}>;

const PackingListItem: React.FC<{
  // ... existing props
  onInsert: (id: string, position: 'above' | 'below', name: string) => void;
}>;
```

## Next Steps
1. Implement EditableListItem integration
2. Add keyboard shortcuts
3. Enhance mobile support
4. Polish animations and transitions
5. Add comprehensive testing