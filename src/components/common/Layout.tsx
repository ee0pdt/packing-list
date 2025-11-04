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
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Liquid Gradient Animated Background */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          background: `
            linear-gradient(
              135deg,
              #667eea 0%,
              #764ba2 25%,
              #f093fb 50%,
              #4facfe 75%,
              #00f2fe 100%
            )
          `,
          backgroundSize: "400% 400%",
          animation: "liquidGradient 15s ease infinite",
          "@keyframes liquidGradient": {
            "0%": {
              backgroundPosition: "0% 50%",
            },
            "50%": {
              backgroundPosition: "100% 50%",
            },
            "100%": {
              backgroundPosition: "0% 50%",
            },
          },
        }}
      />

      {/* Floating glass orbs for depth */}
      <Box
        sx={{
          position: "fixed",
          top: "10%",
          left: "10%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "float 8s ease-in-out infinite",
          zIndex: -1,
          "@keyframes float": {
            "0%, 100%": {
              transform: "translate(0, 0) scale(1)",
            },
            "33%": {
              transform: "translate(30px, -30px) scale(1.1)",
            },
            "66%": {
              transform: "translate(-20px, 20px) scale(0.9)",
            },
          },
        }}
      />
      <Box
        sx={{
          position: "fixed",
          bottom: "15%",
          right: "15%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "float 10s ease-in-out infinite 2s",
          zIndex: -1,
        }}
      />

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
              fontWeight: 600,
              letterSpacing: "0.5px",
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
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
          width: "100%",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};