import { Box } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useSwipeGesture } from "../../hooks/useSwipeGesture";
import { ReactNode, useEffect } from "react";

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
      {/* Delete background */}
      <Box
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          left: 0,
          bgcolor: "error.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          pr: 2,
        }}
      >
        <DeleteIcon sx={{ color: "common.white" }} />
      </Box>

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          transform: `translateX(${offset}px)`,
          transition: isSwiping ? undefined : "transform 0.2s ease-out",
          bgcolor: "background.paper",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default SwipeableContainer;