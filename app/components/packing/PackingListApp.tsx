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
        borderRadius: "2px",
        padding: "2rem 1.5rem",
        border: "1px solid #e5e5e5",
        transition: "all 0.3s ease",
        "@media (min-width: 640px)": {
          padding: "3rem 2.5rem",
        },
        "@media (prefers-color-scheme: dark)": {
          backgroundColor: "#0a0a0a",
          borderColor: "#2a2a2a",
        },
      }}
    >
      <h2
        css={{
          marginTop: 0,
          marginBottom: "3rem",
          color: "#1a1a1a",
          fontSize: "1.25rem",
          fontWeight: 400,
          letterSpacing: "-0.01em",
          "@media (min-width: 640px)": {
            fontSize: "1.5rem",
            marginBottom: "3.5rem",
          },
          "@media (prefers-color-scheme: dark)": {
            color: "#fafafa",
          },
        }}
      >
        Packing List
      </h2>

      <div css={{ marginBottom: "2.5rem" }}>
        <div
          css={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "1rem",
          }}
        >
          <p
            css={{
              color: "#666666",
              fontSize: "0.875rem",
              margin: 0,
              fontWeight: 400,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              "@media (prefers-color-scheme: dark)": {
                color: "#999999",
              },
            }}
          >
            Progress
          </p>
          <p
            css={{
              color: "#1a1a1a",
              fontSize: "1rem",
              margin: 0,
              fontWeight: 400,
              "@media (prefers-color-scheme: dark)": {
                color: "#fafafa",
              },
            }}
          >
            {packedCount} / {totalCount}
          </p>
        </div>
        <div
          css={{
            width: "100%",
            height: "2px",
            backgroundColor: "#e5e5e5",
            overflow: "hidden",
            "@media (prefers-color-scheme: dark)": {
              backgroundColor: "#2a2a2a",
            },
          }}
        >
          <div
            css={{
              height: "100%",
              width: `${progress}%`,
              backgroundColor: "#1a1a1a",
              transition: "width 0.5s ease",
              "@media (prefers-color-scheme: dark)": {
                backgroundColor: "#fafafa",
              },
            }}
          />
        </div>
      </div>

      <div
        css={{
          marginBottom: "3rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          "@media (min-width: 640px)": {
            flexDirection: "row",
            gap: "1rem",
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
          placeholder="Add item"
          css={{
            flex: 1,
            padding: "1rem 1.25rem",
            fontSize: "1rem",
            border: "1px solid #d4d4d4",
            borderRadius: "2px",
            fontFamily: "inherit",
            backgroundColor: "white",
            color: "#1a1a1a",
            transition: "all 0.2s ease",
            "&:focus": {
              outline: "none",
              borderColor: "#1a1a1a",
            },
            "&::placeholder": {
              color: "#999999",
            },
            "@media (prefers-color-scheme: dark)": {
              backgroundColor: "#0a0a0a",
              color: "#fafafa",
              borderColor: "#404040",
              "&:focus": {
                borderColor: "#fafafa",
              },
              "&::placeholder": {
                color: "#666666",
              },
            },
          }}
        />
        <button
          on={[press(() => addItem())]}
          css={{
            padding: "1rem 2rem",
            fontSize: "1rem",
            fontWeight: 400,
            backgroundColor: "#1a1a1a",
            color: "white",
            border: "none",
            borderRadius: "2px",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s ease",
            minHeight: "50px",
            letterSpacing: "0.02em",
            "&:hover": {
              backgroundColor: "#333333",
            },
            "&:active": {
              backgroundColor: "#000000",
            },
            "@media (prefers-color-scheme: dark)": {
              backgroundColor: "#fafafa",
              color: "#1a1a1a",
              "&:hover": {
                backgroundColor: "#e5e5e5",
              },
              "&:active": {
                backgroundColor: "#ffffff",
              },
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
              gap: "1.25rem",
              padding: "1.25rem 1.5rem",
              backgroundColor: "transparent",
              borderBottom: "1px solid #e5e5e5",
              transition: "all 0.2s ease",
              minHeight: "64px",
              "@media (prefers-color-scheme: dark)": {
                borderBottomColor: "#2a2a2a",
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
                accentColor: "#1a1a1a",
                minWidth: "20px",
                "@media (min-width: 640px)": {
                  width: "22px",
                  height: "22px",
                  minWidth: "22px",
                },
                "@media (prefers-color-scheme: dark)": {
                  accentColor: "#fafafa",
                },
              }}
            />
            <span
              css={{
                flex: 1,
                fontSize: "1rem",
                textDecoration: item.checked ? "line-through" : "none",
                color: item.checked ? "#999999" : "#1a1a1a",
                fontWeight: 400,
                wordBreak: "break-word",
                transition: "all 0.2s ease",
                opacity: item.checked ? 0.5 : 1,
                "@media (min-width: 640px)": {
                  fontSize: "1.0625rem",
                },
                "@media (prefers-color-scheme: dark)": {
                  color: item.checked ? "#666666" : "#fafafa",
                },
              }}
            >
              {item.name}
            </span>
            <button
              on={[press(() => deleteItem(item.id))]}
              css={{
                padding: "0.5rem 0.75rem",
                fontSize: "0.8125rem",
                fontWeight: 400,
                backgroundColor: "transparent",
                color: "#999999",
                border: "1px solid #d4d4d4",
                borderRadius: "2px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                minHeight: "32px",
                minWidth: "60px",
                letterSpacing: "0.02em",
                "&:hover": {
                  backgroundColor: "#1a1a1a",
                  color: "white",
                  borderColor: "#1a1a1a",
                },
                "@media (prefers-color-scheme: dark)": {
                  color: "#666666",
                  borderColor: "#404040",
                  "&:hover": {
                    backgroundColor: "#fafafa",
                    color: "#1a1a1a",
                    borderColor: "#fafafa",
                  },
                },
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div
          css={{
            textAlign: "center",
            padding: "4rem 1.5rem",
            marginTop: "2rem",
          }}
        >
          <p
            css={{
              color: "#999999",
              fontSize: "0.9375rem",
              margin: 0,
              fontWeight: 400,
              letterSpacing: "0.01em",
              "@media (prefers-color-scheme: dark)": {
                color: "#666666",
              },
            }}
          >
            No items yet
          </p>
        </div>
      )}
    </div>
    );
  };
}
