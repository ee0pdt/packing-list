# Item Actions System

## Overview
A streamlined system for managing packing list items, optimised for both desktop and mobile interactions. Uses swipe gestures for delete on mobile while leveraging existing EditableListItem for text editing.

## User Experience

### Desktop Interface
- Checkbox always visible on the right for quick packing
- Edit and delete buttons appear on hover
- Click edit button to edit text (using EditableListItem)
- Keep existing checked animation

### Mobile Interface
- Checkbox always visible on the right
- Swipe left to delete
- Tap text to edit (using EditableListItem)
- Keep existing checked animation

## Technical Implementation

### Component Structure
Enhancing existing PackingListItem component while keeping EditableListItem for text editing:
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

2. Edit State 
   - Switch to EditableListItem
   - Save/cancel using existing functionality
   - Triggered by:
     - Desktop: Click edit button
     - Mobile: Tap text

3. Delete State (Mobile)
   - Revealed by left swipe
   - Snaps open/closed at threshold
   - Delete confirmation

## Implementation Progress

### ✅ Phase 1: Core Swipe Setup
Completed:
- Created `src/hooks/useSwipeGesture.ts` with:
  - Touch position tracking
  - Swipe velocity calculation
  - Configurable thresholds
  - Desktop/mobile detection

### Phase 2: PackingListItem Integration
Files to modify:
- `src/components/packing/PackingListItem.tsx`

Key tasks:
1. Add swipe container with useSwipeGesture
2. Implement delete button reveal
3. Handle delete confirmation
4. Ensure swipe doesn't conflict with text tap
5. Handle device-specific interactions

### Phase 3: Desktop Polish
Files to modify:
- `src/components/packing/PackingListItem.tsx`

Key tasks:
1. Polish hover states
2. Button animations
3. Test touch/mouse conflicts

## Development Notes
- Keep existing strikethrough animations
- Mobile-first development approach
- Test touch/mouse conflicts
- Keep delete confirmations
- Maintain accessibility 
- Smooth transitions between normal/edit states