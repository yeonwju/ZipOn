import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/features/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{ts,tsx,mdx}',
  ],
}

export default config
