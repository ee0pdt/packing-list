import type { Remix } from "@remix-run/dom";
import { press } from "@remix-run/events/press";
import { dom } from "@remix-run/events";

interface ListItem {
  id: string;
  name: string;
  checked: boolean;
}

const STORAGE_KEY = "packapp-items";

// Load items from localStorage
function loadItems(): ListItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load items from localStorage:", error);
  }
  // Default items if nothing in storage
  return [
    { id: "1", name: "Passport", checked: false },
    { id: "2", name: "Phone charger", checked: false },
    { id: "3", name: "Toothbrush", checked: false },
  ];
}

// Save items to localStorage
function saveItems(items: ListItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save items to localStorage:", error);
  }
}

export function PackingListApp(this: Remix.Handle) {
  let items: ListItem[] = loadItems();
  let newItemName = "";
  let swipedItemId: string | null = null;
  let touchStartX = 0;
  let touchCurrentX = 0;
  let isSwiping = false;
  let justAddedItemId: string | null = null;

  const handleTouchStart = (e: TouchEvent, itemId: string) => {
    touchStartX = e.touches[0].clientX;
    touchCurrentX = touchStartX;
    isSwiping = true;
    swipedItemId = itemId;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isSwiping) return;
    touchCurrentX = e.touches[0].clientX;
    this.update();
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;
    const swipeDistance = touchStartX - touchCurrentX;

    // If swiped left more than 80px, keep delete button visible
    if (swipeDistance > 80) {
      // Keep swipedItemId set
    } else {
      // Reset if not swiped enough
      swipedItemId = null;
    }

    isSwiping = false;
    touchStartX = 0;
    touchCurrentX = 0;
    this.update();
  };

  const addItem = () => {
    if (newItemName.trim()) {
      const newItem: ListItem = {
        id: Date.now().toString(),
        name: newItemName.trim(),
        checked: false,
      };
      items = [...items, newItem];
      saveItems(items);
      newItemName = "";
      justAddedItemId = newItem.id;
      this.update();

      // Clear the animation flag after animation completes
      setTimeout(() => {
        justAddedItemId = null;
        this.update();
      }, 500);
    }
  };

  const toggleItem = (id: string) => {
    items = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    saveItems(items);
    this.update();
  };

  const deleteItem = (id: string) => {
    items = items.filter((item) => item.id !== id);
    saveItems(items);
    swipedItemId = null;
    this.update();
  };

  return () => {
    const packedCount = items.filter((item) => item.checked).length;
    const totalCount = items.length;
    const progress = totalCount > 0 ? (packedCount / totalCount) * 100 : 0;

    return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-soft-md border border-neutral-200 dark:border-neutral-700 p-6 sm:p-8 lg:p-10">
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
          Packing List
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Keep track of everything you need
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
            Progress
          </span>
          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
            {packedCount} / {totalCount}
          </span>
        </div>
        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-primary-600 dark:bg-primary-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row gap-3">
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
          className="flex-1 px-4 py-3 rounded-xl border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none transition-colors"
        />
        <button
          on={[press(() => addItem())]}
          className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 active:bg-primary-800 dark:bg-primary-500 dark:hover:bg-primary-600 dark:active:bg-primary-700 text-white font-semibold transition-colors shadow-sm hover:shadow-md"
        >
          Add Item
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const isThisItemSwiped = swipedItemId === item.id;
          const swipeOffset = isSwiping && isThisItemSwiped ? Math.min(0, -(touchStartX - touchCurrentX)) : 0;

          // Delete button slides in from right (starts at 100px off-screen, ends at 0)
          const deleteButtonOffset = isThisItemSwiped && !isSwiping ? 0 : (isSwiping && isThisItemSwiped ? Math.max(0, 100 + swipeOffset) : 100);

          return (
            <div
              key={item.id}
              className={`relative overflow-hidden rounded-xl ${item.id === justAddedItemId ? 'animate-pop-in' : ''}`}
            >
              {/* Main item content (stays stationary) */}
              <div
                on={[
                  dom.touchstart((e) => handleTouchStart(e, item.id)),
                  dom.touchmove(handleTouchMove),
                  dom.touchend(handleTouchEnd),
                  dom.touchcancel(() => {
                    swipedItemId = null;
                    isSwiping = false;
                    this.update();
                  }),
                ]}
                className="group flex items-center gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors touch-pan-y relative"
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  on={[dom.change(() => toggleItem(item.id))]}
                  className="w-5 h-5 rounded-md cursor-pointer flex-shrink-0"
                />
                <span
                  className={`flex-1 text-base sm:text-lg break-words transition-all ${
                    item.checked
                      ? "line-through text-neutral-400 dark:text-neutral-600"
                      : "text-neutral-900 dark:text-neutral-50"
                  }`}
                >
                  {item.name}
                </span>
                {/* Desktop only: visible delete button */}
                <button
                  on={[press(() => deleteItem(item.id))]}
                  className="hidden sm:block px-3 py-1.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors flex-shrink-0"
                >
                  Delete
                </button>
              </div>

              {/* Delete button that slides in from right (mobile only) - on top of item */}
              <div
                className="absolute top-0 right-0 h-full flex items-center sm:hidden pointer-events-none z-20"
                style={{
                  transform: `translateX(${deleteButtonOffset}px)`,
                  transition: isSwiping ? "none" : "transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                }}
              >
                <button
                  on={[press(() => deleteItem(item.id))]}
                  className="h-full px-6 bg-red-500 hover:bg-red-600 text-white font-semibold text-sm flex items-center pointer-events-auto shadow-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 px-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 mb-4">
            <svg className="w-8 h-8 text-neutral-400 dark:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-50 mb-1">
            No items yet
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Add your first item to get started
          </p>
        </div>
      )}
    </div>
    );
  };
}
