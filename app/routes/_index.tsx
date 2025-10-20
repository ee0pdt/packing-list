import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "@remix-run/react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Welcome to PackApp
      </Typography>
      <Typography variant="body1" paragraph>
        Your packing list companion
      </Typography>
      <Button
        variant="contained"
        onClick={() => {
          // Create a sample list
          const sampleList = {
            name: "My Packing List",
            items: [],
          };
          const encodedData = btoa(JSON.stringify(sampleList));
          navigate(`/list/${encodedData}`);
        }}
      >
        Create New List
      </Button>
    </Box>
  );
}
