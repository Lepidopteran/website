<script lang="ts">
	import type { Snippet } from "svelte";

	interface Asset {
		type: "image" | "video" | "embed" | "audio";
		altText: string;
		src: string;
	}

	interface Props {
		tags: string[];
		title: string;
		assets: Asset[];
		description: string;
		featured?: boolean;
		children?: Snippet;
		extraHeader?: Snippet;
	}

	let dialog: HTMLDivElement;
	let viewport: HTMLDivElement;

	let activeIndex = $state(0)

	function onScroll(event: Event) {
    const target = event.target as HTMLElement;
    
    if (!target) {
        console.error("Invalid event target");
        return;
    }

		const { scrollLeft, clientWidth } = target;
		const center = scrollLeft + (clientWidth / 2);

    let closestChild: HTMLElement | null = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    for (const element of target.querySelectorAll("[data-index]")) {
        const child = element as HTMLElement;
        const childCenter = child.offsetLeft + child.offsetWidth / 2;
        const distance = Math.abs(childCenter - center);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestChild = child;
        }
    }

    if (closestChild) {
        activeIndex = Number.parseInt(closestChild.id);
    }
	}

	function scrollToIndex(index: number) {
		const child = viewport.querySelector(`[data-index="${index}"]`) as HTMLElement;

		if (!child) {
			console.error("Invalid child");
		}

		viewport.scrollTo({
			left: child.offsetLeft,
			behavior: "auto",
		});
	}

	let { tags, title, description, featured, assets, children, extraHeader }: Props = $props();
</script>	

<div bind:this={dialog} class="bg-neutral-900 p-4 shadow-lg shadow-black/85 rounded-2xl border-t border-white/25 box-border">
	<div class="grid gap-x-4 md:grid-cols-2 items-center">
		<div class="flex flex-col justify-center box-border">
			<div 
				class="w-full flex justify-center items-center relative box-border"
				class:arrows-visible={assets.length > 1}>
				<div 
					bind:this={viewport} 
					onscroll={onScroll} 
					class="flex snap-mandatory snap-always scroll-smooth snap-x overflow-x-auto no-scrollbar border-t border-white/25 rounded-xl shadow-xl *:grow *:shrink-0 *:basis-full">
					{#each assets as asset, index}
						{#if asset.type === "image"}
							<img class="snap-center inline-block" loading="lazy" alt={asset.altText} id={index.toString()} data-index={index} src={asset.src}/>
						{/if}
						{#if asset.type === "video"}
							<video class="snap-center inline-block" data-index="{index}" id={index.toString()} controls>
								<source src={asset.src} />
							</video>
						{/if}
						{#if asset.type === "embed"}
							<iframe class="snap-center inline-block" loading="lazy" data-index={index} id={index.toString()} title={asset.altText} src={asset.src}></iframe>
						{/if}
						{#if asset.type === "audio"}
							<audio class="snap-center inline-block" data-index={index} id={index.toString()} controls>
								<source src={asset.src} />
							</audio>
						{/if}
					{/each}
				</div>
				<div 
					class="max-md:hidden absolute w-full no-js-hidden flex gap-2 items-center justify-between font-bold pointer-events-none"
					class:hidden={assets.length <= 1}>
					<button 
						class="rounded-full btn btn-accent shadow-accent-300 p-0 size-8 pointer-events-auto" 
						onclick={() => scrollToIndex((activeIndex - 1 + assets.length) % assets.length)}>
						<span class="-rotate-90 inline-block">^</span>
					</button>
					<button 
						class="rounded-full btn btn-accent shadow-accent-300 p-0 size-8 pointer-events-auto" 
						onclick={() => scrollToIndex((activeIndex + 1) % assets.length)}>
						<span class="rotate-90 inline-block">^</span>
					</button>
				</div>
			</div>
			<div 
				class="w-full bottom-0 left-0 flex gap-2 items-center justify-center bg-neutral-900/50 px-6 py-3 no-js-hidden"
				class:hidden={assets.length <= 1}
			>
				{#each assets as _, index}
					<button 
						class="rounded-full bg-neutral-500/50 size-2 shadow-inner shadow-neutral-300"  
						class:active={activeIndex === index}
						onclick={() => scrollToIndex(index)}>
					</button>
				{/each}
			</div>
		</div>
		<div class="flex flex-col justify-center gap-2">
			<div class="font-bold text-2xl">
				{title} {#if featured}<span class="ml-1">★</span>{/if} {@render extraHeader?.()} 
			</div>
			{@render children?.()}
			<div class="flex gap-2 flex-wrap relative py-2 bg-neutral-900 rounded-lg">
				{#each tags as tag}
					<span class="bg-accent-500/25 text-accent-100 shadow shadow-accent-900/25 border-t border-accent-100/25 opacity-80 select-none px-2 rounded-full">#{tag}</span>
				{/each}
			</div>
			{#if description}
				<div class="text-base bg-neutral-800 rounded-lg border border-black/10 border-t-neutral-700 shadow-lg shadow-black/50 overflow-hidden">
					<div class="font-bold text-lg px-2 opacity-50">Description</div>
					<div class="p-2 h-24 overflow-y-auto bg-neutral-900">
						{description}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
.no-scrollbar::-webkit-scrollbar {
	display: none;
}

.active {
	@apply bg-accent-500/50 shadow-accent-300 size-3;
}

.disabled {
	@apply opacity-50 cursor-not-allowed;
}

.arrows-visible {
	@apply md:px-12;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
	-ms-overflow-style: none;  /* IE and Edge */
	scrollbar-width: none;  /* Firefox */
}
</style>
