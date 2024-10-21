import defaultTheme from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors";
import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,css}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Variable"', "Inter", ...defaultTheme.fontFamily.sans],
        jetbrains: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
        oswald: ["'Oswald Variable'" ,'Oswald', ...defaultTheme.fontFamily.sans],
        redhat: ['"Red Hat Display Variable"' ,'"Red Hat Display"', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5%)' },
        }
      },
			colors: {
				primary: colors.purple ,
				secondary: colors.green,
				accent: colors.indigo,
			}
    }, 
  },
  plugins: [
    plugin(({ addUtilities, theme }) => {
      const colorUtilities = {};
      const colors = theme('colors');

      const baseGlowUtility = {
        '.glow': {
          boxShadow: '0 0 10px var(--glow-color, #fff)',
        },
      };

      for (const colorName of Object.keys(colors)) {
        const value = colors[colorName];
        if (typeof value === 'object') {
          for (const shade of Object.keys(value)) {
            const className = `.glow-${colorName}-${shade}`;
            const colorValue = value[shade];
            colorUtilities[className] = {
              '--glow-color': colorValue,
            };
          }
        } else {
          const className = `.set-glow-${colorName}`;
          colorUtilities[className] = {
            '--glow-color': value,
          };
        }
      }

      addUtilities(baseGlowUtility, ['responsive', 'hover']);
      addUtilities(colorUtilities, ['responsive', 'hover']);
    }),
  ],
};
