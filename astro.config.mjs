import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  output: "static",
  integrations: [svelte(), icon()],
  adapter: netlify(),
  vite: {
    plugins: [tailwindcss()],
  },
});
