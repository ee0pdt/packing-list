import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/common/Layout";
import theme from "./theme/index";
import PackingListContainer from "./components/packing/PackingListContainer";
import { InsertProvider } from "./contexts/InsertContext";

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <InsertProvider>
          <Layout>
            <Routes>
              <Route path="/list/*" element={<PackingListContainer />} />
            </Routes>
          </Layout>
        </InsertProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;