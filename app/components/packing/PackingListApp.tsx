import type { Remix } from "@remix-run/dom";
import { press } from "@remix-run/events/press";
import { dom } from "@remix-run/events";

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
    const progress = totalCount > 0 ? (packedCount / totalCount) * 100 : 0;

    return (
    <div
      css={{
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "1.5rem",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        "@media (min-width: 640px)": {
          padding: "2rem",
          borderRadius: "20px",
        },
        "@media (prefers-color-scheme: dark)": {
          backgroundColor: "#1e293b",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
        },
      }}
    >
      <h2
        css={{
          marginTop: 0,
          marginBottom: "0.5rem",
          color: "#1e293b",
          fontSize: "1.5rem",
          fontWeight: 700,
          "@media (min-width: 640px)": {
            fontSize: "1.875rem",
          },
          "@media (prefers-color-scheme: dark)": {
            color: "#f1f5f9",
          },
        }}
      >
        My Packing List
      </h2>

      <div css={{ marginBottom: "1.5rem" }}>
        <div
          css={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.5rem",
          }}
        >
          <p
            css={{
              color: "#64748b",
              fontSize: "0.875rem",
              margin: 0,
              fontWeight: 600,
              "@media (prefers-color-scheme: dark)": {
                color: "#94a3b8",
              },
            }}
          >
            Progress
          </p>
          <p
            css={{
              color: "#667eea",
              fontSize: "0.875rem",
              margin: 0,
              fontWeight: 700,
              "@media (prefers-color-scheme: dark)": {
                color: "#818cf8",
              },
            }}
          >
            {packedCount} / {totalCount}
          </p>
        </div>
        <div
          css={{
            width: "100%",
            height: "8px",
            backgroundColor: "#e2e8f0",
            borderRadius: "9999px",
            overflow: "hidden",
            "@media (prefers-color-scheme: dark)": {
              backgroundColor: "#334155",
            },
          }}
        >
          <div
            css={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
              transition: "width 0.5s ease",
              borderRadius: "9999px",
            }}
          />
        </div>
      </div>

      <div
        css={{
          marginBottom: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          "@media (min-width: 640px)": {
            flexDirection: "row",
            gap: "0.75rem",
          },
        }}
      >
        <input
          type="text"
          value={newItemName}
          on={[
            dom.input((e) => {
              newItemName = (e.target as HTMLInputElement).value;
              this.update();
            }),
            dom.keypress((e) => e.key === "Enter" && addItem()),
          ]}
          placeholder="Add new item..."
          css={{
            flex: 1,
            padding: "0.875rem 1rem",
            fontSize: "1rem",
            border: "2px solid #e2e8f0",
            borderRadius: "12px",
            fontFamily: "inherit",
            backgroundColor: "white",
            color: "#1e293b",
            transition: "all 0.2s ease",
            "&:focus": {
              outline: "none",
              borderColor: "#667eea",
              boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
            },
            "@media (prefers-color-scheme: dark)": {
              backgroundColor: "#0f172a",
              color: "#f1f5f9",
              borderColor: "#334155",
              "&:focus": {
                borderColor: "#818cf8",
                boxShadow: "0 0 0 3px rgba(129, 140, 248, 0.1)",
              },
            },
          }}
        />
        <button
          on={[press(() => addItem())]}
          css={{
            padding: "0.875rem 2rem",
            fontSize: "1rem",
            fontWeight: 600,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s ease",
            minHeight: "44px",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
          }}
        >
          ➕ Add Item
        </button>
      </div>

      <div css={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {items.map((item) => (
          <div
            key={item.id}
            css={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem",
              backgroundColor: item.checked ? "#f8fafc" : "white",
              border: "2px solid #e2e8f0",
              borderRadius: "12px",
              transition: "all 0.2s ease",
              minHeight: "60px",
              "&:hover": {
                borderColor: "#cbd5e1",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              },
              "@media (prefers-color-scheme: dark)": {
                backgroundColor: item.checked ? "#0f172a" : "#1e293b",
                borderColor: "#334155",
                "&:hover": {
                  borderColor: "#475569",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                },
              },
            }}
          >
            <input
              type="checkbox"
              checked={item.checked}
              on={[dom.change(() => toggleItem(item.id))]}
              css={{
                width: "20px",
                height: "20px",
                cursor: "pointer",
                accentColor: "#667eea",
                minWidth: "20px",
                "@media (min-width: 640px)": {
                  width: "24px",
                  height: "24px",
                  minWidth: "24px",
                },
              }}
            />
            <span
              css={{
                flex: 1,
                fontSize: "1rem",
                textDecoration: item.checked ? "line-through" : "none",
                color: item.checked ? "#94a3b8" : "#1e293b",
                fontWeight: 500,
                wordBreak: "break-word",
                transition: "all 0.2s ease",
                "@media (min-width: 640px)": {
                  fontSize: "1.125rem",
                },
                "@media (prefers-color-scheme: dark)": {
                  color: item.checked ? "#64748b" : "#f1f5f9",
                },
              }}
            >
              {item.name}
            </span>
            <button
              on={[press(() => deleteItem(item.id))]}
              css={{
                padding: "0.5rem 0.875rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                minHeight: "36px",
                minWidth: "70px",
                "&:hover": {
                  backgroundColor: "#dc2626",
                  transform: "scale(1.05)",
                },
                "&:active": {
                  transform: "scale(0.95)",
                },
                "@media (prefers-color-scheme: dark)": {
                  backgroundColor: "#b91c1c",
                  "&:hover": {
                    backgroundColor: "#991b1b",
                  },
                },
              }}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div
          css={{
            textAlign: "center",
            padding: "3rem 1rem",
            marginTop: "1rem",
          }}
        >
          <div css={{ fontSize: "3rem", marginBottom: "1rem" }}>📦</div>
          <p
            css={{
              color: "#94a3b8",
              fontSize: "1.125rem",
              margin: 0,
              fontWeight: 500,
              "@media (prefers-color-scheme: dark)": {
                color: "#64748b",
              },
            }}
          >
            Your packing list is empty
          </p>
          <p
            css={{
              color: "#cbd5e1",
              fontSize: "0.875rem",
              marginTop: "0.5rem",
              "@media (prefers-color-scheme: dark)": {
                color: "#475569",
              },
            }}
          >
            Add your first item above to get started!
          </p>
        </div>
      )}
    </div>
    );
  };
}
