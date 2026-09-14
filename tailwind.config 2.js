/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ═══════════════════════════════════════════════════════════════
      // CORES DO DESIGN SYSTEM
      // ═══════════════════════════════════════════════════════════════
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d9ff',
          300: '#a4bfff',
          400: '#7c9aff',
          500: '#6366F1', // PRIMARY
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#10B981', // SECONDARY
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#145231',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#EF4444', // DANGER
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B', // NEUTRAL
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A', // DARK
          950: '#020617',
        },
      },
      // ═══════════════════════════════════════════════════════════════
      // TIPOGRAFIA
      // ═══════════════════════════════════════════════════════════════
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Monaco', 'Courier New', 'monospace'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
        '5xl': ['42px', { lineHeight: '48px' }],
        '6xl': ['48px', { lineHeight: '56px' }],
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      lineHeight: {
        tight: '1.1',
        snug: '1.2',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
      },
      // ═══════════════════════════════════════════════════════════════
      // ESPAÇAMENTO
      // ═══════════════════════════════════════════════════════════════
      spacing: {
        0: '0',
        1: '8px',
        2: '12px',
        3: '16px',
        4: '20px',
        5: '24px',
        6: '32px',
        7: '40px',
        8: '48px',
        9: '56px',
        10: '64px',
        12: '80px',
        14: '96px',
        16: '112px',
        20: '144px',
        24: '160px',
      },
      // ═══════════════════════════════════════════════════════════════
      // BORDER RADIUS
      // ═══════════════════════════════════════════════════════════════
      borderRadius: {
        none: '0',
        sm: '4px',
        base: '8px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        full: '9999px',
      },
      // ═══════════════════════════════════════════════════════════════
      // SHADOWS
      // ═══════════════════════════════════════════════════════════════
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        none: 'none',
      },
      // ═══════════════════════════════════════════════════════════════
      // TRANSIÇÕES
      // ═══════════════════════════════════════════════════════════════
      transitionDuration: {
        75: '75ms',
        100: '100ms',
        150: '150ms',
        200: '200ms',
        300: '300ms',
        500: '500ms',
        700: '700ms',
        1000: '1000ms',
      },
      // ═══════════════════════════════════════════════════════════════
      // ANIMAÇÕES CUSTOMIZADAS
      // ═══════════════════════════════════════════════════════════════
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 300ms ease-out',
        'slide-up': 'slide-up 300ms ease-out',
        'slide-down': 'slide-down 300ms ease-out',
        'pulse-slow': 'pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce-gentle 1s ease-in-out infinite',
      },
    },
  },
  plugins: [
    // Plugin para suportar :has() selector em navegadores antigos
    require('@tailwindcss/forms'),
    // Função para criar variáveis CSS customizadas
    function ({ addBase, theme }) {
      let allColors = flattenColorPalette(theme('colors'));
      let newVars = Object.fromEntries(
        Object.entries(allColors).map(([key, val]) => [`--color-${key}`, val])
      );

      addBase({
        ':root': newVars,
      });
    },
  ],
};

// Função auxiliar para flatten colors
function flattenColorPalette(colors) {
  return Object.assign(
    {},
    ...Object.entries(colors).flatMap(([color, values]) =>
      typeof values == 'object'
        ? Object.entries(values).map(([number, hex]) => ({
          [color + (number === 'DEFAULT' ? '' : `-${number}`)]: hex,
        }))
        : [{ [`${color}`]: values }]
    )
  );
}
