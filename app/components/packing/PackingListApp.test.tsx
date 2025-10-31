import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createRoot } from "@remix-run/dom";
import { PackingListApp } from "./PackingListApp";

describe("PackingListApp", () => {
  let container: HTMLElement;
  let root: ReturnType<typeof createRoot>;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    container = document.createElement("div");
    container.id = "test-root";
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    if (root) {
      root.remove();
    }
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  it("should render the packing list app", async () => {
    root.render(<PackingListApp />);
    root.flush();

    // Wait for next tick
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(container.querySelector("h2")?.textContent).toBe("Packing List");
  });

  it("should display initial items", async () => {
    root.render(<PackingListApp />);
    root.flush();

    await new Promise((resolve) => setTimeout(resolve, 0));

    const items = container.querySelectorAll('input[type="checkbox"]');
    expect(items.length).toBe(3);

    // Check initial items exist
    expect(container.textContent).toContain("Passport");
    expect(container.textContent).toContain("Phone charger");
    expect(container.textContent).toContain("Toothbrush");
  });

  it("should show correct packed count", async () => {
    root.render(<PackingListApp />);
    root.flush();

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(container.textContent).toContain("Progress");
    expect(container.textContent).toContain("0 / 3");
  });

  it("should render input and buttons", async () => {
    root.render(<PackingListApp />);
    root.flush();

    await new Promise((resolve) => setTimeout(resolve, 0));

    const input = container.querySelector('input[type="text"]');
    const buttons = container.querySelectorAll("button");

    expect(input).toBeTruthy();
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("should render checkboxes for items", async () => {
    root.render(<PackingListApp />);
    root.flush();

    await new Promise((resolve) => setTimeout(resolve, 0));

    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes.length).toBe(3);
  });

  describe("Lucide Icons", () => {
    it("should render theme toggle icon (Sun/Moon)", async () => {
      root.render(<PackingListApp />);
      root.flush();

      await new Promise((resolve) => setTimeout(resolve, 0));

      // Check for theme toggle button with aria-label
      const themeButton = container.querySelector('[aria-label*="Switch to"]');
      expect(themeButton).toBeTruthy();
      expect(themeButton?.querySelector('svg')).toBeTruthy();
    });

    it("should render GripVertical icon for drag handles", async () => {
      root.render(<PackingListApp />);
      root.flush();

      await new Promise((resolve) => setTimeout(resolve, 0));

      const dragButtons = container.querySelectorAll('[aria-label="Drag to reorder"]');
      expect(dragButtons.length).toBe(3); // One for each item
    });

    it("should render MoreVertical icon for dropdown menus", async () => {
      root.render(<PackingListApp />);
      root.flush();

      await new Promise((resolve) => setTimeout(resolve, 0));

      const menuButtons = container.querySelectorAll('[aria-label="Item options"]');
      expect(menuButtons.length).toBe(3); // One for each item
    });

    it("should render ClipboardList icon in empty state", async () => {
      // Clear localStorage to ensure empty state
      localStorage.setItem("packapp-items", JSON.stringify([]));

      root.render(<PackingListApp />);
      root.flush();

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(container.textContent).toContain("No items yet");
      const emptyIcon = container.querySelector('.inline-flex svg');
      expect(emptyIcon).toBeTruthy();
    });
  });

  describe("Dropdown Menu", () => {
    it("should open dropdown when clicking menu button", async () => {
      root.render(<PackingListApp />);
      root.flush();

      await new Promise((resolve) => setTimeout(resolve, 0));

      const menuButton = container.querySelector('[aria-label="Item options"]') as HTMLButtonElement;
      expect(menuButton).toBeTruthy();

      // Check initial state
      expect(menuButton.getAttribute('aria-expanded')).toBe('false');

      // Click to open
      menuButton.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Check dropdown is open
      const dropdown = container.querySelector('[role="menu"]');
      expect(dropdown).toBeTruthy();
      expect(menuButton.getAttribute('aria-expanded')).toBe('true');
    });

    it("should show Edit and Delete options in dropdown", async () => {
      root.render(<PackingListApp />);
      root.flush();

      await new Promise((resolve) => setTimeout(resolve, 0));

      const menuButton = container.querySelector('[aria-label="Item options"]') as HTMLButtonElement;
      menuButton.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const menuItems = container.querySelectorAll('[role="menuitem"]');
      expect(menuItems.length).toBe(2);

      expect(container.textContent).toContain("Edit");
      expect(container.textContent).toContain("Delete");
    });

    it("should close dropdown when clicking outside", async () => {
      root.render(<PackingListApp />);
      root.flush();

      await new Promise((resolve) => setTimeout(resolve, 0));

      const menuButton = container.querySelector('[aria-label="Item options"]') as HTMLButtonElement;
      menuButton.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Verify dropdown is open
      expect(container.querySelector('[role="menu"]')).toBeTruthy();

      // Click outside
      document.body.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Verify dropdown is closed
      expect(container.querySelector('[role="menu"]')).toBeFalsy();
    });
  });

  describe("Edit Functionality", () => {
    it("should enter edit mode when clicking Edit in dropdown", async () => {
      root.render(<PackingListApp />);
      root.flush();

      await new Promise((resolve) => setTimeout(resolve, 0));

      // Open dropdown
      const menuButton = container.querySelector('[aria-label="Item options"]') as HTMLButtonElement;
      menuButton.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Click Edit
      const editButton = Array.from(container.querySelectorAll('[role="menuitem"]'))
        .find(el => el.textContent?.includes("Edit")) as HTMLElement;
      editButton.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Check edit mode is active
      const editInput = container.querySelector('input[type="text"]:not([placeholder])') as HTMLInputElement;
      expect(editInput).toBeTruthy();
      expect(editInput.value).toBe("Passport");

      // Check for Save and Cancel buttons
      expect(container.textContent).toContain("Save");
      expect(container.textContent).toContain("Cancel");
    });

    it("should save edited item name", async () => {
      root.render(<PackingListApp />);
      root.flush();

      await new Promise((resolve) => setTimeout(resolve, 0));

      // Open dropdown and click Edit
      const menuButton = container.querySelector('[aria-label="Item options"]') as HTMLButtonElement;
      menuButton.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const editButton = Array.from(container.querySelectorAll('[role="menuitem"]'))
        .find(el => el.textContent?.includes("Edit")) as HTMLElement;
      editButton.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Edit the name
      const editInput = container.querySelector('input[type="text"]:not([placeholder])') as HTMLInputElement;
      editInput.value = "Updated Passport";
      editInput.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Click Save
      const saveButton = Array.from(container.querySelectorAll('button'))
        .find(btn => btn.textContent === "Save") as HTMLButtonElement;
      saveButton.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Verify item name was updated
      expect(container.textContent).toContain("Updated Passport");
    });

    it("should cancel edit without saving", async () => {
      root.render(<PackingListApp />);
      root.flush();

      await new Promise((resolve) => setTimeout(resolve, 0));

      // Open dropdown and click Edit
      const menuButton = container.querySelector('[aria-label="Item options"]') as HTMLButtonElement;
      menuButton.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const editButton = Array.from(container.querySelectorAll('[role="menuitem"]'))
        .find(el => el.textContent?.includes("Edit")) as HTMLElement;
      editButton.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Edit the name
      const editInput = container.querySelector('input[type="text"]:not([placeholder])') as HTMLInputElement;
      const originalValue = editInput.value;
      editInput.value = "Changed Name";
      editInput.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Click Cancel
      const cancelButton = Array.from(container.querySelectorAll('button'))
        .find(btn => btn.textContent === "Cancel") as HTMLButtonElement;
      cancelButton.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Verify item name was NOT updated
      expect(container.textContent).toContain(originalValue);
      expect(container.textContent).not.toContain("Changed Name");
    });
  });

  describe("Delete Functionality", () => {
    it("should delete item when clicking Delete in dropdown", async () => {
      root.render(<PackingListApp />);
      root.flush();

      await new Promise((resolve) => setTimeout(resolve, 0));

      // Verify item exists
      expect(container.textContent).toContain("Passport");

      // Open dropdown
      const menuButton = container.querySelector('[aria-label="Item options"]') as HTMLButtonElement;
      menuButton.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Click Delete
      const deleteButton = Array.from(container.querySelectorAll('[role="menuitem"]'))
        .find(el => el.textContent?.includes("Delete")) as HTMLElement;
      deleteButton.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Verify item was deleted
      expect(container.textContent).not.toContain("Passport");

      // Verify only 2 items remain
      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      expect(checkboxes.length).toBe(2);
    });

    it("should close dropdown after deleting", async () => {
      root.render(<PackingListApp />);
      root.flush();

      await new Promise((resolve) => setTimeout(resolve, 0));

      // Open dropdown
      const menuButton = container.querySelector('[aria-label="Item options"]') as HTMLButtonElement;
      menuButton.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Verify dropdown is open
      expect(container.querySelector('[role="menu"]')).toBeTruthy();

      // Click Delete
      const deleteButton = Array.from(container.querySelectorAll('[role="menuitem"]'))
        .find(el => el.textContent?.includes("Delete")) as HTMLElement;
      deleteButton.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Verify dropdown is closed
      expect(container.querySelector('[role="menu"]')).toBeFalsy();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels on buttons", async () => {
      root.render(<PackingListApp />);
      root.flush();

      await new Promise((resolve) => setTimeout(resolve, 0));

      // Drag handle
      const dragHandle = container.querySelector('[aria-label="Drag to reorder"]');
      expect(dragHandle).toBeTruthy();

      // Dropdown menu
      const menuButton = container.querySelector('[aria-label="Item options"]');
      expect(menuButton).toBeTruthy();

      // Checkbox
      const checkbox = container.querySelector('input[type="checkbox"][aria-label]');
      expect(checkbox).toBeTruthy();
    });

    it("should have proper ARIA attributes on dropdown", async () => {
      root.render(<PackingListApp />);
      root.flush();

      await new Promise((resolve) => setTimeout(resolve, 0));

      const menuButton = container.querySelector('[aria-label="Item options"]');

      // Check aria-expanded is false when closed
      expect(menuButton?.getAttribute('aria-expanded')).toBe('false');
      expect(menuButton?.getAttribute('aria-haspopup')).toBe('true');

      // Open dropdown
      (menuButton as HTMLButtonElement).click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Check aria-expanded is true when open
      expect(menuButton?.getAttribute('aria-expanded')).toBe('true');

      // Check dropdown has proper role
      const dropdown = container.querySelector('[role="menu"]');
      expect(dropdown).toBeTruthy();
      expect(dropdown?.getAttribute('aria-orientation')).toBe('vertical');
    });

    it("should have role=menuitem on dropdown options", async () => {
      root.render(<PackingListApp />);
      root.flush();

      await new Promise((resolve) => setTimeout(resolve, 0));

      const menuButton = container.querySelector('[aria-label="Item options"]') as HTMLButtonElement;
      menuButton.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const menuItems = container.querySelectorAll('[role="menuitem"]');
      expect(menuItems.length).toBeGreaterThan(0);
    });
  });

  describe("LocalStorage Persistence", () => {
    it("should save edited items to localStorage", async () => {
      root.render(<PackingListApp />);
      root.flush();

      await new Promise((resolve) => setTimeout(resolve, 0));

      // Open dropdown and edit item
      const menuButton = container.querySelector('[aria-label="Item options"]') as HTMLButtonElement;
      menuButton.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const editButton = Array.from(container.querySelectorAll('[role="menuitem"]'))
        .find(el => el.textContent?.includes("Edit")) as HTMLElement;
      editButton.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const editInput = container.querySelector('input[type="text"]:not([placeholder])') as HTMLInputElement;
      editInput.value = "Modified Item";
      editInput.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 50));

      const saveButton = Array.from(container.querySelectorAll('button'))
        .find(btn => btn.textContent === "Save") as HTMLButtonElement;
      saveButton.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Check localStorage
      const stored = localStorage.getItem("packapp-items");
      expect(stored).toBeTruthy();
      const items = JSON.parse(stored!);
      expect(items[0].name).toBe("Modified Item");
    });

    it("should save deleted items to localStorage", async () => {
      root.render(<PackingListApp />);
      root.flush();

      await new Promise((resolve) => setTimeout(resolve, 0));

      // Delete first item
      const menuButton = container.querySelector('[aria-label="Item options"]') as HTMLButtonElement;
      menuButton.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const deleteButton = Array.from(container.querySelectorAll('[role="menuitem"]'))
        .find(el => el.textContent?.includes("Delete")) as HTMLElement;
      deleteButton.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Check localStorage
      const stored = localStorage.getItem("packapp-items");
      expect(stored).toBeTruthy();
      const items = JSON.parse(stored!);
      expect(items.length).toBe(2);
      expect(items.find((item: any) => item.name === "Passport")).toBeFalsy();
    });
  });
});
