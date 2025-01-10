import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/common/Layout";
import theme from "./theme/index";
import PackingListContainer from "./components/packing/PackingListContainer";

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <Routes>
            <Route path="/list/*" element={<PackingListContainer />} />
          </Routes>
        </Layout>
      </ThemeProvider>
    </Router>
  );
};

export default App;