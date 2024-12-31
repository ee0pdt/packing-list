import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/common/Layout";
import { theme } from "./theme";
import ListContainer from "./components/list/ListContainer";

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <Routes>
            <Route path="/list/*" element={<ListContainer />} />
          </Routes>
        </Layout>
      </ThemeProvider>
    </Router>
  );
};

export default App;