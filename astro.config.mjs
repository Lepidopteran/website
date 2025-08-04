// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import svelte from "@astrojs/svelte";
import icon from "astro-icon";
import umami from "@yeskunall/astro-umami";

// https://astro.build/config
export default defineConfig({
	integrations: [
		icon(),
		svelte(),
		umami({ id: "9fe41389-9b36-47bd-bb4d-efebf50797cc" }),
	],
	vite: {
		plugins: [tailwindcss()],
	},

});

