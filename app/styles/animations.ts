import { keyframes } from '@mui/material/styles';

export const strikethrough = keyframes`
  from {
    text-decoration-color: transparent;
    text-decoration-thickness: 0;
  }
  to {
    text-decoration-color: rgba(0,20,0,0.5);
    text-decoration-thickness: 0.2rem;
  }
`;

export const unstrike = keyframes`
  from {
    text-decoration-color: rgba(0,20,0,0.5);
    text-decoration-thickness: 0.2rem;
  }
  to {
    text-decoration-color: transparent;
    text-decoration-thickness: 0;
  }
`;