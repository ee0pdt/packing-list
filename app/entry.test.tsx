import { describe, it, expect, beforeEach } from "vitest";
import { createRoot } from "@remix-run/dom";
import { PackingListApp } from "./components/packing/PackingListApp";

describe("App Entry", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  it("should render the full app structure", () => {
    const root = createRoot(container);

    root.render(
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <header>
          <h1>PackApp</h1>
        </header>
        <main>
          <PackingListApp />
        </main>
      </div>
    );

    expect(container.querySelector("header h1")?.textContent).toBe("PackApp");
    expect(container.querySelector("main")).toBeTruthy();
    expect(container.querySelector("h2")?.textContent).toBe("Packing List");
  });

  it("should render with proper styling classes", () => {
    const root = createRoot(container);

    root.render(
      <div css={{ backgroundColor: "white", padding: "1rem" }}>
        <p>Test</p>
      </div>
    );

    const div = container.querySelector("div");
    expect(div?.className).toBeTruthy();
    expect(div?.className.startsWith("rmx-")).toBe(true);
  });
});
