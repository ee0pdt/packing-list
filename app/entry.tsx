import { createRoot } from "@remix-run/dom";
import { PackingListApp } from "./components/packing/PackingListApp";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <div className="min-h-[100dvh] bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-4 sm:p-6">
    <div className="w-full max-w-4xl">
      <PackingListApp />
    </div>
  </div>
);
