/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#F8B6C8', // Pastel Pink
        primaryLight: '#FADADD', // Rose Pastel
        secondary: '#D4A373', // Gold Accent
        background: '#FFF8F2', // Cream White
        surface: '#FFFFFF',
        deepBrown: '#2C1B18',
        mutedBrown: '#8C7A77',
        // Premium Luxury Palette - Aligned with Fast Pastry
        adminBg: '#FFF8F2', // Cream White
        adminSurface: '#FFFFFF',
        adminCard: 'rgba(248, 182, 200, 0.08)', // Soft Pink overlay
        adminCardBorder: 'rgba(248, 182, 200, 0.2)',
        adminText: '#2C1B18', // Deep Brown
        adminMuted: '#8C7A77', // Muted Brown
        gold: '#D4A373',
      },
      fontFamily: {
        poppins: ["Poppins-Regular"],
        'poppins-medium': ["Poppins-Medium"],
        'poppins-semibold': ["Poppins-SemiBold"],
        'poppins-bold': ["Poppins-Bold"],
        cairo: ["Cairo-Regular"],
        'cairo-medium': ["Cairo-Medium"],
        'cairo-bold': ["Cairo-Bold"],
      },
      letterSpacing: {
        tightest: '-0.075em',
        widest: '0.25em',
      }
    },
  },
  plugins: [],
};
