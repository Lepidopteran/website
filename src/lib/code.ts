export interface CodeSnippet {
	snippet: string;
	name?: string;
	path?: string;
	filename?: string;
}

export interface CodeSnippets {
	id: string;
	snippets: CodeSnippet[];
}
