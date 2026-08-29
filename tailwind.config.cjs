module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--color-background) / <alpha-value>)',
        foreground: 'hsl(var(--color-foreground) / <alpha-value>)',
        surface: 'hsl(var(--color-surface) / <alpha-value>)',
        muted: 'hsl(var(--color-muted) / <alpha-value>)',
        'muted-foreground': 'hsl(var(--color-muted-foreground) / <alpha-value>)',
        border: 'hsl(var(--color-border) / <alpha-value>)',
        primary: 'hsl(var(--color-primary) / <alpha-value>)',
        'primary-foreground': 'hsl(var(--color-primary-foreground) / <alpha-value>)',
        accent: 'hsl(var(--color-accent) / <alpha-value>)',
        'accent-foreground': 'hsl(var(--color-accent-foreground) / <alpha-value>)',
        destructive: 'hsl(var(--color-destructive) / <alpha-value>)',
        ring: 'hsl(var(--color-ring) / <alpha-value>)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
      },
    },
  },
  plugins: [],
}
