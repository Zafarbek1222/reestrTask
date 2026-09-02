const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: token('color-canvas'),
        surface: {
          DEFAULT: token('color-surface'),
          subtle: token('color-surface-subtle'),
          raised: token('color-surface-raised'),
          inverse: token('color-surface-inverse'),
        },
        content: {
          DEFAULT: token('color-content'),
          strong: token('color-content-strong'),
          muted: token('color-content-muted'),
          subtle: token('color-content-subtle'),
          inverse: token('color-content-inverse'),
        },
        line: {
          DEFAULT: token('color-line'),
          strong: token('color-line-strong'),
        },
        brand: {
          DEFAULT: token('color-brand'),
          hover: token('color-brand-hover'),
          pressed: token('color-brand-pressed'),
          subtle: token('color-brand-subtle'),
        },
        accent: {
          DEFAULT: token('color-accent'),
          hover: token('color-accent-hover'),
          pressed: token('color-accent-pressed'),
          subtle: token('color-accent-subtle'),
        },
        positive: token('color-positive'),
        warning: token('color-warning'),
        danger: token('color-danger'),
        info: token('color-info'),
        focus: token('color-focus'),
        navy: {
          50: '#f1f5f9',
          100: '#e2e8f0',
          200: '#c7d2e0',
          300: '#9aabc4',
          400: '#526a89',
          500: '#3f5c86',
          600: '#2b456b',
          700: '#1e3557',
          800: '#152845',
          900: '#0d1b30',
          950: '#070f1c',
        },
        teal: {
          50: '#effcfa',
          100: '#d6f6f2',
          200: '#aeece6',
          300: '#79dbd5',
          400: '#45c2bf',
          500: '#1fa5a4',
          600: '#0f7f7d',
          700: '#14696b',
          800: '#145456',
          900: '#134647',
        },
        flag: {
          green: '#1eaf5b',
          blue: '#1a8fd1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        control: '0.625rem',
        surface: '0.875rem',
        overlay: '1rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(13, 27, 48, 0.04), 0 10px 28px -18px rgba(13, 27, 48, 0.2)',
        pop: '0 22px 56px -20px rgba(13, 27, 48, 0.32)',
        surface: '0 1px 2px rgba(13, 27, 48, 0.04), 0 8px 24px -18px rgba(13, 27, 48, 0.18)',
        elevated: '0 16px 36px -18px rgba(13, 27, 48, 0.24)',
        overlay: '0 28px 72px -24px rgba(7, 15, 28, 0.42)',
      },
      transitionDuration: {
        fast: '160ms',
        base: '220ms',
        slow: '280ms',
      },
    },
  },
};
