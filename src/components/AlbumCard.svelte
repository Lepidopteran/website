<script lang="ts">
  import { onMount } from "svelte";

  let Loading = true;

  export let className: string = "";

  export let range: Props["range"] = "this_week";
  type musicData = {
    artistName: string;
    albumId: string;
    albumName: string;
    albumCoverUrl: string;
  };



  interface GroupPayload {
    count: number;
    from_ts: number;
    last_updated: number;
    offset: number;
    range: string;
    release_groups: ReleaseGroup[];
    to_ts: number;
    total_release_group_count: number;
    user_id: string;
  }

  interface ReleaseGroup {
    artist_mbids: string[];
    artist_name: string;
    artists: Artist[];
    caa_id: number;
    caa_release_mbid: string;
    listen_count: number;
    release_group_mbid: string;
    release_group_name: string;
  }

  interface Artist {
    artist_credit_name: string;
    artist_mbid: string;
    join_phrase: string;
  }

  interface ImagePayload {
    images: Image[];
    release: string;
  }

  interface Image {
    approved: boolean;
    back: boolean;
    comment: string;
    edit: number;
    front: boolean;
    id: number;
    image: string;
    thumbnails: Thumbnails;
    types: string[];
  }

  interface Thumbnails {
    "1200": string;
    "250": string;
    "500": string;
    large: string;
    small: string;
  }

  let data: musicData = {
    artistName: "Loading...",
    albumId: "",
    albumName: "",
    albumCoverUrl: "",
  };

  interface Props {
    range?:
      | "week"
      | "month"
      | "quarter"
      | "half_yearly"
      | "year"
      | "all_time"
      | "this_week"
      | "this_month"
      | "this_year";
  }

  async function getAlbumCoverArt(
    albumId: string,
    size: "250" | "500" = "500",
  ) {
    const response = await fetch(
      `https://coverartarchive.org/release-group/${albumId}`,
    );

    const jsonData = await response.json();

    const payload = jsonData as ImagePayload;
    const image = payload.images.find((img) => img.front) as Image;
    return image.thumbnails[size];
  }

  async function getTopAlbum() {
    const response = await fetch(
      `https://api.listenbrainz.org/1/stats/user/Crowd3994/release-groups?count=1&range=${range}`,
    );
    const jsonData = await response.json();
    const payload = jsonData.payload as GroupPayload;
    console.log(jsonData);
    const release = payload.release_groups[0] as ReleaseGroup;
    const data: musicData = {
      artistName: release.artist_name,
      albumId: release.caa_release_mbid,
      albumName: release.release_group_name,
      albumCoverUrl: await getAlbumCoverArt(release.release_group_mbid),
    };
    return data;
  }

  onMount(async () => {
    data = await getTopAlbum();
    Loading = false;
  });
</script>

<div
  class="rounded-lg overflow-hidden shadow-md border bg-neutral-900 border-neutral-600 p-3 flex flex-col gap-3 {className}"
>
  <div class="flex max-sm:flex-col gap-2 md:gap-4">
    {#if Loading}
      <div
        class="animate-pulse sm:h-28 sm:w-28 md:w-40 md:h-40 rounded-lg bg-neutral-800 aspect-square row-span-full"
      ></div>
      <div class="mt-3 space-y-2">
        <div class="animate-pulse h-6 w-40 bg-neutral-800 rounded-md"></div>
        <div class="animate-pulse h-5 w-24 bg-neutral-800 rounded-md"></div>
      </div>
    {:else}
      <img
        class="row-span-full w-full sm:h-28 sm:w-28 md:w-40 md:h-40 object-fill aspect-square rounded-lg"
        loading="lazy"
        src={data.albumCoverUrl}
        alt={data.albumName + " Album Cover"}
      />
      <div class="mt-3">
        <div class="text-lg">{data.albumName}</div>
        <div class="text-base">
          by <span class="font-bold">{data.artistName}</span>
        </div>
      </div>
    {/if}
  </div>
  <span class="text-xs opacity-50">
    Provided by <a class="opacity-50 underline" href="https://listenbrainz.org"
      >Listen Brainz</a
    >
    &
    <a class="opacity-50 underline" href="https://coverartarchive.org"
      >Cover Art Archive</a
    >
  </span>
</div>

