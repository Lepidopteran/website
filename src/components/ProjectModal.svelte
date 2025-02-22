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

  let activeIndex = $state(0);

  function onScroll(event: Event) {
    const target = event.target as HTMLElement;

    if (!target) {
      console.error("Invalid event target");
      return;
    }

    const { scrollLeft, clientWidth } = target;
    const center = scrollLeft + clientWidth / 2;

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
    const child = viewport.querySelector(
      `[data-index="${index}"]`,
    ) as HTMLElement;

    if (!child) {
      console.error("Invalid child");
    }

    viewport.scrollTo({
      left: child.offsetLeft,
      behavior: "auto",
    });
  }

  const {
    tags,
    title,
    description,
    featured,
    assets,
    children,
    extraHeader,
  }: Props = $props();
</script>

<div
  bind:this={dialog}
  class="bg-neutral-800/50 backdrop-blur p-4 shadow-lg overflow-hidden shadow-black/25 inset-shadow-sm inset-shadow-primary-50/5 rounded-2xl border-t border-white/25 box-border relative"
>
  <div class="grid gap-x-4 md:grid-cols-2 items-center">
    <div class="flex flex-col justify-center box-border">
      <div
        class="w-full flex justify-center items-center relative box-border"
        class:arrows-visible={assets.length > 1}
      >
        <div
          bind:this={viewport}
          onscroll={onScroll}
          class="flex snap-mandatory snap-always scroll-smooth snap-x overflow-x-auto no-scrollbar border-t border-white/25 rounded-xl shadow-lg *:grow *:shrink-0 *:basis-full"
        >
          {#each assets as asset, index}
            {#if asset.type === "image"}
              <img
                class="snap-center inline-block"
                loading="lazy"
                alt={asset.altText}
                id={index.toString()}
                data-index={index}
                src={asset.src}
              />
            {/if}
            {#if asset.type === "video"}
              <video
                class="snap-center inline-block"
                data-index={index}
                id={index.toString()}
                controls
              >
                <source src={asset.src} />
              </video>
            {/if}
            {#if asset.type === "embed"}
              <iframe
                class="snap-center inline-block"
                loading="lazy"
                data-index={index}
                id={index.toString()}
                title={asset.altText}
                src={asset.src}
              ></iframe>
            {/if}
            {#if asset.type === "audio"}
              <audio
                class="snap-center inline-block"
                data-index={index}
                id={index.toString()}
                controls
              >
                <source src={asset.src} />
              </audio>
            {/if}
          {/each}
        </div>
        <div
          class="max-md:hidden absolute w-full no-js-hidden flex gap-2 items-center justify-between font-bold pointer-events-none"
          class:hidden={assets.length <= 1}
        >
          <button
            class="rounded-full btn btn-accent shadow-accent-300 text-accent-200 flex justify-center items-center p-0 size-8 pointer-events-auto"
            onclick={() =>
              scrollToIndex((activeIndex - 1 + assets.length) % assets.length)}
          >
            {@render buttonIcon("left")}
          </button>
          <button
            class="rounded-full btn btn-accent shadow-accent-300 text-accent-200 flex justify-center items-center p-0 size-8 pointer-events-auto"
            onclick={() => scrollToIndex((activeIndex + 1) % assets.length)}
          >
            {@render buttonIcon("right")}
          </button>
        </div>
      </div>
      <div
        class="w-full bottom-0 left-0 flex gap-2 items-center justify-center px-6 py-3 no-js-hidden"
        class:hidden={assets.length <= 1}
      >
        {#each assets as _, index}
          <button
            class="rounded-full bg-neutral-500/50 size-2 shadow-inner shadow-neutral-300 cursor-pointer"
            class:active={activeIndex === index}
						aria-labelledby={index.toString()}
            onclick={() => scrollToIndex(index)}
          >
          </button>
        {/each}
      </div>
    </div>
    <div class="flex flex-col justify-center gap-2">
      <div class="font-bold text-2xl">
        {title}
        {#if featured}<span class="ml-1">★</span>{/if}
        {@render extraHeader?.()}
      </div>
      {@render children?.()}
      <div class="flex gap-2 flex-wrap relative p-2 bg-neutral-900 rounded-lg inset-shadow-sm inset-shadow-black/25">
        {#each tags as tag}
          <span
            class="bg-accent-500/25 text-accent-100 shadow shadow-accent-900/25 border-t border-accent-100/25 opacity-80 select-none px-2 rounded-full"
            >#{tag}</span
          >
        {/each}
      </div>
      {#if description}
        <div
          class="text-base bg-neutral-800 rounded-lg border border-black/10 border-t-neutral-700 shadow shadow-black/25 overflow-hidden"
        >
          <div class="font-bold text-lg px-2 opacity-50">Description</div>
          <div class="p-2 h-24 overflow-y-auto bg-neutral-900">
            {description}
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

{#snippet buttonIcon(direction: "left" | "right" = "right")}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
		style="transform: rotate({direction === 'left' ? -90 : 90}deg)"
		aria-label={`${direction === "left" ? "Previous" : "Next"} Slide`}
		class="inline"
  >
    <g fill="none">
      <path
        d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
      />
      <path
        fill="currentColor"
        d="M12.707 3.636a1 1 0 0 0-1.414 0L5.636 9.293a1 1 0 1 0 1.414 1.414L11 6.757V20a1 1 0 1 0 2 0V6.757l3.95 3.95a1 1 0 0 0 1.414-1.414z"
      />
    </g>
  </svg>
{/snippet}

<style>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .active {
    --size: calc(var(--spacing) * 3);
    background-color: color-mix(
      in oklab,
      var(--color-accent-500) 50%,
      transparent
    );
    width: var(--size);
    height: var(--size);
  }

  .arrows-visible {
    padding-left: calc(var(--spacing) * 12);
    padding-right: calc(var(--spacing) * 12);
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  .no-scrollbar {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
</style>
