import type { Remix } from "@remix-run/dom";
import { press } from "@remix-run/events/press";
import { dom } from "@remix-run/events";

interface ListItem {
  id: string;
  name: string;
  checked: boolean;
}

interface DropdownState {
  openItemId: string | null;
  editingItemId: string | null;
  editingItemName: string;
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
  let justAddedItemId: string | null = null;

  // Drag and drop state
  let draggedItemId: string | null = null;
  let dragStartY = 0;
  let dragCurrentY = 0;
  let isDragging = false;
  let dragOverItemId: string | null = null;

  // Dropdown and edit state
  let openDropdownId: string | null = null;
  let editingItemId: string | null = null;
  let editingItemName: string = "";

  // Dark mode state - check localStorage or system preference
  const getInitialTheme = () => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  let theme = getInitialTheme();

  const toggleTheme = () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
    // Apply to both html and body for consistency
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.body.classList.toggle('dark', theme === 'dark');
    this.update();
  };

  // Apply theme on mount
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.body.classList.toggle('dark', theme === 'dark');

  // Close dropdown when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('[data-dropdown]')) {
      openDropdownId = null;
      this.update();
    }
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('click', handleClickOutside);
  }

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
    openDropdownId = null;
    this.update();
  };

  const toggleDropdown = (id: string) => {
    openDropdownId = openDropdownId === id ? null : id;
    this.update();
  };

  const startEdit = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      editingItemId = id;
      editingItemName = item.name;
      openDropdownId = null;
      this.update();
    }
  };

  const saveEdit = () => {
    if (editingItemId && editingItemName.trim()) {
      items = items.map(item =>
        item.id === editingItemId
          ? { ...item, name: editingItemName.trim() }
          : item
      );
      saveItems(items);
    }
    editingItemId = null;
    editingItemName = "";
    this.update();
  };

  const cancelEdit = () => {
    editingItemId = null;
    editingItemName = "";
    this.update();
  };

  // Drag and drop handlers
  const handleDragStart = (e: TouchEvent, itemId: string) => {
    e.stopPropagation();
    dragStartY = e.touches[0].clientY;
    dragCurrentY = dragStartY;
    isDragging = true;
    draggedItemId = itemId;
    this.update();
  };

  const handleDragMove = (e: TouchEvent) => {
    if (!isDragging || !draggedItemId) return;
    e.preventDefault();
    dragCurrentY = e.touches[0].clientY;

    // Find which item we're hovering over
    const itemElements = document.querySelectorAll('[data-item-id]');
    let foundOverItem = false;

    itemElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;

      if (dragCurrentY >= rect.top && dragCurrentY <= rect.bottom) {
        const itemId = el.getAttribute('data-item-id');
        if (itemId && itemId !== draggedItemId) {
          dragOverItemId = itemId;
          foundOverItem = true;
        }
      }
    });

    if (!foundOverItem) {
      dragOverItemId = null;
    }

    this.update();
  };

  const handleDragEnd = () => {
    if (!isDragging || !draggedItemId) return;

    // Reorder items if we're over a different item
    if (dragOverItemId && dragOverItemId !== draggedItemId) {
      const draggedIndex = items.findIndex(item => item.id === draggedItemId);
      const targetIndex = items.findIndex(item => item.id === dragOverItemId);

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newItems = [...items];
        const [draggedItem] = newItems.splice(draggedIndex, 1);
        newItems.splice(targetIndex, 0, draggedItem);
        items = newItems;
        saveItems(items);
      }
    }

    isDragging = false;
    draggedItemId = null;
    dragOverItemId = null;
    dragStartY = 0;
    dragCurrentY = 0;
    this.update();
  };

  return () => {
    const packedCount = items.filter((item) => item.checked).length;
    const totalCount = items.length;
    const progress = totalCount > 0 ? (packedCount / totalCount) * 100 : 0;

    return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-soft-md border border-neutral-200 dark:border-neutral-700 p-6 sm:p-8 lg:p-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
            Packing List
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Keep track of everything you need
          </p>
        </div>
        <button
          on={[press(() => toggleTheme())]}
          className="flex-shrink-0 p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span className="text-xl">
            {theme === 'light' ? '☀️' : '🌙'}
          </span>
        </button>
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
          const isBeingDragged = draggedItemId === item.id;
          const isDragOver = dragOverItemId === item.id;
          const isEditing = editingItemId === item.id;
          const isDropdownOpen = openDropdownId === item.id;

          return (
            <div
              key={item.id}
              data-item-id={item.id}
              className={`relative rounded-xl ${item.id === justAddedItemId ? 'animate-pop-in' : ''} ${isBeingDragged ? 'shadow-2xl scale-105 z-50' : ''} ${isDragOver ? 'ring-2 ring-primary-500' : ''} transition-all`}
              on={[
                dom.touchmove(handleDragMove),
                dom.touchend(handleDragEnd),
                dom.touchcancel(() => {
                  isDragging = false;
                  draggedItemId = null;
                  dragOverItemId = null;
                  this.update();
                }),
              ]}
            >
              {isEditing ? (
                /* Edit mode */
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-50 dark:bg-primary-950/20 border-2 border-primary-500 dark:border-primary-600">
                  <input
                    type="text"
                    value={editingItemName}
                    on={[
                      dom.input((e) => {
                        editingItemName = (e.target as HTMLInputElement).value;
                        this.update();
                      }),
                      dom.keypress((e) => {
                        if (e.key === "Enter") saveEdit();
                        if (e.key === "Escape") cancelEdit();
                      }),
                    ]}
                    className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none"
                    autoFocus
                  />
                  <button
                    on={[press(() => saveEdit())]}
                    className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm transition-colors"
                  >
                    Save
                  </button>
                  <button
                    on={[press(() => cancelEdit())]}
                    className="px-4 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-900 dark:text-neutral-50 font-medium text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                /* Normal mode */
                <div className="group flex items-center gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative">
                  {/* Drag handle */}
                  <button
                    on={[
                      dom.touchstart((e) => handleDragStart(e, item.id)),
                    ]}
                    className="touch-none cursor-grab active:cursor-grabbing flex-shrink-0 p-2 -m-1 text-lg font-bold text-neutral-600 dark:text-neutral-400"
                    aria-label="Drag to reorder"
                  >
                    ⋮⋮
                  </button>

                  <input
                    type="checkbox"
                    checked={item.checked}
                    on={[dom.change(() => toggleItem(item.id))]}
                    className="w-5 h-5 rounded-md cursor-pointer flex-shrink-0"
                    aria-label={`Mark ${item.name} as ${item.checked ? 'unchecked' : 'checked'}`}
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

                  {/* Dropdown menu */}
                  <div className="relative flex-shrink-0" data-dropdown>
                    <button
                      on={[press((e) => {
                        e.stopPropagation();
                        toggleDropdown(item.id);
                      })]}
                      className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-xl font-bold text-neutral-600 dark:text-neutral-400"
                      aria-label="Item options"
                      aria-expanded={isDropdownOpen}
                      aria-haspopup="true"
                    >
                      ⋮
                    </button>

                    {isDropdownOpen && (
                      <div
                        className="absolute right-0 top-full mt-1 w-48 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-lg z-50"
                        role="menu"
                        aria-orientation="vertical"
                      >
                        <button
                          on={[press(() => startEdit(item.id))]}
                          className="w-full flex items-center gap-2 px-4 py-3 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors rounded-t-lg"
                          role="menuitem"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>
                          </svg>
                          <span>Edit</span>
                        </button>
                        <button
                          on={[press(() => deleteItem(item.id))]}
                          className="w-full flex items-center gap-2 px-4 py-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors rounded-b-lg"
                          role="menuitem"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                          </svg>
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 px-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-neutral-400 dark:text-neutral-600" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2m-2 7h12m-12 5h12"/>
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
