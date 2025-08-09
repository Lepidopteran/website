<script lang="ts">
	import type { ShikiCodeSnippet } from "../lib/code";

	interface Props {
		code: ShikiCodeSnippet[];
		defaultSelectedIndex?: number;
		lang?: string;
	}

	let codeContent: HTMLDivElement;
	let activeIndex: number = $state(0);
	let { code, lang }: Props = $props();

	const uid = Math.random().toString(36).slice(2, 9); // e.g. "k3q9z8a"

	function onKeydown(event: KeyboardEvent, index: number) {
		let newIndex = index;
		if (event.key === "ArrowRight") newIndex = (index + 1) % code.length;
		if (event.key === "ArrowLeft")
			newIndex = (index - 1 + code.length) % code.length;
		if (event.key === "Home") newIndex = 0;
		if (event.key === "End") newIndex = code.length - 1;

		if (newIndex !== index) {
			activeIndex = newIndex;
			document.getElementById(`${uid}-tab-${newIndex}`)?.focus();
		}
	}

	$effect(() => {
		for (const [index, child] of Array.from(codeContent.children).entries()) {
			child.setAttribute("data-index", index.toString());
			child.setAttribute("role", "tabpanel");
			child.id = `${uid}-panel-${index}`;
			child.setAttribute("tabindex", "0");
			child.setAttribute("aria-labelledby", `${uid}-tab-${index}`);
		}

		if (code.length > 1) {
			const selected = codeContent.querySelector(
				`[data-index="${activeIndex}"]`,
			) as HTMLElement;

			for (const child of Array.from(codeContent.children)) {
				child.setAttribute("hidden", "");
			}

			if (selected) {
				selected.removeAttribute("hidden");
			}
		}
	});
</script>

{#if code.length > 1}
	<div role="tablist" class="flex overflow-x-auto">
		{#each code as snippet, index}
			<button
				role="tab"
				data-index={index}
				class={`py-0.5 px-1 flex items-center bg-neutral-800 rounded-t-lg border border-b-0 inset-shadow-sm inset-shadow-neutral-700/75 shadow-md border-black/25 cursor-pointer ${activeIndex === index ? "text-neutral-300 font-bold" : "text-neutral-500"}`}
				id={`${uid}-tab-${index}`}
				class:selected={activeIndex === index}
				tabindex={activeIndex === index ? 0 : -1}
				aria-selected={activeIndex === index}
				aria-controls={`${uid}-panel-${index}`}
				onkeydown={(event) => onKeydown(event, index)}
				onclick={() => (activeIndex = index)}
			>
				{#if snippet.name}
					<span class="px-1">{snippet.name}</span>
				{:else}
					<span class="px-1">{`Snippet ${index + 1}`}</span>
				{/if}
			</button>
		{/each}
	</div>
{/if}
<div
	class={`flex justify-between items-center inset-shadow-sm inset-shadow-neutral-700/75 shadow-md border border-b-0 border-black/25 shadow-black/25 rounded-t-lg ${code.length > 1 ? "rounded-tl-none" : ""}`}
>
	<div class="py-0.5 px-2 flex items-center text-neutral-500">
		{#if code[activeIndex]?.language}
			<span class="px-1">{code[activeIndex].language}</span>
		{:else}
			<span class="px-1">{lang}</span>
		{/if}
	</div>
</div>
<div
	class="relative rounded-b-lg border border-t-0 border-black/25 overflow-hidden"
	bind:this={codeContent}
>
	{#each code as snippet}
		{@html snippet.html}
	{/each}
</div>
