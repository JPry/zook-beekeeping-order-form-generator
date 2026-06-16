// Web components for the bee order form.
// All components use light DOM so the page's global styles apply directly.

const fmt = (n) => "$" + n.toFixed(2);

function tieredFramePrice(qty) {
  if (qty >= 5000) return 1.00;
  if (qty >= 50) return 1.05;
  return 1.20;
}

// <bee-variant-toggle>
// Segmented control for picking among item variants (e.g. Unassembled / Assembled).
// Set `.variants = [{label, price}, ...]` as a property before connection.
// Dispatches a bubbling `variant-change` CustomEvent with detail { index, variant }.
class BeeVariantToggle extends HTMLElement {
  connectedCallback() {
    if (this._rendered) return;
    this._selected = 0;
    this.render();
    this._rendered = true;
  }

  render() {
    if (!this.variants?.length) return;
    this.innerHTML = this.variants
      .map((v, i) => `<button type="button" data-idx="${i}" class="${i === this._selected ? "active" : ""}">${v.label}</button>`)
      .join("");
    this.addEventListener("click", this._onClick);
  }

  _onClick = (e) => {
    const btn = e.target.closest("button[data-idx]");
    if (!btn) return;
    this.select(parseInt(btn.dataset.idx));
  };

  select(idx) {
    if (idx === this._selected) return;
    this._selected = idx;
    this.querySelectorAll("button").forEach((b) =>
      b.classList.toggle("active", parseInt(b.dataset.idx) === idx)
    );
    this.dispatchEvent(new CustomEvent("variant-change", {
      detail: { index: idx, variant: this.variants[idx] },
      bubbles: true,
    }));
  }

  get selected() { return this._selected; }
  get current() { return this.variants[this._selected]; }
}
customElements.define("bee-variant-toggle", BeeVariantToggle);

// <bee-item-row>
// One row in the catalog. Set `.item = {name, price?, variants?, tiered?, nameTemplate?}` before connection.
// `nameTemplate` (e.g. "{variant} Bottom Board") substitutes the selected variant label into the name.
// Renders into a CSS grid (display: contents).
// Dispatches a bubbling `line-change` event when qty or variant changes.
class BeeItemRow extends HTMLElement {
  connectedCallback() {
    if (this._rendered || !this.item) return;
    this._qty = 0;
    this._variantIdx = 0;
    this._render();
    this._rendered = true;
    this._update();
  }

  _render() {
    const item = this.item;

    const nameDiv = document.createElement("div");
    nameDiv.className = "cell name";

    this._nameText = document.createElement("span");
    this._nameText.textContent = this._displayName();
    nameDiv.appendChild(this._nameText);

    if (item.variants) {
      const toggle = document.createElement("bee-variant-toggle");
      toggle.variants = item.variants;
      toggle.addEventListener("variant-change", (e) => {
        this._variantIdx = e.detail.index;
        this._priceCell.textContent = fmt(e.detail.variant.price);
        this._nameText.textContent = this._displayName();
        if (this._printVariant) {
          this._printVariant.textContent = `(${e.detail.variant.label})`;
        }
        this._update();
      });
      nameDiv.appendChild(toggle);
      this._toggle = toggle;

      // Only show the "(variant)" suffix on print when the name itself doesn't already encode it.
      if (!item.nameTemplate) {
        const pv = document.createElement("span");
        pv.className = "print-variant";
        pv.textContent = `(${item.variants[0].label})`;
        nameDiv.appendChild(pv);
        this._printVariant = pv;
      }
    }

    const priceDiv = document.createElement("div");
    priceDiv.className = "cell price";
    priceDiv.textContent = item.tiered ? "tiered" : fmt(item.variants ? item.variants[0].price : item.price);
    this._priceCell = priceDiv;

    const qtyDiv = document.createElement("div");
    qtyDiv.className = "cell qty";
    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.step = "1";
    input.value = "0";
    input.addEventListener("input", () => {
      this._qty = Math.max(0, parseInt(input.value) || 0);
      this._update();
    });
    qtyDiv.appendChild(input);
    this._qtyInput = input;

    const subDiv = document.createElement("div");
    subDiv.className = "cell subtotal";
    subDiv.textContent = "$0.00";
    this._subCell = subDiv;

    this.append(nameDiv, qtyDiv, priceDiv, subDiv);
  }

  _displayName() {
    const item = this.item;
    if (item.nameTemplate && item.variants) {
      return item.nameTemplate.replace("{variant}", item.variants[this._variantIdx].label);
    }
    return item.name;
  }

  _update() {
    const unit = this.unitPrice;
    const line = this._qty * unit;
    this._subCell.textContent = fmt(line);
    this.classList.toggle("has-value", line > 0);
    this.classList.toggle("zero-qty", this._qty === 0);
    if (this.item.tiered) {
      this._priceCell.textContent = fmt(unit);
    }
    this.dispatchEvent(new CustomEvent("line-change", { bubbles: true }));
  }

  get unitPrice() {
    if (this.item.tiered) return tieredFramePrice(this._qty);
    if (this.item.variants) return this.item.variants[this._variantIdx].price;
    return this.item.price;
  }

  get qty() { return this._qty; }
  get variantIndex() { return this._variantIdx; }
  get lineTotal() { return this._qty * this.unitPrice; }

  setQty(n) {
    this._qty = Math.max(0, n | 0);
    this._qtyInput.value = this._qty;
    this._update();
  }

  setVariant(idx) {
    if (this._toggle) this._toggle.select(idx);
  }

  reset() {
    this.setVariant(0);
    this.setQty(0);
  }
}
customElements.define("bee-item-row", BeeItemRow);

// <bee-totals>
// Displays subtotal, tax, grand total. Driven by attributes:
//   subtotal="123.45" tax-rate="0.06"
// Re-renders on attribute change.
class BeeTotals extends HTMLElement {
  static get observedAttributes() { return ["subtotal", "tax-rate"]; }

  connectedCallback() { this._render(); }
  attributeChangedCallback() { if (this.isConnected) this._render(); }

  _render() {
    const subtotal = parseFloat(this.getAttribute("subtotal") || "0");
    const rate = parseFloat(this.getAttribute("tax-rate") || "0");
    const tax = subtotal * rate;
    const grand = subtotal + tax;
    const pct = (rate * 100).toFixed(0);
    this.innerHTML = `
      <div class="totals-grid">
        <div class="label">Subtotal</div><div class="value">${fmt(subtotal)}</div>
        <div class="label">KY Sales Tax (${pct}%)</div><div class="value">${fmt(tax)}</div>
        <div class="label grand">Grand Total</div><div class="value grand">${fmt(grand)}</div>
      </div>
    `;
  }
}
customElements.define("bee-totals", BeeTotals);
