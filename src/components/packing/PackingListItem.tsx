import {
  ListItem,
  ListItemButton,
  ListItemText,
  Checkbox,
  Typography,
} from "@mui/material";
import { Item } from "../../types/packing";

interface PackingListItemProps {
  item: Item;
  onToggle: (id: string) => void;
}

const PackingListItem = ({ item, onToggle }: PackingListItemProps) => {
  const handleClick = () => {
    onToggle(item.id);
  };

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={handleClick}>
        <ListItemText
          primary={
            <Typography
              variant="body1"
              sx={{
                textDecoration: item.checked ? "line-through" : "none",
                textDecorationThickness: "0.2rem",
                textDecorationColor: "rgba(0,20,0,0.5)",
              }}
            >
              {item.name}
            </Typography>
          }
        />
        <Checkbox
          edge="end"
          checked={item.checked}
          disableRipple
          color={item.checked ? "success" : "info"}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default PackingListItem;