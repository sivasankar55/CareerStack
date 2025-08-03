import daisyui from 'daisyui'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
		themes: [
			{
				linkedin: {
					primary: "#FFFFFF", // White
					secondary: "#FFFFFF", // White
					accent: "#FFFFFF", // White
					neutral: "#FFFFFF", // White
					"base-100": "#FFFFFF", // White (background)
					info: "#FFFFFF", // White
					success: "#FFFFFF", // White
					warning: "#FFFFFF", // White
					error: "#FFFFFF", // White
				},
			},
		],
	},
}