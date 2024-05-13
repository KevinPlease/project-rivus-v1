module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: '0px',      // Extra small devices (MUI: xs)
        sm: '600px',    // Small devices (MUI: sm)
        md: '960px',    // Medium devices (MUI: md)
        lg: '1200px',   // Large devices (MUI: lg)
        xl: '1920px',   // Extra large devices (MUI: xl)
      },
    },
  },
  plugins: [],
};
