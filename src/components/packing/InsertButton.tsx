import { IconButton, Slide, Tooltip, styled } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface InsertButtonProps {
  position: "top" | "bottom";
  visible: boolean;
  onClick: () => void;
}

const StyledIconButton = styled(IconButton)<{ position: "top" | "bottom" }>(
  ({ position }) => ({
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 1,
    ...(position === "top" ? { top: -20 } : { bottom: -20 }),
  })
);

export default function InsertButton({
  position,
  visible,
  onClick,
}: InsertButtonProps) {
  return (
    <Slide direction={position === "top" ? "down" : "up"} in={visible}>
      <StyledIconButton
        position={position}
        size="small"
        onClick={onClick}
        color="primary"
      >
        <Tooltip title={`Add ${position === "top" ? "above" : "below"}`}>
          <AddIcon fontSize="small" />
        </Tooltip>
      </StyledIconButton>
    </Slide>
  );
}