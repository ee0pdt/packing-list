import { TypographyOptions } from "@mui/material/styles/createTypography";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    listItem: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    listItem?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    listItem: true;
  }
}

export const typography: TypographyOptions = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontSize: "2.5rem",
    fontWeight: 500,
    lineHeight: 1.2,
    "@media (max-width:600px)": {
      fontSize: "2rem",
    },
  },
  h2: {
    fontSize: "2rem",
    fontWeight: 500,
    lineHeight: 1.2,
    "@media (max-width:600px)": {
      fontSize: "1.75rem",
    },
  },
  h5: {
    fontSize: "1.5rem",
    fontWeight: 500,
    lineHeight: 1.2,
    "@media (max-width:600px)": {
      fontSize: "1.25rem",
    },
  },
  listItem: {
    fontFamily: '"Gochi Hand", cursive',
    fontSize: "1.5rem",
    lineHeight: 1.5,
    fontWeight: 200,
  },
};
