<script lang="ts">
	type FilterFunction = (project: ProjectData) => boolean;

	interface ProjectData {
		id: string;
		assisted: boolean;
		commercial: boolean;
		inProgress: boolean;
		title: string;
		description: string;
		created: Date;
		thumbnail?: string;
		sourcecode?: string;
		released?: Date;
		tags?: string[];
		category?:
			| "library"
			| "component"
			| "software"
			| "website"
			| "game"
			| "mod"
			| "plugin"
			| "other";
	}

	interface Props {
		projects: ProjectData[];
	}

	let { projects }: Props = $props();
	let groupedProjectsByYear = projects.reduce(
		(acc, project) => {
			const year = project.created.getFullYear();
			if (!acc[year]) acc[year] = [];
			acc[year].push(project);
			return acc;
		},
		{} as Record<number, ProjectData[]>,
	);
</script>

<div>
	{#each Object.entries(groupedProjectsByYear).reverse() as [year, projects]}
		<div class="sticky top-0 my-2">
			<div class="font-bold">{year}</div>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-2">
			{#each projects as project}
				<a class="hover:scale-[101%] transition" href="/projects/{project.id}">
					<div class="card bg-neutral-800/50 backdrop-blur-md h-full">
						<div class="relative">
							{#if project.thumbnail}
								<img
									class="w-full h-48 object-top object-cover"
									src={project.thumbnail}
									alt=""
								/>
							{/if}
							{#if project.commercial || project.assisted}
								<div
									class="absolute bottom-0 left-0 p-1 bg-neutral-900/75 border-t border-r border-white/25 backdrop-blur-xs rounded-tr-lg flex gap-1"
								>
									{#if project.commercial}
										<div class="badge flex gap-1 justify-center items-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="16"
												height="16"
												viewBox="0 0 24 24"
											>
												<g fill="none">
													<path d="M0 0h24v24H0z" />
													<path
														fill="currentColor"
														d="M13 4a1 1 0 1 0-2 0v1H9.5a4 4 0 1 0 0 8h5a2 2 0 1 1 0 4H7a1 1 0 1 0 0 2h4v1a1 1 0 1 0 2 0v-1h1.5a4 4 0 0 0 0-8h-5a2 2 0 1 1 0-4H17a1 1 0 1 0 0-2h-4z"
													/>
												</g>
											</svg>
											Commercial
										</div>
									{/if}
									{#if project.assisted}
										<div class="badge flex gap-1 justify-center items-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="16"
												height="16"
												viewBox="0 0 24 24"
											>
												<g fill="none">
													<path
														d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"
													/>
													<path
														fill="currentColor"
														d="M12 12c1.873 0 3.57.62 4.815 1.487c1.183.825 2.185 2.051 2.185 3.37c0 .724-.309 1.324-.796 1.77c-.458.421-1.056.694-1.672.88C15.301 19.88 13.68 20 12 20s-3.301-.12-4.532-.493c-.616-.186-1.214-.459-1.673-.88C5.31 18.182 5 17.582 5 16.858c0-1.319 1.002-2.545 2.185-3.37C8.43 12.62 10.127 12 12 12m7 1c1.044 0 1.992.345 2.693.833c.64.447 1.307 1.19 1.307 2.096c0 .517-.225.946-.56 1.253c-.306.281-.684.446-1.029.55c-.47.142-1.025.215-1.601.247c.122-.345.19-.72.19-1.122c0-1.535-.959-2.839-2.032-3.744A4.8 4.8 0 0 1 19 13M5 13q.537.002 1.032.113C4.96 14.018 4 15.322 4 16.857c0 .402.068.777.19 1.122c-.576-.032-1.13-.105-1.601-.247c-.345-.104-.723-.269-1.03-.55A1.68 1.68 0 0 1 1 15.93c0-.905.666-1.649 1.307-2.096A4.76 4.76 0 0 1 5 13m13.5-6a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5m-13 0a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5M12 3a4 4 0 1 1 0 8a4 4 0 0 1 0-8"
													/>
												</g>
											</svg>
											Team
										</div>
									{/if}
								</div>
							{/if}
						</div>
						<div class="p-4 space-y-2">
							<div class="font-bold">{project.title}</div>
							<div class="text-sm text-neutral-400 line-clamp-2">
								{project.description}
							</div>
							<div class="flex gap-2">
								{#if project.category}
									<div class="badge badge-secondary capitalize">
										{project.category}
									</div>
								{/if}
								{#if project.tags}
									{#each project.tags as tag, index}
										{#if index < 3}
											<div
												class={`badge badge-accent capitalize ${tag.length >= 5 && "max-lg:last:hidden"}`}
											>
												{tag}
											</div>
										{/if}
									{/each}
								{/if}
							</div>
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/each}
</div>
