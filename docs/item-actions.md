# Item Actions System

## Overview
A streamlined system for managing packing list items, optimised for both desktop and mobile interactions. Uses swipe gestures for delete on mobile while leveraging existing EditableListItem for text editing.

## User Experience

### Desktop Interface
- Checkbox always visible on the right for quick packing
- Edit and delete buttons appear on hover (Phase 3)
- Click edit button to edit text (using EditableListItem)
- Keep existing checked animation
- Confirmation dialog for delete actions

### Mobile Interface
- Checkbox always visible on the right
- Swipe left to delete (immediately, no confirmation needed)
- Tap text to edit (using EditableListItem)
- Keep existing checked animation
- Swipe threshold with visual feedback

## Technical Implementation

### Component Structure
Using existing PackingListItem component with EditableListItem for text editing and new SwipeableContainer for mobile delete:
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
   - Desktop: Shows hover actions (coming in Phase 3)
   - Mobile: Swipeable container with red delete background

2. Edit State 
   - Switch to EditableListItem
   - Save/cancel using existing functionality
   - Triggered by:
     - Desktop: Click edit button (coming in Phase 3)
     - Mobile: Tap text

3. Delete State (Mobile)
   - Revealed by left swipe with red background
   - White delete icon
   - No confirmation needed
   - Snaps back if not swiped far enough

## Implementation Progress

### ✅ Phase 1: Core Swipe Setup
Completed:
- Created `src/hooks/useSwipeGesture.ts` with:
  - Touch position tracking
  - Swipe velocity calculation
  - Configurable thresholds
  - Desktop/mobile detection

### ✅ Phase 2: PackingListItem Integration
Completed:
- Created SwipeableContainer component
- Integrated swipe-to-delete in PackingListItem
- Added device-specific delete behaviour (direct on mobile, confirm on desktop)
- Visual feedback with red background and white icon
- Maintained existing animations

### Phase 3: Desktop Polish
Files to modify:
- `src/components/packing/PackingListItem.tsx`

Key tasks:
1. Add hover actions to desktop view
2. Create edit/delete button animations
3. Test all device interaction modes

## Development Notes
- Keep existing strikethrough animations ✅
- Mobile-first development approach ✅
- Test touch/mouse conflicts ✅
- Keep delete confirmations on desktop only ✅
- Maintain accessibility 
- Smooth transitions between normal/edit states