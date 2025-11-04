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
    <div className="glass dark:glass-dark rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] backdrop-blur-lg">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
            Packing List
          </h2>
          <p className="text-sm text-neutral-700/80 dark:text-neutral-300/80">
            Keep track of everything you need
          </p>
        </div>
        <button
          on={[press(() => toggleTheme())]}
          className="glass-button flex-shrink-0 p-3 rounded-2xl border border-white/20 dark:border-white/10 hover:shadow-lg transition-all duration-300"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span className="text-2xl">
            {theme === 'light' ? '☀️' : '🌙'}
          </span>
        </button>
      </div>

      <div className="mb-8 glass-button p-4 rounded-2xl border border-white/20 dark:border-white/10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-600/80 dark:text-neutral-400/80">
            Progress
          </span>
          <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            {packedCount} / {totalCount}
          </span>
        </div>
        <div className="relative w-full h-3 bg-white/30 dark:bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out shadow-[0_0_20px_rgba(147,51,234,0.5)]"
            style={{ width: `${progress}%`, transformOrigin: 'left' }}
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
          className="flex-1 px-5 py-4 rounded-2xl glass-button border border-white/30 dark:border-white/10 text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-500/60 dark:placeholder:text-neutral-400/60 focus:border-purple-500/50 dark:focus:border-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
        />
        <button
          on={[press(() => addItem())]}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 active:scale-95 dark:from-blue-500 dark:to-purple-500 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/50"
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
              className={`relative rounded-2xl ${item.id === justAddedItemId ? 'animate-pop-in' : ''} ${isBeingDragged ? 'shadow-[0_0_40px_rgba(147,51,234,0.6)] scale-105 z-50' : ''} ${isDragOver ? 'ring-2 ring-purple-500 shadow-[0_0_30px_rgba(147,51,234,0.4)]' : ''} transition-all duration-300`}
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
                <div className="flex items-center gap-3 p-4 rounded-2xl glass-button border border-purple-500/50 shadow-[0_0_30px_rgba(147,51,234,0.3)]">
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
                    className="flex-1 px-4 py-2 rounded-xl glass-button border border-white/20 text-neutral-900 dark:text-neutral-50 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                    autoFocus
                  />
                  <button
                    on={[press(() => saveEdit())]}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
                  >
                    Save
                  </button>
                  <button
                    on={[press(() => cancelEdit())]}
                    className="px-5 py-2 rounded-xl glass-button border border-white/20 hover:bg-white/30 dark:hover:bg-black/30 text-neutral-900 dark:text-neutral-50 font-bold text-sm transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                /* Normal mode */
                <div className={`group flex items-center gap-3 p-4 rounded-2xl glass-button border border-white/20 dark:border-white/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative ${item.checked ? 'opacity-60' : ''}`}>
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
                        className="absolute right-0 top-full mt-2 w-40 rounded-xl glass dark:glass-dark border border-white/30 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.2)] backdrop-blur-lg z-50 overflow-hidden"
                        role="menu"
                        aria-orientation="vertical"
                      >
                        <button
                          on={[press(() => startEdit(item.id))]}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-200 hover:bg-white/40 dark:hover:bg-white/10 transition-all duration-200 font-medium"
                          role="menuitem"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>
                          </svg>
                          <span>Edit</span>
                        </button>
                        <button
                          on={[press(() => deleteItem(item.id))]}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-200 hover:bg-white/40 dark:hover:bg-white/10 transition-all duration-200 font-medium"
                          role="menuitem"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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
        <div className="text-center py-16 px-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full glass-button border border-white/30 dark:border-white/10 mb-6 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2m-2 7h12m-12 5h12"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
            No items yet
          </h3>
          <p className="text-sm text-neutral-600/80 dark:text-neutral-400/80">
            Add your first item to get started
          </p>
        </div>
      )}
    </div>
    );
  };
}
