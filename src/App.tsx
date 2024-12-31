import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Layout } from "./components/common/Layout";
import { theme } from "./theme";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>{/* Your other components will go here */}</Layout>
    </ThemeProvider>
  );
};

export default App;
