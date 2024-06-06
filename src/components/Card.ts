

interface CardClickEvent {
	card: Card;
	parts: {
		title: Element | null;
		description: Element | null;
		thumbnail: Element | null;
		extra: NodeListOf<Element>;
		content: NodeListOf<Element>;
	};
}

declare global {
	interface HTMLElementTagNameMap {
		"project-card": Card;
	}

	interface HTMLElementEventMap {
		"card-click": CustomEvent<CardClickEvent>;
	}
}

interface Layout {
	[key: string]: {
		columns: string;
		rows: string;
	};
}

const layouts: Layout = {
	horizontal: {
		columns: "1fr 2fr",
		rows: "1fr",
	},
	vertical: {
		columns: "1fr",
		rows: "1fr 2fr",
	},
};

export class Card extends HTMLElement {
	private _contentElement = document.createElement("div");
	private _contentSlot = document.createElement("slot");
	private _imageSlot = this._createSlot("image");

	constructor() {
		super();
		this.attachShadow({ mode: "open" });

		this.addEventListener("click", () => {
			const event = new CustomEvent("card-click", {
				detail: { 
					card: this,
					parts: {
						title: this.querySelector("[data-role=title]"),
						description: this.querySelector("[data-role=description]"),
						thumbnail: this.querySelector("[data-role=thumbnail]"),
						extra: this.querySelectorAll("[data-role=extra]"),
						content: this.querySelectorAll("[data-role=content]"),
					}
				},
				bubbles: true,
				composed: true,
			});

			this.dispatchEvent(event);
		});

	}

	connectedCallback() {
		const style = new CSSStyleSheet();
		style.replaceSync(Card.styles);
		this.shadowRoot?.adoptedStyleSheets.push(style);

		this._contentElement.classList.add("content");
		this._contentElement.part.add("content");

		this._contentElement.append(this._contentSlot);

		this.shadowRoot?.replaceChildren(this._imageSlot, this._contentElement);
	}

attributeChangedCallback(name: string, oldValue: string, newValue: string) {
	if (oldValue === newValue) return;

	if (name === "image") {
		const image = this.querySelector("img");
		if (image) {
			image.src = newValue;
		} else {
			const img = document.createElement("img");
			img.src = newValue;
			this._imageSlot.append(img);
		}
	} else if (name === "layout") {
		this.style.gridTemplateColumns = layouts[newValue].columns;
		this.style.gridTemplateRows = layouts[newValue].rows;
	} else if (name === "reverse") {
		if (newValue === "true" || newValue === "reverse") {
			this.shadowRoot?.replaceChildren(this._contentSlot, this._imageSlot);
		} else {
			this.shadowRoot?.replaceChildren(this._imageSlot, this._contentSlot);
		}
	}
}

	static get observedAttributes() {
		return ["image", "layout", "reverse"];
	}

	static get styles() {
		return `
			:host {
				display: block;
				display: grid;
				overflow: hidden;
			}

			.content {
				padding: 1em;
			}
		`;
	}

	private _createSlot(name: string): HTMLSlotElement {
		const slot = document.createElement("slot");
		slot.name = name;

		return slot;
	}
}

customElements.define("project-card", Card);
