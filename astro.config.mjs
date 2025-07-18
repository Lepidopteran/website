import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";
import netlify from "@astrojs/netlify";
import umami from "@yeskunall/astro-umami";

// https://astro.build/config
export default defineConfig({
	output: "static",
	integrations: [
		svelte(),
		icon(),
		umami({
			id: "9fe41380-9b36-47bd-bb4d-efebf50797cc",
		}),
	],
	adapter: netlify(),
	vite: {
		plugins: [tailwindcss()],
	},
});
