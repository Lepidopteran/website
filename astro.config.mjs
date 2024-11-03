import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";
import icon from "astro-icon";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [tailwind(), svelte(), icon()],
  adapter: netlify()
});
