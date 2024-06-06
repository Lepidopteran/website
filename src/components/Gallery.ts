export class Gallery extends HTMLElement {
	private _itemSlot: HTMLSlotElement = document.createElement("slot");
	private _previewer: HTMLDivElement = document.createElement("div");
	private _itemList: HTMLDivElement = document.createElement("div");
	private _items: NodeListOf<Element> = this.querySelectorAll('[slot="item"]');
	private _eventListeners = new Map<Element, EventListener>();
	private _activeIndex = -1;

	constructor() {
		super();

		this.attachShadow({ mode: "open" });
		this._itemSlot.name = "item";
		this._previewer.className = "main-preview";

		this._itemList.className = "item-list";

		Object.assign(this._itemList.style, {
			display: "flex",
			flexDirection: "column",
			gap: "1rem",
			overflow: "auto",
			padding: "1rem",
			gridArea: "item",
		})

		this._itemSlot.addEventListener("slotchange", this._handleItemSlotChange.bind(this));

		const sheet = new CSSStyleSheet();
		sheet.replaceSync(Gallery.styles);

		this.shadowRoot?.adoptedStyleSheets.push(sheet);
	}

	render() {
		if (!this.shadowRoot) throw new Error("No shadowRoot");
		
		const previewContainer = document.createElement("div"); 
		const buttonContainer = document.createElement("div");
		const extraButtonSlot = document.createElement("slot");
		const nextButton = document.createElement("button");
		const nextButtonSlot = document.createElement("slot");
		const prevButton = document.createElement("button");
		const prevButtonSlot = document.createElement("slot");

		Object.assign(previewContainer.style, {
			gridArea: "preview",
			width: "100%",
			height: "100%",
		});


		Object.assign(prevButtonSlot, {
			name: "prev",
			textContent: "Prev",
		});

		Object.assign(nextButtonSlot, {
			name: "next",
			textContent: "Next",
		});

		prevButton.append(prevButtonSlot);
		nextButton.append(nextButtonSlot);

		prevButton.onclick = this.previous.bind(this);
		nextButton.onclick = this.next.bind(this);

		Object.assign(buttonContainer.style, {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			width: "100%",
		});

		extraButtonSlot.name = "extra-button";

		buttonContainer.append(
			prevButton,
			extraButtonSlot,
			nextButton,
		);

		this._itemList.appendChild(this._itemSlot);

		previewContainer.append(
			this._previewer,
			buttonContainer,
		);

		this.shadowRoot.append(
			previewContainer,
			this._itemList,
			...this._createExtraSlots(),
		);
	}

	connectedCallback() {
		this.render();

		if (this._items.length > 0 && this._activeIndex === -1) {
			this._selectItem(0);
		}
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (oldValue === newValue) return;

		if (name === "list-direction") {
			if (newValue === "horizontal") {
				this._itemList.style.flexDirection = "row";
			} else {
				this._itemList.style.flexDirection = "column";
			}
		}

		if (name === "list-wrap") {
			if (newValue === "true" || newValue === "wrap" || this.hasAttribute("list-wrap")) {
				this._itemList.style.flexWrap = "wrap";
			} else {
				this._itemList.style.flexWrap = "nowrap";
			}
		}
	}

	previous() {
		if (this._activeIndex === 0) return;
		this._selectItem(this._activeIndex - 1);
	}

	next() {
		if (this._activeIndex === this._items.length - 1) return;
		this._selectItem(this._activeIndex + 1);
	}

	private _createExtraSlots(): HTMLElement[] {
		const extraSlots = ["header", "extra-top", "extra-left", "extra-right", "extra-bottom", "footer", "extra-button"];
		const elements = []

		for (const slotName of extraSlots) {
			const slot = document.createElement("slot");
			const container = document.createElement("div");
			
			container.style.gridArea = slotName;
			slot.name = slotName;
			container.append(slot);
			elements.push(container);
		}

		return elements;
	}

	private _selectItem(index: number) {
		if (this._activeIndex !== -1) {
			this._items[this._activeIndex].removeAttribute("active");
		}

		this._activeIndex = index;

		const item = this._items[index];
		if (!item) return;

		const clone = item.cloneNode(true) as HTMLElement;

		item.setAttribute("active", "");
		item.scrollIntoView({ behavior: "smooth", block: "center" });
	
		this._previewer.replaceChildren(clone);
	}

	private _handleItemClick(e: Event) {
		const target = e.target as HTMLElement;
		const index = Array.from(this._items).indexOf(target);

		this._selectItem(index);
	}


	private _handleItemSlotChange() {
		this._items = this.querySelectorAll('[slot="item"]');

		for (const item of this._items) {
			if (!this._eventListeners.has(item)) {
				const listener = this._handleItemClick.bind(this);
				item.addEventListener("click", listener);
				this._eventListeners.set(item, listener);
			}
		}
	}

	static get observedAttributes() {
		return ["list-direction", "list-wrap"];
	}

	static get styles() {
		return `
			:host {
				--carousel-item-size: 6rem;
				display: grid;
				grid-template-areas: 
					"header header header header header"
					"extra-top extra-top extra-top extra-top extra-top"
					"extra-left preview preview item extra-right"
					"extra-left preview preview item extra-right"
					"extra-bottom extra-bottom extra-bottom extra-bottom extra-bottom"
					"footer footer footer footer footer";
				height: 100%;
				width: 100%;
				gap: 1rem;
				position: relative;
			}

			::slotted([slot="item"]) {
				overflow: hidden;
				object-fit: cover;
				cursor: pointer;
				user-select: none;
				border-radius: 0.5rem;
				display: block;
				box-sizing: border-box;
				border: 1px solid #ccc;
				width: var(--carousel-item-width, var(--carousel-item-size ));
				height: var(--carousel-item-height, var(--carousel-item-size ));
			}

			::slotted([slot="item"]:hover) {
				border-color: #999;
			}

			::slotted([slot="item"][active]) {
				border-color: #000;
			}

			.main-preview {
				display: flex;
				justify-content: center;
				align-items: center;
				object-fit: contain;
				height: 100%;
				width: 100%;
				overflow: hidden;
			}

		`;
	}
}

customElements.define("project-gallery", Gallery);
