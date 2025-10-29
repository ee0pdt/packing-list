import type { Remix } from "@remix-run/dom";

interface ListItem {
  id: string;
  name: string;
  checked: boolean;
}

export function PackingListApp(this: Remix.Handle) {
  let items: ListItem[] = [
    { id: "1", name: "Passport", checked: false },
    { id: "2", name: "Phone charger", checked: false },
    { id: "3", name: "Toothbrush", checked: false },
  ];
  let newItemName = "";

  const addItem = () => {
    if (newItemName.trim()) {
      const newItem: ListItem = {
        id: Date.now().toString(),
        name: newItemName.trim(),
        checked: false,
      };
      items = [...items, newItem];
      newItemName = "";
      this.update();
    }
  };

  const toggleItem = (id: string) => {
    items = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    this.update();
  };

  const deleteItem = (id: string) => {
    items = items.filter((item) => item.id !== id);
    this.update();
  };

  return () => {
    const packedCount = items.filter((item) => item.checked).length;
    const totalCount = items.length;

    return (
    <div
      css={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "2rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2 css={{ marginTop: 0, color: "#333" }}>My Packing List</h2>

      <div css={{ marginBottom: "2rem" }}>
        <p css={{ color: "#666", fontSize: "1.1rem" }}>
          Packed: {packedCount} / {totalCount}
        </p>
      </div>

      <div css={{ marginBottom: "1.5rem", display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={newItemName}
          onInput={(e) => {
            newItemName = (e.target as HTMLInputElement).value;
            this.update();
          }}
          onKeyPress={(e) => e.key === "Enter" && addItem()}
          placeholder="Add new item..."
          css={{
            flex: 1,
            padding: "0.75rem",
            fontSize: "1rem",
            border: "2px solid #ddd",
            borderRadius: "4px",
            fontFamily: "inherit",
            "&:focus": {
              outline: "none",
              borderColor: "#1976d2",
            },
          }}
        />
        <button
          onClick={addItem}
          css={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontFamily: "inherit",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          Add
        </button>
      </div>

      <div css={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {items.map((item) => (
          <div
            key={item.id}
            css={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem",
              backgroundColor: item.checked ? "#f0f0f0" : "white",
              border: "1px solid #ddd",
              borderRadius: "4px",
              transition: "all 0.2s",
            }}
          >
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleItem(item.id)}
              css={{
                width: "20px",
                height: "20px",
                cursor: "pointer",
              }}
            />
            <span
              css={{
                flex: 1,
                fontSize: "1.1rem",
                textDecoration: item.checked ? "line-through" : "none",
                color: item.checked ? "#999" : "#333",
              }}
            >
              {item.name}
            </span>
            <button
              onClick={() => deleteItem(item.id)}
              css={{
                padding: "0.5rem 0.75rem",
                fontSize: "0.9rem",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#d32f2f",
                },
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p css={{ textAlign: "center", color: "#999", marginTop: "2rem" }}>
          No items yet. Add your first item above!
        </p>
      )}
    </div>
    );
  };
}
