export interface CodeSnippet {
	snippet: string;
	name?: string;
	language?: string;
	path?: string;
	filename?: string;
}

export interface ShikiCodeSnippet {
	name?: string;
	language?: string;
	path?: string;
	filename?: string;
	snippet: string;
	html: string;
}

export interface CodeSnippets {
	id: string;
	snippets: CodeSnippet[];
}
