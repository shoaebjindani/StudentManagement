document.addEventListener("DOMContentLoaded", () => {
    const txtItemSearch = document.getElementById("txtItemSearch");
    const itemsContainer = document.getElementById("itemsContainer");
    const btnSaveStock = document.getElementById("btnSaveStock");
    const btnCancel = document.getElementById("btnCancel");
    const txtDate = document.getElementById("txtDate");
    const txtRemarks = document.getElementById("txtRemarks");
    const hdnStockType = document.getElementById("hdnStockType");
    const searchResults = document.getElementById("searchResults");

    txtItemSearch.focus();

    // --- Item search dropdown ---
    txtItemSearch.addEventListener("input", () => {
        const query = txtItemSearch.value.trim().toLowerCase();
        searchResults.innerHTML = "";

        if (query.length === 0) {
            searchResults.style.display = "none";
            return;
        }


        const matches = itemList.filter(item => item.item_name.toLowerCase().includes(query));

        matches.forEach(item => {
            const div = document.createElement("div");
            div.className = "list-group-item list-group-item-action d-flex justify-content-between align-items-center";
            div.style.cursor = "pointer";
            var itemStock = `${item.itemStock ?? 0}`;
            div.innerHTML = `<span>${item.item_name} Stock: ${itemStock}</span>`;
            div.addEventListener("click", () => {
                addItemToGrid(item, itemsContainer);
                searchResults.style.display = "none";
                txtItemSearch.value = "";
            });
            searchResults.appendChild(div);
        });

        searchResults.style.display = matches.length > 0 ? "block" : "none";
    });

    document.addEventListener("click", (e) => {
        if (!searchResults.contains(e.target) && e.target !== txtItemSearch) {
            searchResults.style.display = "none";
        }
    });

    // --- Save stock ---
    btnSaveStock.addEventListener("click", () => saveStock());

    // --- Cancel button confirmation ---
    btnCancel.addEventListener("click", () => {
        const hasItems = document.querySelectorAll(".item-row").length > 0;
        if (!hasItems) {
            // No items, go directly to stock register
            window.location = '?a=showStockRegisterDirect';
            return;
        }

        const confirmed = confirm("Are you sure you want to cancel? Unsaved stock entries will be lost.");
        if (confirmed) {
            window.location = '?a=showStockRegisterDirect';
        }
    });

    // --- Handle mobile or browser back button ---
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", (event) => {
        event.preventDefault();
        const hasItems = document.querySelectorAll(".item-row").length > 0;

        if (!hasItems) {
            // No items → go directly to stock register
            window.location = '?a=showStockRegisterDirect';
            return;
        }

        const confirmed = confirm("Are you sure you want to go back? Unsaved stock entries will be lost.");
        if (confirmed) {
            window.location = '?a=showStockRegisterDirect';
        } else {
            // Stay on current page
            window.history.pushState(null, "", window.location.href);
        }
    });
});

/**
 * Add item row
 */

function addItemToGrid(item, container) {
    const existingRow = document.getElementById(`item-${item.item_id}`);
    if (existingRow) {
        const qtyInput = existingRow.querySelector(".item-qty");
        qtyInput.readOnly = false;      // Make editable if already readonly
        qtyInput.value = parseInt(qtyInput.value) + 1;
        qtyInput.focus();
        qtyInput.select();
        existingRow.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
    }

    const row = document.createElement("div");
    row.className = "item-row last-added";
    row.id = `item-${item.item_id}`;

    const nameSpan = document.createElement("span");
    nameSpan.className = "item-name";
    nameSpan.textContent = item.item_name;

    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.min = 1;

    const stockType = document.getElementById("hdnStockType").value;
    const itemStock = item.itemStock == null ? 0 : parseFloat(item.itemStock);
    qtyInput.value = stockType === "Counting" ? itemStock : 1;

    qtyInput.className = "item-qty form-control form-control-sm";
    qtyInput.style.width = "60px";

    // Focus selects the value
    qtyInput.addEventListener("focus", () => qtyInput.select());

    // Enter → back to search box
    qtyInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            document.getElementById("txtItemSearch").focus();
        }
    });

    // Make readonly on blur
    qtyInput.addEventListener("blur", () => {
        qtyInput.readOnly = true;
    });

    // Make editable on click
    qtyInput.addEventListener("click", () => {
        qtyInput.readOnly = false;
        qtyInput.focus();
    });

    const trash = document.createElement("i");
    trash.className = "fas fa-trash-alt item-trash";
    trash.title = "Remove Item";
    trash.addEventListener("click", () => removeItemFromGrid(item.item_id));

    row.appendChild(nameSpan);
    row.appendChild(qtyInput);
    row.appendChild(trash);

    // Insert at top
    container.prepend(row);

    qtyInput.focus();
    qtyInput.select();
    row.scrollIntoView({ behavior: "smooth", block: "center" });
}




/**
 * Remove item row
 */
function removeItemFromGrid(itemId) {
    const row = document.getElementById(`item-${itemId}`);
    if (row) row.remove();
}

/**
 * Save stock to server
 */
function saveStock() {
    const rows = document.querySelectorAll(".item-row");
    if (rows.length === 0) {
        alert("Please add at least one item");
        return;
    }

    const txtDate = document.getElementById("txtDate");
    const inputDate = new Date(txtDate.value);
    const today = new Date();

    // Reset time to midnight for accurate comparison
    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (isNaN(inputDate.getTime())) {
        alert("Invalid stock date");
        return;
    }

    if (inputDate > today) {
        alert("Stock date cannot be greater than today's date");
        txtDate.focus();
        return;
    }

    const stockDate = formatDate(txtDate.value); // dd/MM/yyyy
    const hdnStockType = document.getElementById("hdnStockType");
    const remarks = document.getElementById("txtRemarks").value.trim();

    const items = [];
    rows.forEach(row => {
        const itemId = row.id.split("-")[1];
        const qty = parseInt(row.querySelector(".item-qty").value);
        items.push({ item_id: itemId, qty });
    });

    // Build request parameters
    const params = items.map(item =>
        `hdnselecteditem=${item.item_id}&txtqty=${item.qty}&txtdate=${stockDate}&hdnstocktype=${encodeURIComponent(hdnStockType.value)}&txtremarks=${encodeURIComponent(remarks)}`
    ).join("&");

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            alert("Stock added successfully!");
            window.location.reload();
        }
    };
    xhttp.open("POST", "?a=addStockStatusDirect", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(params);
}

/**
 * Format date to dd/MM/yyyy
 */
function formatDate(input) {
    if (!input) return null;
    const d = new Date(input);
    if (isNaN(d.getTime())) return null;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

 txtRemarks.addEventListener("click", () => {
        txtRemarks.readOnly = false;
        txtRemarks.focus();
    });

    txtRemarks.addEventListener("blur", () => {
        txtRemarks.readOnly = true;
    });