/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Modern blue-focused palette
        primary: {
          50: '#eff6ff',   // Very light blue
          100: '#dbeafe',  // Light blue
          200: '#bfdbfe',  // Lighter blue
          300: '#93c5fd',  // Light blue
          400: '#60a5fa',  // Medium light blue
          500: '#3b82f6',  // Base blue (current)
          600: '#2563eb',  // Medium blue (current)
          700: '#1d4ed8',  // Dark blue (current)
          800: '#1e40af',  // Darker blue
          900: '#1e3a8a',  // Very dark blue
          950: '#172554',  // Ultra dark blue
        },
        
        // Dark theme specific colors
        dark: {
          50: '#f8fafc',   // Almost white
          100: '#f1f5f9',  // Very light gray
          200: '#e2e8f0',  // Light gray
          300: '#cbd5e1',  // Medium light gray
          400: '#94a3b8',  // Medium gray
          500: '#64748b',  // Base gray
          600: '#475569',  // Medium dark gray
          700: '#334155',  // Dark gray
          800: '#1e293b',  // Very dark gray
          900: '#0f172a',  // Ultra dark gray
          950: '#020617',  // Almost black
        },
        
        // Financial status colors (dark theme compatible)
        success: {
          500: '#10b981',  // Green for gains
          600: '#059669',  // Darker green
          400: '#34d399',  // Lighter green for dark theme
        },
        danger: {
          500: '#ef4444',  // Red for losses
          600: '#dc2626',  // Darker red
          400: '#f87171',  // Lighter red for dark theme
        },
        warning: {
          500: '#f59e0b',  // Orange for warnings
          600: '#d97706',  // Darker orange
          400: '#fbbf24',  // Lighter orange for dark theme
        },
        
        // Accent colors for charts and highlights
        accent: {
          blue: '#06b6d4',    // Cyan
          purple: '#8b5cf6',  // Purple
          pink: '#ec4899',    // Pink
          indigo: '#6366f1',  // Indigo
        }
      },
      
      // Modern shadows for dark theme
      boxShadow: {
        'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
        'dark-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-success': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-danger': '0 0 20px rgba(239, 68, 68, 0.3)',
      },
      
      // Modern animations
      animation: {
        'price-flash-up': 'flash-green 0.6s ease-in-out',
        'price-flash-down': 'flash-red 0.6s ease-in-out',
        'pulse-slow': 'pulse 3s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      
      keyframes: {
        'flash-green': {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
        },
        'flash-red': {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      
      // Typography for financial data
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      
      // Backdrop blur for modern glass effect
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}