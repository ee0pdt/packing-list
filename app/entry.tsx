import { createRoot } from "@remix-run/dom";
import { PackingListApp } from "./components/packing/PackingListApp";

createRoot(document.getElementById("root")!).render(
  <div
    css={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      fontFamily: "'Patrick Hand', cursive",
      backgroundColor: "#f5f5f5",
    }}
  >
    <header
      css={{
        backgroundColor: "#1976d2",
        color: "white",
        padding: "1rem 2rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <h1 css={{ margin: 0, fontSize: "1.5rem" }}>PackApp</h1>
    </header>

    <main
      css={{
        flex: 1,
        maxWidth: "600px",
        margin: "0 auto",
        padding: "2rem",
        width: "100%",
      }}
    >
      <PackingListApp />
    </main>
  </div>
);
