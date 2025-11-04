import { Theme } from '@mui/material';

export const LIST_STYLES = {
  container: {
    pl: 2,
    mt: 2,
    overflow: 'hidden',
    borderRadius: '8px 0 0 8px',
  },
  progressBar: (theme: Theme) => ({
    '& .MuiLinearProgress-bar': {
      backgroundColor: (progress: number) =>
        progress === 100
          ? theme.palette.success.main
          : theme.palette.info.main,
    },
  }),
};

export const getBackgroundColor = (isExpanded: boolean, progress: number, theme: Theme) => 
  !isExpanded
    ? progress === 100
      ? theme.palette.success.dark
      : theme.palette.info.dark
    : theme.palette.background.paper;