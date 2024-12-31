import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/common/Layout";
import { EditModeProvider } from "./providers/EditModeProvider";

import theme from "./theme/index";
import PackingListContainer from "./components/packing/PackingListContainer";

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <EditModeProvider>
          <Layout>
            <Routes>
              <Route path="/list/*" element={<PackingListContainer />} />
            </Routes>
          </Layout>
        </EditModeProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;