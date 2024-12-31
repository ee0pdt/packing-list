import React from "react";
import { AppBar, Box, Toolbar, Typography, Switch, FormControlLabel } from "@mui/material";
import { useEditMode } from "../../contexts/EditModeContext";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  title = "PackApp",
}) => {
  const { editMode, setEditMode } = useEditMode();

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
          <FormControlLabel
            control={
              <Switch
                checked={editMode}
                onChange={(e) => setEditMode(e.target.checked)}
                color="default"
              />
            }
            label="Edit Mode"
            sx={{ color: 'white' }}
          />
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