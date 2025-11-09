import { Components, Theme } from '@mui/material/styles';

export const components: Components<Omit<Theme, 'components'>> = {
  MuiContainer: {
    styleOverrides: {
      root: {
        paddingTop: '24px',
        paddingBottom: '24px',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: `
          0 8px 32px 0 rgba(31, 38, 135, 0.2),
          inset 0 1px 1px 0 rgba(255, 255, 255, 0.3),
          0 1px 0 0 rgba(255, 255, 255, 0.15)
        `,
        borderBottom: '1px solid rgba(255, 255, 255, 0.18)',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px) saturate(180%) brightness(120%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%) brightness(120%)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: `
          0 8px 32px 0 rgba(31, 38, 135, 0.15),
          inset 0 1px 1px 0 rgba(255, 255, 255, 0.4)
        `,
        borderRadius: '16px',
        transition: 'all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
      elevation1: {
        boxShadow: `
          0 4px 16px 0 rgba(31, 38, 135, 0.1),
          inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)
        `,
      },
      elevation2: {
        boxShadow: `
          0 8px 32px 0 rgba(31, 38, 135, 0.15),
          inset 0 1px 1px 0 rgba(255, 255, 255, 0.4)
        `,
      },
      elevation3: {
        boxShadow: `
          0 12px 40px 0 rgba(31, 38, 135, 0.2),
          inset 0 1px 2px 0 rgba(255, 255, 255, 0.5)
        `,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(25px) saturate(190%) brightness(120%)',
        WebkitBackdropFilter: 'blur(25px) saturate(190%) brightness(120%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: `
          0 8px 32px 0 rgba(31, 38, 135, 0.2),
          inset 0 1px 2px 0 rgba(255, 255, 255, 0.5)
        `,
        borderRadius: '20px',
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `
            0 12px 40px 0 rgba(31, 38, 135, 0.3),
            inset 0 1px 3px 0 rgba(255, 255, 255, 0.6)
          `,
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        textTransform: 'none',
        fontWeight: 600,
        padding: '10px 24px',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        '&:hover': {
          transform: 'translateY(-2px)',
        },
        '&:active': {
          transform: 'scale(0.95)',
        },
      },
      contained: {
        background: 'rgba(255, 255, 255, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        boxShadow: `
          0 4px 16px 0 rgba(31, 38, 135, 0.2),
          inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)
        `,
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.25)',
          boxShadow: `
            0 6px 24px 0 rgba(31, 38, 135, 0.3),
            inset 0 1px 2px 0 rgba(255, 255, 255, 0.4)
          `,
        },
      },
    },
  },
  MuiListItem: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        marginBottom: '8px',
        transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.1)',
          transform: 'translateX(4px)',
        },
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(15px)',
        },
        '&:active': {
          transform: 'scale(0.98)',
        },
      },
    },
  },
  MuiCheckbox: {
    styleOverrides: {
      root: {
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        '&:hover': {
          transform: 'scale(1.15)',
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          transition: 'all 0.3s ease',
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
          },
        },
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        background: 'rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(30px) saturate(200%)',
        WebkitBackdropFilter: 'blur(30px) saturate(200%)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        boxShadow: `
          0 16px 64px 0 rgba(31, 38, 135, 0.3),
          inset 0 2px 4px 0 rgba(255, 255, 255, 0.5)
        `,
        borderRadius: '24px',
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.15)',
          transform: 'scale(1.1) rotate(5deg)',
        },
        '&:active': {
          transform: 'scale(0.9)',
        },
      },
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: '10px',
        height: '8px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(5px)',
        overflow: 'hidden',
      },
      bar: {
        borderRadius: '10px',
        background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.8) 0%, rgba(139, 92, 246, 0.9) 50%, rgba(236, 72, 153, 0.8) 100%)',
        backgroundSize: '200% 100%',
        boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
      },
    },
  },
};