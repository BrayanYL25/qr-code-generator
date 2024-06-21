/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        ilustration: 'url(/bg-illustration.svg)'
      },
      colors: {
        midnight: '#111729',
        sea: '#111729',
        graphite: '#364153',
        smoke: '#F2F5F9',
        electric: '#3662E3',
        sky: '#4e80ee33'
      },
      screens: {
        xs: '480px',
        xxs: '360px'
      },
      fontFamily: {
        outfit: ['Outfit']
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}
