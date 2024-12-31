import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { HashRouter as Router } from "react-router-dom";
import { Layout } from "./components/common/Layout";
import { theme } from "./theme";
import ListContainer from "./components/list/ListContainer";

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <ListContainer />
        </Layout>
      </ThemeProvider>
    </Router>
  );
};

export default App;