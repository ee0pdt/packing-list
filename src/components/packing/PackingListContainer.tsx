import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ListItem } from "../../types/packing";
import PackingList from "./PackingList";
import { useEditMode } from "../../contexts/EditModeContext";

interface PackingListData {
  name: string;
  items: ListItem[];
}

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const PackingListContainer = () => {
  const [list, setList] = useState<PackingListData | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { setEditMode } = useEditMode();
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  useEffect(() => {
    const encodedData = location.pathname.slice(6);
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

  const handleAddItem = (listId: string) => {
    if (!list) return;

    const newItemId = generateId();

    const addNewItem = (items: ListItem[]): ListItem[] => {
      return items.map(item => {
        if (item.id === listId && "items" in item) {
          return {
            ...item,
            items: [
              ...item.items,
              {
                id: newItemId,
                name: "New Item",
                checked: false
              }
            ]
          };
        }
        if ("items" in item) {
          return {
            ...item,
            items: addNewItem(item.items)
          };
        }
        return item;
      });
    };

    // Handle adding to root list
    const updatedItems = listId === "root" 
      ? [
          ...list.items,
          {
            id: newItemId,
            name: "New Item",
            checked: false
          }
        ]
      : addNewItem(list.items);

    const updatedList = {
      ...list,
      items: updatedItems,
    };

    setList(updatedList);
    updateListInUrl(updatedList);
    
    // Enable edit mode for the new item
    setEditMode(true);
    setEditingItemId(newItemId);
  };

  const handleToggle = (id: string) => {
    if (!list) return;

    const toggleItem = (items: ListItem[]): ListItem[] => {
      return items.map((item) => {
        if (item.id === id) {
          return "checked" in item ? { ...item, checked: !item.checked } : item;
        }
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

  const handleDeleteItem = (id: string) => {
    if (!list) return;

    const deleteItem = (items: ListItem[]): ListItem[] => {
      const filteredItems = items.filter(item => item.id !== id);
      return filteredItems.map(item => {
        if ("items" in item) {
          return {
            ...item,
            items: deleteItem(item.items)
          };
        }
        return item;
      });
    };

    const updatedList = {
      ...list,
      items: deleteItem(list.items),
    };

    setList(updatedList);
    updateListInUrl(updatedList);
  };

  const handleEditItem = (id: string, newName: string) => {
    if (!list) return;

    const editItem = (items: ListItem[]): ListItem[] => {
      return items.map(item => {
        if (item.id === id) {
          return {
            ...item,
            name: newName
          };
        }
        if ("items" in item) {
          return {
            ...item,
            items: editItem(item.items)
          };
        }
        return item;
      });
    };

    const updatedList = {
      ...list,
      items: editItem(list.items),
    };

    setList(updatedList);
    updateListInUrl(updatedList);
    setEditingItemId(null);  // Clear editing state after save
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
    <Box p={2}>
      <PackingList
        list={{ id: "root", name: list.name, items: list.items }}
        onToggle={handleToggle}
        onDeleteItem={handleDeleteItem}
        onEditItem={handleEditItem}
        onMarkAllPacked={handleMarkAllPacked}
        onAddItem={handleAddItem}
        editingItemId={editingItemId}
      />
    </Box>
  );
};

export default PackingListContainer;