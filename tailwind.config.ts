import type { Config } from 'tailwindcss'
const { heroui } = require('@heroui/react')

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'so-blue': {
          DEFAULT: '#007BBE',
          dark: '#005E92',
          light: '#E7F0F8',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: '#F5F7FA',
            foreground: '#1F2937',
            primary: {
              DEFAULT: '#007BBE',
              foreground: '#FFFFFF',
            },
            success: {
              DEFAULT: '#16A34A',
              foreground: '#FFFFFF',
            },
            warning: {
              DEFAULT: '#F59E0B',
              foreground: '#FFFFFF',
            },
            danger: {
              DEFAULT: '#DC2626',
              foreground: '#FFFFFF',
            },
          },
        },
      },
    }),
  ],
}

export default config
