# Item Actions System

## Overview
A streamlined system for managing packing list items, optimised for both desktop and mobile interactions. Focuses on adding intuitive touch gestures while maintaining current checkbox animations.

## User Experience

### Desktop Interface
- Checkbox always visible on the right for quick packing
- Edit button appears on hover
- Delete button appears on hover
- Keep existing checked animation

### Mobile Interface
- Checkbox always visible on the right
- Swipe left to delete
- Long press to edit name
- Keep existing checked animation

## Technical Implementation

### Component Structure
Enhancing existing PackingListItem component:
```typescript
interface PackingListItemProps {
  item: Item;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newName: string) => void;
}
```

### Interaction States
1. Normal State
   - Shows checkbox 
   - Desktop: Shows hover actions
   - Mobile: Swipeable container

2. Edit State (Triggered by long press)
   - Inline text field
   - Save on enter/blur
   - Cancel on escape

3. Delete State (Mobile)
   - Revealed by left swipe
   - Snaps open/closed at threshold
   - Delete confirmation

## Implementation Plan

### Phase 1: Core Swipe Setup
Files to modify:
- Keep `src/hooks/useSwipeGesture.ts` 
- Update `src/components/packing/PackingListItem.tsx`

Key tasks:
1. Add swipe container to PackingListItem
2. Implement delete button reveal
3. Handle delete confirmation
4. Maintain existing checkbox functionality

### Phase 2: Desktop Polish
Files to modify:
- `src/components/packing/PackingListItem.tsx`

Key tasks:
1. Add hover state for desktop
2. Enhance button animations
3. Ensure no conflicts between touch/mouse events

### Phase 3: Edit Mode
Files to modify:
- `src/components/packing/PackingListItem.tsx`
- Add new `src/hooks/useLongPress.ts`

Key tasks:
1. Implement long press detection
2. Add inline editing UI
3. Handle save/cancel actions
4. Keyboard navigation support

## Development Notes
- Keep existing strikethrough animations
- Mobile-first development approach
- Test touch/mouse conflicts
- Keep delete confirmations
- Maintain accessibility