/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  // twemoji.js injects <img class="emoji"> at runtime (see src/utils/twemoji.js) —
  // that className never appears literally in any scanned source file, so
  // Tailwind's content-based tree-shaking strips its CSS rule (src/index.css)
  // unless explicitly safelisted here.
  safelist: ['emoji'],
  theme: {
    extend: {
      colors: {
        ivory:        '#faf8f5',
        parchment:    '#f3f0eb',
        linen:        '#ede8e1',
        stone:        '#e0dbd4',
        mauve:        '#b2a3b5',
        'mauve-mid':  '#9589998',
        'mauve-deep': '#7a6b7d',
        plum:         '#4e3f52',
        ink:          '#1c1917',
        charcoal:     '#44403c',
        warm:         '#78716c',
        frost:        '#a8a29e',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.2em',
        widest3: '0.3em',
      },
      boxShadow: {
        'soft':  '0 2px 20px rgba(44, 35, 40, 0.07)',
        'card':  '0 4px 32px rgba(44, 35, 40, 0.09)',
        'lift':  '0 8px 40px rgba(44, 35, 40, 0.13)',
      },
    },
  },
  plugins: [],
}
