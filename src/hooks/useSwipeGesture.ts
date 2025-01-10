import { useRef, useState } from 'react';

interface SwipeState {
  offset: number;
  isSwiping: boolean;
}

interface SwipeConfig {
  threshold: number;
  bounceThreshold: number;
}

const DEFAULT_CONFIG: SwipeConfig = {
  threshold: -80,        // Full swipe to delete
  bounceThreshold: -40,  // Partial swipe
};

interface SwipeGesture {
  offset: number;
  isSwiping: boolean;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  reset: () => void;
}

export function useSwipeGesture(
  onDelete: () => void,
  config: SwipeConfig = DEFAULT_CONFIG
): SwipeGesture {
  const [state, setState] = useState<SwipeState>({
    offset: 0,
    isSwiping: false,
  });

  const touchStartX = useRef<number>(0);
  const currentOffset = useRef<number>(0);
  const lastTime = useRef<number>(0);
  const lastOffset = useRef<number>(0);
  const velocity = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    lastTime.current = Date.now();
    lastOffset.current = currentOffset.current;
    setState(prev => ({ ...prev, isSwiping: true }));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!state.isSwiping) return;

    const touchX = e.touches[0].clientX;
    const diff = touchX - touchStartX.current;
    const newOffset = Math.min(0, Math.max(config.threshold, diff));

    // Calculate velocity
    const now = Date.now();
    const deltaTime = now - lastTime.current;
    if (deltaTime > 0) {
      const deltaOffset = newOffset - lastOffset.current;
      velocity.current = deltaOffset / deltaTime;
    }

    currentOffset.current = newOffset;
    lastTime.current = now;
    lastOffset.current = newOffset;

    setState(prev => ({ ...prev, offset: newOffset }));
  };

  const handleTouchEnd = () => {
    const finalOffset = currentOffset.current;
    const isQuickSwipe = Math.abs(velocity.current) > 0.5;

    if (finalOffset <= config.threshold || (isQuickSwipe && finalOffset <= config.bounceThreshold)) {
      onDelete();
    }

    // Reset state
    setState({ offset: 0, isSwiping: false });
    currentOffset.current = 0;
    velocity.current = 0;
  };

  const reset = () => {
    setState({ offset: 0, isSwiping: false });
    currentOffset.current = 0;
    velocity.current = 0;
    touchStartX.current = 0;
    lastTime.current = 0;
    lastOffset.current = 0;
  };

  return {
    offset: state.offset,
    isSwiping: state.isSwiping,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    reset
  };
}
