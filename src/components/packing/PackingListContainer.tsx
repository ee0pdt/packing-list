import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ListItem } from "../../types/packing";
import PackingList from "./PackingList";

interface PackingListData {
  name: string;
  items: ListItem[];
}

const PackingListContainer = () => {
  const [list, setList] = useState<PackingListData | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Load list from URL
  useEffect(() => {
    const encodedData = location.pathname.slice(6); // Remove /list/ prefix
    if (encodedData) {
      try {
        const decodedData = JSON.parse(atob(encodedData));
        setList(decodedData);
      } catch (error) {
        console.error("Failed to decode list data:", error);
      }
    }
  }, [location]);

  const updateListInUrl = (newList: PackingListData) => {
    const encodedData = btoa(JSON.stringify(newList));
    navigate(`/list/${encodedData}`);
  };

  const handleToggle = (id: string) => {
    if (!list) return;

    const toggleItem = (items: ListItem[]): ListItem[] => {
      return items.map((item) => {
        if (item.id === id) {
          // Toggle if it's a checkable item
          return "checked" in item ? { ...item, checked: !item.checked } : item;
        }
        // Recurse if it's a list
        if ("items" in item) {
          return {
            ...item,
            items: toggleItem(item.items),
          };
        }
        return item;
      });
    };

    const updatedList = {
      ...list,
      items: toggleItem(list.items),
    };

    setList(updatedList);
    updateListInUrl(updatedList);
  };

  const handleMarkAllPacked = (id: string, markAsPacked: boolean) => {
    if (!list) return;

    const markSubItems = (items: ListItem[]): ListItem[] => {
      return items.map((item) => {
        if ("items" in item) {
          return {
            ...item,
            items: markSubItems(item.items),
          };
        }
        return {
          ...item,
          checked: markAsPacked,
        };
      });
    };

    const markAll = (items: ListItem[]): ListItem[] => {
      return items.map((item) => {
        if (item.id === id && "items" in item) {
          return {
            ...item,
            items: markSubItems(item.items),
          };
        }
        if ("items" in item) {
          return {
            ...item,
            items: markAll(item.items),
          };
        }
        return item;
      });
    };

    const updatedList = {
      ...list,
      items: markAll(list.items),
    };

    setList(updatedList);
    updateListInUrl(updatedList);
  };

  if (!list) {
    return (
      <Box p={2}>
        <Typography>Loading list...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" component="h1" sx={{ p: 2 }}>
        {list.name}
      </Typography>
      <PackingList
        list={{ id: "root", name: list.name, items: list.items }}
        onToggle={handleToggle}
        onMarkAllPacked={handleMarkAllPacked}
      />
    </Box>
  );
};

export default PackingListContainer;
