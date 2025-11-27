document.addEventListener("DOMContentLoaded", () => {
    const txtItemSearch = document.getElementById("txtItemSearch");
    const itemsContainer = document.getElementById("itemsContainer");
    const btnCash = document.getElementById("btnCash");
    const btnUPI = document.getElementById("btnUPI");
    const btnHome = document.getElementById("btnHome");
    
    const searchResults = document.getElementById("searchResults");

    if (!txtItemSearch) return;

    txtItemSearch.focus();

    // Barcode / 13-digit scan input
    txtItemSearch.addEventListener("input", () => handleItemInput(txtItemSearch.value.trim(), txtItemSearch, itemsContainer));

    // Payment buttons: save invoice with corresponding payment mode
    btnCash.addEventListener("click", () => saveInvoice("Cash"));
    btnUPI.addEventListener("click", () => saveInvoice("Paytm"));
    btnHome.addEventListener("click", () => window.location='?a=showHomePage');
    

    // Item name search dropdown
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

          var itemStock = item.itemStock ?? "0";

div.innerHTML = `
    <span>${item.item_name} (${Number(item.price).toFixed(2)}) (Stock : ${itemStock}) </span>
    <img src="https://via.placeholder.com/20" alt="icon">
`;
            div.addEventListener("click", () => {
                addItemToGrid(item, itemsContainer);
                searchResults.style.display = "none";
                txtItemSearch.value = "";
                txtItemSearch.focus();
            });

            searchResults.appendChild(div);
        });

        searchResults.style.display = matches.length > 0 ? "block" : "none";
    });

    // Hide dropdown if user clicks outside
    document.addEventListener("click", (e) => {
        if (!searchResults.contains(e.target) && e.target !== txtItemSearch) {
            searchResults.style.display = "none";
        }
    });
});


/**
 * Handle barcode/13-digit input
 */
function handleItemInput(value, inputElement, container) {

    if (value === "SAVECASH") {
        saveInvoice('Cash');
        playHappySound(); // happy scenario
    }

    if (value === "SAVEUPI") {
        saveInvoice("Paytm");
        playHappySound(); // happy scenario
    }

    if (value.length !== 13) return;

    const matchedItem = findItemByCode(value);

    if (matchedItem) {
        addItemToGrid(matchedItem, container);
        playBeep(); // item found
        inputElement.value = "";
        inputElement.focus();
    } else {
        showErrorToast(`Item code not found: ${value}`);
        playErrorSound(); // error scenario
        txtItemSearch.value = "";
    }

    txtItemSearch.value = "";
    txtItemSearch.focus();
}

// Happy sound
function playHappySound() {
    const audio = new Audio('/sounds/happycoinsound.wav'); // replace with actual path
    audio.play().catch(e => console.log("Audio play failed:", e));
}

// Error sound
function playErrorSound() {
    const audio = new Audio('/sounds/errorsound.wav'); // replace with actual path
    audio.play().catch(e => console.log("Audio play failed:", e));
}

// Toast function remains the same
function showErrorToast(message) {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.style.position = 'fixed';
        toastContainer.style.top = '20px';
        toastContainer.style.right = '20px';
        toastContainer.style.zIndex = 9999;
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.innerText = message;
    toast.style.background = 'rgba(255,0,0,0.9)';
    toast.style.color = '#fff';
    toast.style.padding = '10px 20px';
    toast.style.marginTop = '10px';
    toast.style.borderRadius = '5px';
    toast.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
    toast.style.fontSize = '14px';
    toast.style.opacity = '1';
    toast.style.transition = 'opacity 0.5s ease';

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 3000);
}

function findItemByCode(code) {
    return itemList.find(item => item.product_code === code || item.barcode === code) || null;
}


function updateRowColors() {
    const rows = document.querySelectorAll(".item-row");
    rows.forEach((row, index) => {
        row.style.backgroundColor = index % 2 === 0 ? "#f8f9fa" : "#e9ecef";
    });
}

/**
 * Add item to invoice grid
 */
function addItemToGrid(item, container) {
    // Remove previous last-added
    const previous = container.querySelector(".item-row.last-added");
    if (previous) previous.classList.remove("last-added");

    // Check if exists
    const existingRow = document.getElementById(`item-${item.item_id}`);
    if (existingRow) {
        const qtyInput = existingRow.querySelector(".item-qty");
        qtyInput.value = parseInt(qtyInput.value) + 1;
        updateRowAmount(existingRow);
        markLastAdded(existingRow);
        existingRow.scrollIntoView({ behavior: "smooth", block: "center" });
        updateRowColors();
        return;
    }

    // Create row
    const row = document.createElement("div");
    row.className = "item-row last-added";
    row.id = `item-${item.item_id}`;
    markLastAdded(row);

    // Name
    const nameSpan = document.createElement("span");
    nameSpan.className = "item-name";
    nameSpan.textContent = `${item.item_name} (${item.price.toFixed(2)})`;

    // Qty input
    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.min = 1;
    qtyInput.value = 1;
    qtyInput.className = "item-qty form-control form-control-sm";
    qtyInput.style.width = "60px";

    // Select all text on focus
    qtyInput.addEventListener("focus", () => qtyInput.select());

    // On input, update amount
    qtyInput.addEventListener("input", () => updateRowAmount(row));

    // Navigate to search on Enter key
    qtyInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            document.getElementById("txtItemSearch").focus();
            e.preventDefault();
        }
    });

    // Amount
    const amountSpan = document.createElement("span");
    amountSpan.className = "item-amount";
    amountSpan.style.textAlign = "center";
    amountSpan.textContent = item.price.toFixed(2);

    // Trash
    const trash = document.createElement("i");
    trash.className = "fas fa-trash-alt item-trash";
    trash.title = "Remove Item";
    trash.style.cursor = "pointer";
    trash.addEventListener("click", () => removeItemFromGrid(item.item_id));

    // Append all
    row.appendChild(nameSpan);
    row.appendChild(qtyInput);
    row.appendChild(amountSpan);
    row.appendChild(trash);

    container.appendChild(row);
    updateTotal();
    updateRowColors();
    row.scrollIntoView({ behavior: "smooth", block: "center" });
}

/**
 * Mark row as last-added (bold + slightly larger font)
 */
function markLastAdded(row) {
    row.classList.add("last-added");
    row.style.fontWeight = "bold";
    row.style.fontSize = "16px";
}

/**
 * Update row amount
 */
function updateRowAmount(row) {
    const qty = parseInt(row.querySelector(".item-qty").value);
    const price = parseFloat(itemList.find(i => i.item_id == row.id.split("-")[1]).price);
    row.querySelector(".item-amount").textContent = (qty * price).toFixed(2);
    updateTotal();
}

/**
 * Remove row
 */
function removeItemFromGrid(itemId) {
    const row = document.getElementById(`item-${itemId}`);
    if (row) row.remove();
    updateTotal();
    updateRowColors();
}

/**
 * Update total amount
 */
function updateTotal() {
    const rows = document.querySelectorAll(".item-row");
    let totalAmount = 0;
    rows.forEach(row => {
        const amount = parseFloat(row.querySelector(".item-amount").textContent);
        totalAmount += amount;
    });
    document.getElementById("footerTotalAmount").textContent = `Amount: ${totalAmount.toFixed(2)}`;
}

/**
 * Short happy beep
 */
function playBeep() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.4);
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.4);
    } catch (e) {
        console.warn("AudioContext not supported or blocked by user gesture");
    }
}

/**
 * Payment buttons
 */


let isSavingInvoice = false; // global lock flag

function saveInvoice(action) {
    if (isSavingInvoice) return; // prevent multiple saves
    isSavingInvoice = true;

    const selectedCustomer = ""; 
    const paymentMode = action === "Cash" ? "Cash" : "UPI";
    const paymentType = "Paid";
    const remarks = "";

    const rows = document.querySelectorAll(".item-row");
    if (rows.length === 0) {
        alert("No items selected");
        txtItemSearch.value = "";
        txtItemSearch.focus();
        isSavingInvoice = false; // release lock
        return;
    }

    const cart = [];
    rows.forEach(row => {
        const itemId = row.id.split("-")[1];
        const qty = parseInt(row.querySelector(".item-qty").value);
        const price = parseFloat(itemList.find(i => i.item_id == itemId).price);
        const name = row.querySelector(".item-name").textContent;
        cart.push({ item_id: itemId, qty, price, item_name: name });
    });

    const itemString = cart.map(item =>
        `${item.item_id}~${item.qty}~${item.price}~${item.price}~${item.item_name}|`
    ).join("");

    const totalAmount = cart.reduce((sum, item) => sum + (item.qty * item.price), 0);

    const now = new Date();
    const invoiceDate = String(now.getDate()).padStart(2, '0') + '/' +
                        String(now.getMonth() + 1).padStart(2, '0') + '/' +
                        now.getFullYear();

    const table_id = "";
    const booking_id = "";
    const app_id = "";
    const store_id = "";
    const user_id = "";

    const reqString =
        `customer_id=${selectedCustomer}` +
        `&gross_amount=${totalAmount}` +
        `&item_discount=0&invoice_discount=0` +
        `&total_amount=${totalAmount}` +
        `&payment_type=${paymentType}` +
        `&payment_mode=${paymentMode}` +
        `&paid_amount=${totalAmount}` +
        `&invoice_date=${invoiceDate}` +
        `&remarks=${encodeURIComponent(remarks)}` +
        `&table_id=${table_id}` +
        `&booking_id=${booking_id}` +
        `&appId=${app_id}&store_id=${store_id}&user_id=${user_id}` +
        `&itemDetails=${encodeURIComponent(itemString)}`;

    
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            isSavingInvoice = false; // release lock on complete
            if (this.status === 200) {
                const invoiceId = this.responseText.split("~");

                if (action === "print") {
                    printDirectAsFonts(invoiceId[0], 0);
                    return;
                }

                if (action === "pdf") {
                    generateInvoice(invoiceId[1]);
                    return;
                }

                // Default: just save and reload
                playHappySound();
                cleardataonsave();
                
            } else {
                alert("Failed to save invoice. Try again.");
            }
        }
    };

    xhttp.open("POST", "?a=saveInvoice", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(reqString);
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

function cleardataonsave()
{
  // Clear the invoice grid
  itemsContainer.innerHTML = "";

  // Reset total amount
  document.getElementById("footerTotalAmount").textContent = "Amount: 0.00";

  // Clear search input and focus
  txtItemSearch.value = "";
  txtItemSearch.focus();

  // Hide search dropdown if open
  searchResults.style.display = "none";
}
