import { createRoot } from "@remix-run/dom";
import { PackingListApp } from "./components/packing/PackingListApp";

createRoot(document.getElementById("root")!).render(
  <div
    css={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      width: "100%",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
      backgroundColor: "#f0f4f8",
      transition: "background-color 0.3s ease",
      "@media (prefers-color-scheme: dark)": {
        backgroundColor: "#0f172a",
      },
    }}
  >
    <header
      css={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "1.25rem 1rem",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        width: "100%",
        "@media (min-width: 640px)": {
          padding: "1.5rem 2rem",
        },
      }}
    >
      <h1
        css={{
          margin: 0,
          fontSize: "1.375rem",
          fontWeight: 700,
          letterSpacing: "-0.025em",
          "@media (min-width: 640px)": {
            fontSize: "1.875rem",
          },
        }}
      >
        ✈️ PackApp
      </h1>
      <p
        css={{
          margin: "0.25rem 0 0 0",
          fontSize: "0.8125rem",
          opacity: 0.9,
          fontWeight: 300,
          "@media (min-width: 640px)": {
            fontSize: "0.875rem",
          },
        }}
      >
        Never forget anything again
      </p>
    </header>

    <main
      css={{
        flex: 1,
        maxWidth: "640px",
        margin: "0 auto",
        padding: "1rem",
        width: "100%",
        "@media (min-width: 640px)": {
          padding: "2rem 1rem",
        },
      }}
    >
      <PackingListApp />
    </main>
  </div>
);
