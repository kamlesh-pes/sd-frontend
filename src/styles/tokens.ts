export const tokens = {
  colors: {
    background: 'hsl(210 25% 98%)',
    foreground: 'hsl(215 28% 17%)',
    surface: 'hsl(0 0% 100%)',
    muted: 'hsl(210 16% 93%)',
    mutedForeground: 'hsl(215 16% 47%)',
    border: 'hsl(214 20% 86%)',
    primary: 'hsl(173 80% 32%)',
    primaryForeground: 'hsl(0 0% 100%)',
    accent: 'hsl(38 92% 50%)',
    accentForeground: 'hsl(24 10% 10%)',
    destructive: 'hsl(0 72% 51%)',
    ring: 'hsl(173 80% 32%)',
  },
  radius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
  },
  spacing: {
    page: '1.5rem',
    section: '4rem',
  },
  typography: {
    sans: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
    display: '"Space Grotesk", "DM Sans", ui-sans-serif, system-ui, sans-serif',
  },
  shadow: {
    sm: '0 1px 2px hsl(215 28% 17% / 0.06)',
    md: '0 8px 24px hsl(215 28% 17% / 0.08)',
  },
} as const

export type DesignTokens = typeof tokens