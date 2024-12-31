import React from "react";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  title = "PackApp",
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        minWidth: "100vw",
        bgcolor: "background.default",
      }}
    >
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              flexGrow: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          maxWidth: "sm",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
