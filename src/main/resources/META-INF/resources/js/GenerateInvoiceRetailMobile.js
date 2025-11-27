// ------------------- Global Variables -------------------
var cart = window.cart || [];
var categoriesDiv = document.getElementById("categories");
var itemsDiv = document.getElementById("items");
var editingItemId = null;
var lastFetchedItems = [];


// ------------------- Fetch Categories -------------------
function fetchCategories() {
    fetch('?a=getCategoriesByAppId')
        .then(res => res.json())
        .then(renderCategories)
        .catch(err => console.error(err));
}

function renderCategories(categories) {
    if (!categoriesDiv) return;
    categoriesDiv.innerHTML = "";

    categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.className = "category-btn";
        btn.innerText = cat.category_name;

        btn.onclick = () => {
            document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            fetchItems(cat.category_name);
        };

        categoriesDiv.appendChild(btn);
    });

    if (categories.length > 0) categoriesDiv.firstChild.click();
    updateCategoryHighlights();
}

// ------------------- Update Category Highlights -------------------
function updateCategoryHighlights() {
    document.querySelectorAll(".category-btn").forEach(btn => {
        const catName = btn.innerText;
        const hasItem = cart.some(c => c.category_name.trim() === catName.trim());

        // Only update highlight class based on items in cart
        if (hasItem) {
            btn.classList.add("highlight");
        } else {
            btn.classList.remove("highlight");
        }
        // DO NOT touch btn.classList for "active"
    });
}

// ------------------- Fetch Items -------------------
function fetchItems(category_name) {
    fetch(`?a=getItemsForThisCategoryNameByAjax&category_name=${encodeURIComponent(category_name)}`)
        .then(res => res.json())
        .then(renderItems)
        .catch(err => console.error(err));
}

// ------------------- Render Items -------------------
function renderItems(items) {
    
    lastFetchedItems = items; // Save for later
    if (!itemsDiv) return;
    itemsDiv.innerHTML = "";

    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "item-card";
        card.id = `item-${item.item_id}`;
        

        card.innerHTML = `
            <div class="row align-items-center" style="flex-wrap:nowrap;margin-top:0px;margin-bottom:7px">
                <div class="col-auto"><button class="btn btn-sm btn-danger minus-btn">-</button></div>
                <div class="col text-center"></div>
                <div class="col-auto"><button class="btn btn-sm btn-primary edit-btn">⋮</button></div>
            </div>
            <div class="row"><div class="col item-name text-center">${item.item_name}</div></div>
            <div class="row align-items-center">
                <div class="col-7 item-details text-start">
                    <span class="item-qty">${item.qty || 0}</span> × <span class="item-rate">${parseFloat(item.price).toFixed(2)}</span>
                </div>
                <div class="col-5 item-amount text-end fw-bold">
                Sara
                    ${((item.qty || 0) * (item.price || 0)).toFixed(2)}
                </div>
            </div>
        `;
        itemsDiv.appendChild(card);

        const minusBtn = card.querySelector(".minus-btn");
        const editBtn = card.querySelector(".edit-btn");

        minusBtn.onclick = (e) => {
            e.stopPropagation();
            let existing = cart.find(c => c.item_id === item.item_id);
            if (existing) {
                existing.qty--;
                if (existing.qty <= 0) cart = cart.filter(c => c.item_id !== item.item_id);
                updateItemUI(item.item_id);
                updateFooterTotals();
            }
        };

        editBtn.onclick = (e) => {
            e.stopPropagation();
            const existing = cart.find(c => c.item_id === item.item_id);
            const qty = existing ? existing.qty : 1;
            const rate = existing ? existing.price : item.price;
            openEditModal(item.item_id, qty, rate);
        };

        card.onclick = () => {
            let existing = cart.find(c => c.item_id === item.item_id);
            if (existing) existing.qty++;
            else cart.push({ ...item, qty: 1 });
            updateItemUI(item.item_id);
            updateFooterTotals();
        };

        updateItemUI(item.item_id);
    });

    updateFooterTotals();
}

// ------------------- Update Item UI -------------------
function updateItemUI(item_id) {
    const card = document.getElementById(`item-${item_id}`);
    if (!card) return;

    const qtyEl = card.querySelector(".item-qty");
    const rateEl = card.querySelector(".item-rate");
    const amountEl = card.querySelector(".item-amount");
    const minusBtn = card.querySelector(".minus-btn");

    const cartItem = cart.find(c => c.item_id === item_id);
    if (cartItem) {
        qtyEl.innerText = cartItem.qty;
        rateEl.innerText = `${parseFloat(cartItem.price).toFixed(2)}`;
        amountEl.innerText = `${(cartItem.qty * cartItem.price).toFixed(2)}`;
        card.classList.add("selected");
        minusBtn.style.display = "inline-block";
    } else {
        qtyEl.innerText = 0;
        rateEl.innerText = rateEl.innerText;
        amountEl.innerText = "0";
        card.classList.remove("selected");
        minusBtn.style.display = "none";
    }

    updateCategoryHighlights();
}

// ------------------- Footer Totals -------------------
function updateFooterTotals() {
    const selectedCount = cart.length;
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalAmount = cart.reduce((sum, item) => sum + (item.qty * item.price), 0);

    const selectedItemsEl = document.getElementById("selectedItems");
    const totalQtyEl = document.getElementById("totalQty");
    const totalAmountEl = document.getElementById("totalAmount");

    if (selectedItemsEl) selectedItemsEl.innerText = selectedCount;
    if (totalQtyEl) totalQtyEl.innerText = totalQty;
    if (totalAmountEl) totalAmountEl.innerText = totalAmount.toFixed(2);
}

// ------------------- Edit Modal -------------------
function openEditModal(itemId, qty, rate) {
    editingItemId = itemId;
    const qtyInput = document.getElementById('editQty');
    const rateInput = document.getElementById('editRate');
    const nameEl = document.getElementById('editItemName');
    if (!qtyInput || !rateInput || !nameEl) return;

    qtyInput.value = qty;
    rateInput.value = rate;

    // Find item name
    const fromCart = cart.find(c => c.item_id === itemId);
    const fromItems = lastFetchedItems.find(i => i.item_id === itemId);
    const itemName = fromCart?.item_name || fromItems?.item_name || "Item";

    nameEl.innerText = `${itemName}`;

    const modalEl = document.getElementById('editItemModal');
    if (!modalEl) return;
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    modalEl.addEventListener('shown.bs.modal', () => {
        qtyInput.focus();
        qtyInput.select();
    }, { once: true });

    rateInput.addEventListener('focus', (e) => e.target.select());
}
function saveEditItem() {
    const qtyInput = document.getElementById('editQty');
    const rateInput = document.getElementById('editRate');
    if (!qtyInput || !rateInput) return;

    const qty = parseInt(qtyInput.value);
    const rate = parseFloat(rateInput.value);
    const item = cart.find(c => c.item_id === editingItemId);

    if (item) {
        item.qty = qty;
        item.price = rate;
    } else {
        // Get the full original item object
        const original = lastFetchedItems.find(i => i.item_id === editingItemId);
        if (!original) return;

        cart.push({
            ...original,
            qty: qty,
            price: rate
        });
    }

    updateItemUI(editingItemId);
    updateFooterTotals();

    const modal = bootstrap.Modal.getInstance(document.getElementById('editItemModal'));
    if (modal) modal.hide();
}

// ------------------- Preview Modal -------------------
function showPreviewModal() {
    const items = cart.map(item => ({
        name: item.item_name,
        qty: item.qty,
        rate: parseFloat(item.price).toFixed(2),
        amount: (item.qty * item.price).toFixed(2)
    }));

    const totalQty = items.reduce((sum, i) => sum + i.qty, 0);
    const totalAmount = items.reduce((sum, i) => sum + parseFloat(i.amount), 0).toFixed(2);

    let html = `
        <table class="table table-bordered table-sm">
            <thead>
                <tr>
                    <th>Sr</th>
                    <th>Name</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                ${items.map((i, idx) => `
                    <tr>
                        <td>${idx + 1}</td>
                        <td>${i.name}</td>
                        <td>${i.qty}</td>
                        <td>${i.rate}</td>
                        <td>${i.amount}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div class="text-end">
            <p><strong>Total Qty:</strong> ${totalQty}</p>
            <p><strong>Total Amount:</strong> ${totalAmount}</p>
        </div>
    `;

    const previewItemsContainer = document.getElementById("previewItemsContainer");
    if (previewItemsContainer) previewItemsContainer.innerHTML = html;

    const modalEl = document.getElementById("invoicePreviewModal");
    if (modalEl) {
        new bootstrap.Modal(modalEl).show();
        togglePaymentMode(); // ensure payment mode sync
    }
}

// ------------------- Initializations -------------------
fetchCategories();
updateFooterTotals();
$("#txtinvoicedate").datepicker({ dateFormat: 'dd/mm/yy' });


function togglePaymentMode() {
    const paymentType = document.getElementById("previewPaymentType")?.value;
    const paymentModeContainer = document.getElementById("paymentModeContainer");

    if (paymentType === "Pending") {
        paymentModeContainer.style.display = "none";
    } else {
        paymentModeContainer.style.display = "block";
    }
}


function saveInvoice(action) {
    const customerInput = document.getElementById("previewCustomer");
    const selectedCustomer = customerInput?.value || "";

    const paymentType = document.getElementById("previewPaymentType")?.value || "Paid";
    const paymentMode = document.getElementById("previewPaymentMode")?.value || "Cash";
    const remarks = document.getElementById("previewRemarks")?.value || "";

    // Validation
    if (paymentType === "Pending" && !selectedCustomer) {
        alert("Pending Payment is not supported for Unknown customers");
        return;
    }

    if (cart.length === 0) {
        alert("No items selected");
        return;
    }

    // Build item string
    const itemString = cart.map(item =>
        `${item.item_id}~${item.qty}~${item.price}~${item.price}~${item.item_name}|`
    ).join("");

    const totalAmount = cart.reduce((sum, item) => sum + (item.qty * item.price), 0);

    // Collect invoice details
    const reqString =
        `customer_id=${selectedCustomer}` +
        `&gross_amount=${totalAmount}` +
        `&item_discount=0&invoice_discount=0` +
        `&total_amount=${totalAmount}` +
        `&payment_type=${paymentType}` +
        `&payment_mode=${paymentMode}` +
        `&paid_amount=${paymentType === "Pending" ? 0 : totalAmount}` +
        `&invoice_date=${document.getElementById("txtinvoicedate").value}` +
        `&remarks=${encodeURIComponent(remarks)}` +
        `&table_id=${table_id}` +
        `&booking_id=${booking_id}` +
        `&appId=${app_id}&store_id=${store_id}&user_id=${user_id}` +
        `&itemDetails=${encodeURIComponent(itemString)}`;

    console.log("Invoice Request:", reqString);

    // Ajax call
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const invoiceId = this.responseText.split("~");

            if (action === "print") {
                // Print invoice directly
                printDirectAsFonts(invoiceId[0], 0);
                return;
            }

            if (action === "pdf") {
                // Generate PDF
                generateInvoice(invoiceId[1]);
                return;
            }

            // Default: just save
            window.location.reload();
        }
    };

    xhttp.open("POST", "?a=saveInvoice", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(reqString);
}


function confirmCancel() {
    if (confirm("Are you sure you want to cancel?")) window.location='?a=showHomePage';
}





function generateInvoice(invoiceId,showExpInc)
{
	
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			window.open("BufferedImagesFolder/"+xhttp.responseText);
            window.location.reload();
		}
	};
	xhttp.open("GET","?a=generateInvoicePDF&invoiceId="+invoiceId+"&showExpInc="+showExpInc, false);
	xhttp.send();
}