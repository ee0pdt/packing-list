import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createRoot } from "@remix-run/dom";
import { PackingListApp } from "./PackingListApp";

describe("PackingListApp", () => {
  let container: HTMLElement;
  let root: ReturnType<typeof createRoot>;

  beforeEach(() => {
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

    expect(container.querySelector("h2")?.textContent).toBe("My Packing List");
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
});
