/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        primary: {
          'primary': "#6D4AB1",
          'on_primary': "#FFFFFF",
          'primary_container': "#EADDFF",
          'on_primary_container': "#25005A",
        },
        secondary: {
          'secondary': "#635B70",
          'on_secondary': "#FFFFFF",
          'secondary_container': "#E9DEF8",
          'on_secondary_container': "#1F182B",
        },
        tertiary: {
          'tertiary': "#7E525E",
          'on_tertiary': "#FFFFFF",
          'tertiary_container': "#FFD9E1",
          'on_tertiary_container': "#31101B",
        },
        surface: {
          'surface': "#FFFBFF",
          'on_surface': "#1D1B1E",
          'surface_variant': "#E7E0EB",
          'on_surface_variant': "#49454E",
        },
        error: {
          'error': "#BA1A1A",
          'on_error': "#FFFFFF",
          'error_container': "#FFDAD6",
          'on_error_container': "#410002",
        },
        black: "#111111",
        outline: "#7A757F",
      },
      fontFamily: {
        Poppins: ["Poppins"],
        Abril_Fatface: ['"Abril Fatface"', 'cursive']
      },
      fontSize: {
        'display-large': ['57px', { lineHeight: '64px', letterSpacing: '0' }],
        'display-medium': ['45px', { lineHeight: '52px', letterSpacing: '0' }],
        'display-small': ['36px', { lineHeight: '44px', letterSpacing: '0' }],
        'headline-large': ['32px', { lineHeight: '40px', letterSpacing: '0' }],
        'headline-medium': ['28px', { lineHeight: '36px', letterSpacing: '0' }],
        'headline-small': ['24px', { lineHeight: '32px', letterSpacing: '0' }],
        'title-large': ['22px', { lineHeight: '28px', letterSpacing: '0' }],
        'title-medium': ['16px', { lineHeight: '24px', letterSpacing: '0.1px' }],
        'title-small': ['14px', { lineHeight: '20px', letterSpacing: '0.1px' }],
        'label-large': ['14px', { lineHeight: '20px', letterSpacing: '0.1px' }],
        'label-medium': ['12px', { lineHeight: '16px', letterSpacing: '0.5px' }],
        'label-small': ['11px', { lineHeight: '16px', letterSpacing: '0.5px' }],
        'body-large': ['16px', { lineHeight: '24px', letterSpacing: '0.15px' }],
        'body-medium': ['14px', { lineHeight: '20px', letterSpacing: '0.25px' }],
        'body-small': ['12px', { lineHeight: '16px', letterSpacing: '0.4px' }]
      },
    },
  },
  plugins: [],
}

