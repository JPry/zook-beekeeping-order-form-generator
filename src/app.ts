import './styles.css';
import './components';
import type { BeeItemRow, CatalogItem } from './components';

type Section = {
	section: string;
	items: CatalogItem[];
};

type PersistedItem = {
	qty: number;
	variant: number;
};

type PersistedState = {
	customer?: { name?: string; date?: string };
	items?: PersistedItem[];
	sections?: boolean[];
};

const TAX_RATE = 0.06;
const STORAGE_KEY = 'bee-order-state-v1';

const CATALOG: Section[] = [
	{ section: '10 Frame Items', items: [
		{ name: 'Deep Super 9 5/8', variants: [{ label: 'Unassembled', price: 13.50 }, { label: 'Assembled', price: 16.50 }] },
		{ name: 'Medium Super 6 5/8', variants: [{ label: 'Unassembled', price: 11.50 }, { label: 'Assembled', price: 14.00 }] },
		{ name: 'Shallow Super 5 5/8', variants: [{ label: 'Unassembled', price: 11.00 }, { label: 'Assembled', price: 13.50 }] },
		{ name: 'Vented Super 3"', variants: [{ label: 'Unassembled', price: 6.50 }, { label: 'Assembled', price: 9.00 }] },
		{ name: 'Telescoping Top', price: 17.00 },
		{ name: 'Migratory Top (PVC)', price: 12.00 },
		{ name: 'Inner Cover', price: 8.00 },
		{ nameTemplate: '{variant} Bottom Board', variants: [{ label: 'Solid', price: 11.00 }, { label: 'Screened', price: 11.00 }] },
		{ name: 'PVC Solid Bottom Board', price: 13.00 },
		{ name: 'F Style Screened Bottom Board', price: 16.50 },
		{ name: 'Stand (10" Legs)', price: 19.00 },
	]},
	{ section: '8 Frame Items', items: [
		{ name: 'Deep Super 9 5/8', variants: [{ label: 'Unassembled', price: 13.00 }, { label: 'Assembled', price: 16.00 }] },
		{ name: 'Medium Super 6 5/8', variants: [{ label: 'Unassembled', price: 11.00 }, { label: 'Assembled', price: 13.50 }] },
		{ name: 'Vented Super 3"', variants: [{ label: 'Unassembled', price: 6.50 }, { label: 'Assembled', price: 9.00 }] },
		{ name: 'Telescoping Top', price: 17.00 },
		{ name: 'Migratory Top (PVC)', price: 12.00 },
		{ name: 'Inner Cover', price: 8.00 },
		{ nameTemplate: '{variant} Bottom Board', variants: [{ label: 'Solid', price: 11.00 }, { label: 'Screened', price: 11.00 }] },
		{ name: 'PVC Solid Bottom Board', price: 12.00 },
		{ name: 'Stand (10" Legs)', price: 18.00 },
	]},
	{ section: '5 Frame Items', items: [
		{ name: 'Deep Nuc', variants: [{ label: 'Unassembled', price: 11.00 }, { label: 'Assembled', price: 14.00 }] },
		{ name: 'Medium Nuc', variants: [{ label: 'Unassembled', price: 9.50 }, { label: 'Assembled', price: 12.50 }] },
		{ name: 'Telescoping Top', price: 13.50 },
		{ name: 'Migratory Top (PVC)', price: 9.50 },
		{ name: 'Inner Cover', price: 6.00 },
		{ nameTemplate: '{variant} Bottom Board', variants: [{ label: 'Solid', price: 9.00 }, { label: 'Screened', price: 9.00 }] },
		{ name: 'PVC Solid Bottom Board', price: 10.00 },
	]},
	{ section: 'Queen Rearing Supplies', items: [
		{ name: '2 Frame Mating Nuc', price: 21.00 },
		{ name: '3 Compartment Queen Castle', price: 41.00 },
		{ name: 'Timing Box', price: 45.00 },
		{ name: 'Grafting Frame', price: 7.00 },
		{ name: 'Grafting Perch', price: 20.00 },
		{ name: 'Grafting Tool Chinese — 100 pc pack', price: 75.00 },
		{ name: 'Grafting Tool Chinese — each (1–99)', price: 1.00 },
		{ name: 'Queen Marking Pen', price: 5.00 },
		{ name: 'JZs BZs Cell Cups — 100 pack', price: 11.00 },
		{ name: 'JZs BZs Cell Cups — 1000 pack', price: 100.00 },
	]},
	{ section: 'Loaded Boxes With Frames & Acorn Heavy Wax Foundation', items: [
		{ name: '10 Frame Deep', price: 47.00 },
		{ name: '10 Frame Medium', price: 41.00 },
		{ name: '8 Frame Deep', price: 40.40 },
		{ name: '8 Frame Medium', price: 35.10 },
	]},
	{ section: 'Complete & Starter Hives', items: [
		{ name: 'Complete Hive (10 Frame, No Paint) — 2 Med Loaded, 2 Deep Loaded, Top, Inner, Bottom, Closer, Reducer', price: 204.50 },
		{ name: 'Complete Hive (8 Frame, No Paint)', price: 189.60 },
		{ name: 'Starter Hive (10 Frame, No Paint) — 1 Deep Loaded, Top, Inner, Bottom, Closer, Reducer', price: 85.00 },
		{ name: 'Starter Hive (8 Frame, No Paint)', price: 78.45 },
		{ name: 'Complete Deep Nuc — Not Loaded, Top, Inner, Bottom', price: 43.50 },
		{ name: 'Complete Medium Nuc — Not Loaded, Top, Inner, Bottom', price: 42.00 },
		{ name: 'Resource Hive', variants: [{ label: 'Unassembled', price: 61.00 }, { label: 'Assembled', price: 70.00 }] },
	]},
	{ section: 'Honey Harvesting', items: [
		{ name: '16oz Honey Robber', price: 23.00 },
		{ name: '32oz Honey Robber', price: 38.50 },
		{ name: '16oz Honey Bee Gone', price: 21.00 },
		{ name: '8oz Fischers Bee Quick', price: 16.00 },
		{ name: 'Honey Bucket', price: 15.00 },
		{ name: 'SS Double Strainer', price: 25.00 },
		{ name: 'Uncapping Roller', price: 8.00 },
		{ name: 'Uncapping Fork Economy', price: 5.00 },
		{ name: 'Uncapping Fork', price: 10.00 },
		{ name: 'Serrated Uncapping Knife', price: 5.00 },
	]},
	{ section: 'Mite Treatments', items: [
		{ name: 'Oxalic Acid 16 ounces', price: 15.50 },
	]},
	{ section: 'Feeders', items: [
		{ name: 'Entrance Feeder', price: 3.00 },
		{ name: '1 1/2 Gallon Frame Feeder', price: 10.00 },
		{ name: 'Feeder Lid', price: 1.00 },
		{ name: '8 or 10 Frame Top Feeder (Plastic Liner)', price: 25.00 },
	]},
	{ section: 'Beekeeping Tools & Accessories', items: [
		{ name: 'Ventilated Jacket Round Hat', price: 80.00 },
		{ name: 'Ventilated Suit Round Hat', price: 100.00 },
		{ name: 'Kids Suits', price: 70.00 },
		{ name: 'Gloves (All Sizes)', price: 10.00 },
		{ name: '4 x 8 Smoker', price: 20.00 },
		{ name: '4 x 10 Smoker', price: 26.00 },
		{ name: 'Replacement Bellow', price: 11.00 },
		{ name: 'Hive Tool Economy', price: 6.00 },
		{ name: 'J Hook Hive Tool', price: 7.00 },
		{ name: 'Kent Hive Tool', price: 10.00 },
		{ name: 'Long Hive Tool', price: 10.00 },
		{ name: 'Bee Brush', price: 5.00 },
		{ name: 'Swarm Commander', price: 29.00 },
		{ name: 'Swarm Commander Gel', price: 20.00 },
		{ name: 'Swarm Science', price: 25.00 },
		{ name: 'Lemongrass Oil', price: 5.00 },
		{ name: 'Frame Perch', price: 10.00 },
	]},
	{ section: 'Foundation Only — Wax', items: [
		{ name: 'Deep Wired — each', price: 1.40 },
		{ name: 'Deep Wired — 1/2 pack', price: 120.00 },
		{ name: 'Deep Wired — 25lb pack (~175 sheets)', price: 240.00 },
		{ name: 'Medium Wired — each', price: 1.10 },
		{ name: 'Medium Wired — 1/2 pack', price: 120.00 },
		{ name: 'Medium Wired — 25lb pack (~250 sheets)', price: 240.00 },
		{ name: 'Shallow Wired — each', price: 1.00 },
		{ name: 'Shallow Wired — 1/2 pack', price: 132.50 },
		{ name: 'Shallow Wired — 25lb pack (~300 sheets)', price: 265.00 },
	]},
	{ section: 'Acorn Plastic Heavy Wax Foundation', items: [
		{ name: 'Deep — per sheet', price: 1.55 },
		{ name: 'Medium — per sheet', price: 1.20 },
	]},
	{ section: 'Frames — Unassembled (tiered: 1–49 $1.20, 50–4999 $1.05, 5000+ $1.00)', items: [
		{ name: 'Frames — Unassembled (price auto-adjusts by qty)', tiered: true },
	]},
	{ section: 'Frames With Foundation & Assembled — Plastic Foundation', items: [
		{ name: 'Deep Frame with Plastic', price: 3.05 },
		{ name: 'Medium Frame with Plastic', price: 2.70 },
	]},
	{ section: 'Assembled Frames for Wax — No Foundation', items: [
		{ name: 'All Sizes', price: 1.50 },
	]},
	{ section: 'Other Hive Items', items: [
		{ name: 'Entrance Reducer', price: 1.00 },
		{ name: 'Plastic Closer (For Screened Bottom)', price: 1.50 },
		{ name: 'Feeder Screen (Use on Inner Cover)', price: 3.00 },
		{ name: 'Escape Board (8 or 10 Frame)', price: 20.00 },
		{ name: 'Double Screen', price: 19.00 },
		{ name: '2" Metal Entrance Disc', price: 1.75 },
		{ name: '5" Metal Entrance Disc', price: 3.00 },
		{ name: '8 or 10 Frame Metal Queen Excluder', price: 9.50 },
		{ name: 'Plastic Queen Excluder', price: 4.00 },
		{ name: 'Support Pins — 100 Pack', price: 11.00 },
		{ name: 'Support Pins — 1000 Pack', price: 100.00 },
		{ name: 'Brass Eyelets — 1000 Pack', price: 6.00 },
		{ name: 'Frame Wire 1/2 Pound', price: 13.50 },
		{ name: 'Frame Wire 1 Pound', price: 18.00 },
		{ name: 'Frame Wire 5 Pound', price: 38.00 },
	]},
	{ section: 'Bee Health', items: [
		{ name: '1 Pint Pro Health', price: 18.00 },
		{ name: '1 Gallon Pro Health', price: 90.00 },
		{ name: '10lb Ultra Bee Pollen Dry Substitute', price: 32.00 },
		{ name: 'Beetle Blaster', price: 1.25 },
		{ name: 'Varroa Easycheck', price: 19.00 },
		{ name: 'Para Moth 1 pound', price: 22.00 },
		{ name: 'Para Moth 5 pound', price: 63.00 },
		{ name: 'Para Moth 25 pound', price: 230.00 },
		{ name: 'Baited Beetle Trap — 2 pack', price: 6.00 },
		{ name: 'Baited Beetle Trap — 10 pack', price: 28.00 },
		{ name: 'Hive Live Feed Enhancer 100ml', price: 25.00 },
		{ name: 'Hive Live Feed Enhancer 500ml', price: 80.00 },
		{ name: 'Hive Live Feed Enhancer 2000ml', price: 180.00 },
		{ name: 'Hive Live Fondant Patty — 2.2lb', price: 5.50 },
		{ name: 'Hive Live Fondant — 15 Patties (2.2lb each)', price: 75.00 },
	]},
];

const sectionRows: BeeItemRow[][] = [];
let loadingState = false;

function $(id: string): HTMLElement {
	const el = document.getElementById(id);
	if (!el) throw new Error(`Missing element #${id}`);
	return el;
}

function renderCatalog() {
	const root = $('catalog');
	CATALOG.forEach((sec, si) => {
		const details = document.createElement('details');
		details.dataset.section = String(si);

		const summary = document.createElement('summary');
		summary.textContent = sec.section;
		details.appendChild(summary);

		const grid = document.createElement('div');
		grid.className = 'item-grid';

		// Print-only column headers, hidden on screen.
		const headers: Array<{ label: string; cls: string }> = [
			{ label: 'Description', cls: 'name' },
			{ label: 'Quantity', cls: 'qty' },
			{ label: 'Unit Price', cls: 'price' },
			{ label: 'Subtotal', cls: 'subtotal' },
		];
		headers.forEach(({ label, cls }) => {
			const h = document.createElement('div');
			h.className = `cell header ${cls}`;
			h.textContent = label;
			grid.appendChild(h);
		});

		const rows: BeeItemRow[] = sec.items.map((item) => {
			const row = document.createElement('bee-item-row');
			row.item = item;
			grid.appendChild(row);
			return row;
		});
		sectionRows.push(rows);

		details.appendChild(grid);
		root.appendChild(details);
	});

	root.addEventListener('line-change', recalc);
}

function recalc() {
	let subtotal = 0;
	CATALOG.forEach((_, si) => {
		let active = 0;
		sectionRows[si].forEach((row) => {
			const line = row.lineTotal;
			if (line > 0) { subtotal += line; active++; }
		});
		const section = document.querySelector(`details[data-section="${si}"]`) as HTMLElement | null;
		if (section) section.dataset.hasItems = active > 0 ? 'true' : 'false';
	});
	const subStr = subtotal.toFixed(2);
	$('live-totals').setAttribute('subtotal', subStr);
	$('print-totals').setAttribute('subtotal', subStr);
}

function saveState() {
	if (loadingState) return;
	try {
		const state: PersistedState = {
			customer: {
				name: ($('cust-name') as HTMLInputElement).value,
				date: ($('cust-date') as HTMLInputElement).value,
			},
			items: sectionRows.flat().map((r) => ({ qty: r.qty, variant: r.variantIndex })),
			sections: Array.from(document.querySelectorAll<HTMLDetailsElement>('#catalog > details')).map((d) => d.open),
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch {
		// Ignore quota / privacy-mode errors.
	}
}

function loadState() {
	let state: PersistedState | null = null;
	try {
		state = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
	} catch {
		return;
	}
	if (!state) return;

	loadingState = true;
	if (state.customer) {
		if (state.customer.name) ($('cust-name') as HTMLInputElement).value = state.customer.name;
		if (state.customer.date) ($('cust-date') as HTMLInputElement).value = state.customer.date;
	}
	if (Array.isArray(state.items)) {
		const flat = sectionRows.flat();
		state.items.forEach((s, i) => {
			if (i >= flat.length || !s) return;
			if (typeof s.variant === 'number') flat[i].setVariant(s.variant);
			if (typeof s.qty === 'number') flat[i].setQty(s.qty);
		});
	}
	if (Array.isArray(state.sections)) {
		document.querySelectorAll<HTMLDetailsElement>('#catalog > details').forEach((d, i) => {
			if (typeof state!.sections![i] === 'boolean') d.open = state!.sections![i];
		});
	}
	loadingState = false;
}

function clearAll() {
	// Resets quantities and variant selections; keeps customer info.
	sectionRows.flat().forEach((r) => r.reset());
	recalc();
	saveState();
}

function setAllSections(open: boolean) {
	document.querySelectorAll<HTMLDetailsElement>('#catalog > details').forEach((d) => { d.open = open; });
	saveState();
}

$('live-totals').setAttribute('tax-rate', String(TAX_RATE));
$('print-totals').setAttribute('tax-rate', String(TAX_RATE));

function updateCustomerEmptyFlags() {
	(['cust-name', 'cust-date'] as const).forEach((id) => {
		const input = $(id) as HTMLInputElement;
		input.closest('label')?.classList.toggle('empty', !input.value);
	});
}

$('clear-btn').addEventListener('click', clearAll);
$('expand-all-btn').addEventListener('click', () => setAllSections(true));
$('collapse-all-btn').addEventListener('click', () => setAllSections(false));
$('print-btn').addEventListener('click', () => {
	// Sections need to be open for their items to appear on the printed sheet.
	// Empty sections are hidden by CSS regardless.
	document.querySelectorAll<HTMLDetailsElement>('#catalog > details[data-has-items="true"]').forEach((d) => { d.open = true; });
	window.print();
});

['cust-name', 'cust-date'].forEach((id) => {
	$(id).addEventListener('input', () => {
		saveState();
		updateCustomerEmptyFlags();
	});
});

renderCatalog();
loadState();
recalc();
updateCustomerEmptyFlags();

// Persist on any line-change (qty or variant) bubbling out of the rows,
// and on details open/close (toggle doesn't bubble, so capture).
$('catalog').addEventListener('line-change', saveState);
$('catalog').addEventListener('toggle', saveState, true);
