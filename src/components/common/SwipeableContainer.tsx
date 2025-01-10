import { Box } from "@mui/material";
import { useSwipeGesture } from "../../hooks/useSwipeGesture";
import { ReactNode, useEffect } from "react";
import { Trash2 } from "lucide-react";

interface SwipeableContainerProps {
  children: ReactNode;
  onDelete: () => void;
  disabled?: boolean;
}

const SwipeableContainer = ({
  children,
  onDelete,
  disabled = false,
}: SwipeableContainerProps) => {
  const {
    offset,
    isSwiping,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    reset,
  } = useSwipeGesture(onDelete);

  // Reset state when disabled changes
  useEffect(() => {
    if (disabled) {
      reset();
    }
  }, [disabled, reset]);

  // Only enable swipe on touch devices
  if (
    typeof window !== "undefined" &&
    !("ontouchstart" in window) &&
    !navigator.maxTouchPoints
  ) {
    return <>{children}</>;
  }

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        touchAction: disabled ? "auto" : "pan-y pinch-zoom",
      }}
      onTouchStart={disabled ? undefined : handleTouchStart}
      onTouchMove={disabled ? undefined : handleTouchMove}
      onTouchEnd={disabled ? undefined : handleTouchEnd}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          transform: `translateX(${offset}px)`,
          transition: isSwiping ? undefined : "transform 0.2s ease-out",
        }}
      >
        {children}
      </Box>
      <Box
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          pr: 2,
          color: "error.main",
          opacity: Math.min(1, Math.abs(offset) / 40),
        }}
      >
        <Trash2 size={24} />
      </Box>
    </Box>
  );
};

export default SwipeableContainer;