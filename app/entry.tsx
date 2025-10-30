import { createRoot } from "@remix-run/dom";
import { PackingListApp } from "./components/packing/PackingListApp";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900">
    <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
      <div className="max-w-4xl mx-auto px-6 py-8 sm:px-8 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-neutral-50 tracking-tight">
          PackApp
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Your smart packing companion
        </p>
      </div>
    </header>

    <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 sm:px-8 sm:py-12">
      <PackingListApp />
    </main>
  </div>
);
