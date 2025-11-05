import { beforeEach, vi } from "vitest";

// Mock CSSStyleSheet.prototype.insertRule to avoid happy-dom CSS issues
beforeEach(() => {
  // Mock adoptedStyleSheets if not supported
  if (!document.adoptedStyleSheets) {
    Object.defineProperty(document, "adoptedStyleSheets", {
      value: [],
      writable: true,
      configurable: true,
    });
  }

  // Mock CSSStyleSheet insertRule to handle @layer syntax
  const originalInsertRule = CSSStyleSheet.prototype.insertRule;
  CSSStyleSheet.prototype.insertRule = function (rule: string, index?: number) {
    try {
      // Try original first
      return originalInsertRule.call(this, rule, index);
    } catch (e) {
      // If it fails (likely due to @layer), just return a dummy index
      // This is fine for testing - we don't need actual CSS rendering
      return index ?? 0;
    }
  };
});
