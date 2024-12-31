import { Container, Box } from '@mui/material';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        {children}
      </Box>
    </Container>
  );
};

export default Layout;