# Item Actions System

## Overview
A streamlined system for managing packing list items, optimised for both desktop and mobile interactions. Focuses on the key actions of editing text and deleting items. Builds upon the existing EditableListItem component.

## User Experience

### Desktop Interface
- Checkbox always visible for quick packing
- On hover: reveal edit and delete icons
- Icons fade in/out smoothly
- Clear visual hover states 

### Mobile Interface
- Checkbox always visible on left
- Tap item text to edit
- Swipe left to reveal delete (iOS messages style)
- Swipe bounces back if not committed

## Technical Implementation

### Component Structure
Enhancing the existing EditableListItem component with:
```typescript
// New hook for swipe gestures
interface SwipeState {
  offset: number
  isSwiping: boolean
  velocity: number
}

interface SwipeConfig {
  threshold: number      // px to trigger delete
  bounceThreshold: number // px to snap back
}
```

### Interaction States
1. Normal State
   - Shows checkbox and text
   - Desktop: Hover reveals actions
   - Mobile: Swipeable container

2. Delete State (Mobile)
   - Revealed by left swipe
   - Snaps open/closed at threshold
   - Bounces back if not committed

## Mobile Gesture Implementation
Key behaviours:
- Track touch position
- Calculate swipe velocity
- Snap open/closed based on threshold
- Smooth spring animations
- Cancel on scroll detection

## Animation
Using React Spring for:
- Swipe tracking
- Delete button reveal
- Action button fade in/out

## Accessibility
- Maintain existing keyboard support
- Clear focus indicators
- ARIA labels for all buttons
- Touch targets minimum 44x44px

## Future Considerations
- Add undo for deletions
- Consider drag-to-reorder later
- Potential right-swipe actions
- Batch edit/delete options

## Implementation Plan

### Phase 1: Mobile Swipe-to-Delete
Files to modify:
- `src/hooks/useSwipeGesture.ts` (new)
- `src/components/packing/EditableListItem.tsx` (modify)

Key tasks:
1. Create swipe gesture hook
2. Add swipe container wrapper
3. Implement delete threshold logic
4. Create delete button reveal animation
5. Handle commit/cancel actions
6. Ensure no conflict with scrolling

### Phase 2: Desktop UX Polish
Files to modify:
- `src/components/packing/EditableListItem.tsx`

Key tasks:
1. Enhance hover state transitions
2. Improve icon button animations
3. Better focus states
4. Ensure no conflicts between touch/mouse events

## Development Notes
- Each phase should be completed and tested before moving to next
- Components should be developed mobile-first
- Ensure touch/mouse event handling doesn't conflict
- Test across different devices/browsers
- Document any changes to edit mode behaviour