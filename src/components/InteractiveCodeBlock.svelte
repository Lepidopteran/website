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

	let copied = $state(false);
	function onCopyButtonClick() {
		navigator.clipboard.writeText(code[activeIndex].snippet);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 3000);
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

{#snippet copiedButtonContent()}{/snippet}

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
	<button onclick={onCopyButtonClick} class="py-0.5 px-2 flex items-center btn btn-ghost">
		{#if copied}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				class="inline mr-1"
			>
				<g fill="none" fill-rule="evenodd">
					<path
						d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
					/>
					<path
						fill="currentColor"
						d="M21.192 5.465a1 1 0 0 1 0 1.414L9.95 18.122a1.1 1.1 0 0 1-1.556 0l-5.586-5.586a1 1 0 1 1 1.415-1.415l4.95 4.95L19.777 5.465a1 1 0 0 1 1.414 0Z"
					/>
				</g>
			</svg>
			Copied
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				class="inline mr-1 button"
			>
				<g fill="none" fill-rule="evenodd">
					<path
						d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
					/>
					<path
						fill="currentColor"
						d="M9 2a2 2 0 0 0-2 2v2h2V4h11v11h-2v2h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM4 7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm0 2h11v11H4z"
					/>
				</g>
			</svg>
			Copy
		{/if}
	</button>
</div>
<div
	class="relative rounded-b-lg border border-t-0 border-black/25 overflow-hidden"
	bind:this={codeContent}
>
	{#each code as snippet}
		{@html snippet.html}
	{/each}
</div>
