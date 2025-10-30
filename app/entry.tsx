import { createRoot } from "@remix-run/dom";
import { PackingListApp } from "./components/packing/PackingListApp";

createRoot(document.getElementById("root")!).render(
  <div
    css={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      width: "100%",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
      backgroundColor: "#fafafa",
      transition: "background-color 0.3s ease",
      "@media (prefers-color-scheme: dark)": {
        backgroundColor: "#1a1a1a",
      },
    }}
  >
    <header
      css={{
        backgroundColor: "#ffffff",
        color: "#1a1a1a",
        padding: "2rem 1.5rem",
        borderBottom: "1px solid #e5e5e5",
        width: "100%",
        "@media (min-width: 640px)": {
          padding: "3rem 2rem",
        },
        "@media (prefers-color-scheme: dark)": {
          backgroundColor: "#0a0a0a",
          color: "#fafafa",
          borderBottomColor: "#2a2a2a",
        },
      }}
    >
      <div
        css={{
          maxWidth: "640px",
          margin: "0 auto",
        }}
      >
        <h1
          css={{
            margin: 0,
            fontSize: "1.5rem",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            "@media (min-width: 640px)": {
              fontSize: "2rem",
            },
          }}
        >
          PackApp
        </h1>
      </div>
    </header>

    <main
      css={{
        flex: 1,
        maxWidth: "640px",
        margin: "0 auto",
        padding: "2rem 1.5rem",
        width: "100%",
        "@media (min-width: 640px)": {
          padding: "3rem 2rem",
        },
      }}
    >
      <PackingListApp />
    </main>
  </div>
);
