document.addEventListener("DOMContentLoaded", () => {
    const txtItemSearch = document.getElementById("txtItemSearch");
    const itemsContainer = document.getElementById("itemsContainer");
    const btnCash = document.getElementById("btnCash");
    const btnpreview = document.getElementById("btnpreview");
    const btnHome = document.getElementById("btnHome");
    const searchResults = document.getElementById("searchResults");

    if (!txtItemSearch) return;

    txtItemSearch.focus();

    // Barcode / 13-digit scan input
    txtItemSearch.addEventListener("input", () => handleItemInput(txtItemSearch.value.trim(), txtItemSearch, itemsContainer));

    // Payment buttons
    btnpreview.addEventListener("click", () => showPreviewModal());
    btnHome.addEventListener("click", () => window.location='?a=showHomePage');

    // Item search dropdown
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
    div.className = "search-item-btn"; // use a new class instead of list-group-item
    div.style.cursor = "pointer";

    const itemStock = item.itemStock ?? "0";

    div.innerHTML = `
        <span>${item.item_name}  (${itemStock})</span>                
    `;
    div.addEventListener("click", () => {
        addItemToGrid(item, itemsContainer);
        searchResults.style.display = "none";
        txtItemSearch.value = "";
    });

    searchResults.appendChild(div);
});

    searchResults.style.display = matches.length > 0 ? "flex" : "none";
    searchResults.style.flexWrap = "wrap";
    searchResults.style.gap = "5px";
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
    if (value === "SAVECASH") { saveInvoice('Cash'); playHappySound(); }
    if (value === "SAVEUPI") { saveInvoice("Paytm"); playHappySound(); }
    if (value.length !== 13) return;

    const matchedItem = findItemByCode(value);

    if (matchedItem) {
        addItemToGrid(matchedItem, container);
        playBeep();
        inputElement.value = "";
        inputElement.focus();
    } else {
        showErrorToast(`Item code not found: ${value}`);
        playErrorSound();
        txtItemSearch.value = "";
    }
    txtItemSearch.value = "";
    txtItemSearch.focus();
}

function playHappySound() {
    const audio = new Audio('/sounds/happycoinsound.wav');
    audio.play().catch(e => console.log("Audio play failed:", e));
}

function playErrorSound() {
    const audio = new Audio('/sounds/errorsound.wav');
    audio.play().catch(e => console.log("Audio play failed:", e));
}

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
        setTimeout(() => { toast.remove(); }, 500);
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
 * Add item to invoice grid with editable rate
 */
function addItemToGrid(item, container) {
    const existingCartItem = cart.find(i => i.item_id === item.item_id);

    if (existingCartItem) {
        // Item already exists → increment quantity & update amount
        existingCartItem.qty += 1;
        existingCartItem.amount = existingCartItem.qty * existingCartItem.price;
    } else {
        // New item → push to cart
        cart.push({
            item_id: item.item_id,
            item_name: item.item_name,
            qty: 1,
            price: parseFloat(item.price),
            amount: parseFloat(item.price)
        });
    }

    // Re-render full grid (handles DOM + events)
    renderCartItems(container);

    // Update totals, colors, etc.
    updateTotal();
    updateRowColors();

    // Save updated state to localStorage
    saveStateToLocalStorage();
}



function markLastAdded(row) {
    // Reset all rows first
    const allRows = document.querySelectorAll(".item-row");
    allRows.forEach(r => {
        r.classList.remove("last-added");
        r.style.fontWeight = "normal";
        r.style.fontSize = "14px"; // default font size
    });

    // Mark the current row as last added
    row.classList.add("last-added");
    row.style.fontWeight = "bold";
    row.style.fontSize = "18px";
}
function updateRowAmount(row) {
    const qty = parseInt(row.querySelector(".item-qty").value) || 0;
    const rate = parseFloat(row.querySelector(".item-rate").value) || 0;
    row.querySelector(".item-amount").textContent = (qty * rate).toFixed(2);
    updateTotal();
}



function updateTotal() {
    const rows = document.querySelectorAll(".item-row");
    let totalAmount = 0;
    rows.forEach(row => {
        const amount = parseFloat(row.querySelector(".item-amount").textContent) || 0;
        totalAmount += amount;
    });
    document.getElementById("footerTotalAmount").textContent = `Amount: ${totalAmount.toFixed(2)}`;
}

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
let cart = [];

function saveInvoice(action) {

    const paymentType = previewPaymentType.value;
    const paymentMode = previewPaymentMode.value;
    const remarks = previewRemarks.value;

    

    const rows = document.querySelectorAll(".item-row");
    if (rows.length === 0) {
        alert("No items selected");
        txtItemSearch.value="";
        txtItemSearch.focus();
        return;
    }

   

    const itemString = cart.map(item =>
        `${item.item_id}~${item.qty}~${item.price}~${item.price}~${item.item_name}|`
    ).join("");

    const totalAmount = cart.reduce((sum, item) => sum + (item.qty * item.price), 0);

    const now = new Date();
    var invoiceDate=document.getElementById('txtinvoicedate').value;
    const table_id = "", booking_id = "", app_id = "", store_id = "", user_id = "";

    const customerId = selectedCustomer ? selectedCustomer.customerId : "";
    const invoiceId = hiddenInvoiceId.value;
   
    
    const reqString =
        `hdnPreviousInvoiceId=${invoiceId}` +
        `&customer_id=${customerId}` +
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

    console.log("Invoice Request:", reqString);

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const invoiceId = this.responseText.split("~");

            if (action === "print") { printDirectAsFonts(invoiceId[0], txtOutstanding.value); }
            if (action === "pdf") { generateInvoice(invoiceId[1]);  }

            playHappySound();
            $('#invoicePreviewModal').modal('hide');
            cleardataonsave();
            fetchItemList();
            
            toastr["success"]("Invoice Saved Successfully"+invoiceId[1]);
			toastr.options = {"timeOut": "500"};
			
        }
    };
    xhttp.open("POST", "?a=saveInvoice", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(reqString);
}

function cleardataonsave() {
    // Clear the invoice grid
    itemsContainer.innerHTML = "";

    // Reset total amount
    document.getElementById("footerTotalAmount").textContent = "Amount: 0.00";

    // Clear item search input and focus
    txtItemSearch.value = "";
    txtItemSearch.focus();

    // Hide item search dropdown if open
    searchResults.style.display = "none";

    // Clear customer search input
    const txtCustomerSearch = document.getElementById("txtCustomerSearch");
    const customerResults = document.getElementById("customerResults");

    if (txtCustomerSearch) txtCustomerSearch.value = "";
    if (customerResults) customerResults.style.display = "none";

    // Reset selected customer variables
    selectedCustomer = null;

    // Clear cart array if it exists
    if (typeof cart !== "undefined") cart.length = 0;


    localStorage.removeItem("invoiceState");
}

function generateInvoice(invoiceId, showExpInc) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            window.open("BufferedImagesFolder/"+xhttp.responseText);
            window.location='?a=showGenerateInvoice&oldInvoiceFormat=true';
        }
    };
    xhttp.open("GET","?a=generateInvoicePDF&invoiceId="+invoiceId+"&showExpInc="+showExpInc, false);
    xhttp.send();
}

// -------------------- Customer Search Logic --------------------
const txtCustomerSearch = document.getElementById("txtCustomerSearch");
const customerResults = document.getElementById("customerResults");

let selectedCustomer = null;

// Customer search input
txtCustomerSearch.addEventListener("input", () => {
    const query = txtCustomerSearch.value.trim().toLowerCase();
    customerResults.innerHTML = "";

    if (query.length === 0) {
        customerResults.style.display = "none";
        return;
    }

    const matches = customerList.filter(c => 
    c.customerName.toLowerCase().includes(query) || 
    (c.mobileNumber && c.mobileNumber.toLowerCase().includes(query))
);

    matches.forEach(cust => {
        const div = document.createElement("div");
        div.className = "list-group-item list-group-item-action";
        div.style.cursor = "pointer";
        div.textContent = `${cust.customerName} (${cust.mobileNumber ?? ""})`;

        div.addEventListener("click", () => {
            txtCustomerSearch.value = cust.customerName + "~" + cust.mobileNumber;
            selectedCustomer = cust;
            txtCustomerSearch.readonly = true;
            txtCustomerSearch.style.fontWeight = "bold";
            customerResults.style.display = "none";
            txtItemSearch.focus();
            fetchPendingAmountForThisCustomer(cust.customerId);
        });

        customerResults.appendChild(div);
    });

    customerResults.style.display = matches.length > 0 ? "block" : "none";
});

// Allow changing customer when user taps again
txtCustomerSearch.addEventListener("click", () => {
    if (selectedCustomer) {
        selectedCustomer = null;
        txtCustomerSearch.value = "";
        txtCustomerSearch.disabled = false;
        txtCustomerSearch.style.fontWeight = "normal";
        customerResults.style.display = "none";
        setTimeout(() => txtCustomerSearch.select(), 100);
    }
});

// Hide dropdown when clicking outside
document.addEventListener("click", (e) => {
    if (!customerResults.contains(e.target) && e.target !== txtCustomerSearch) {
        customerResults.style.display = "none";
    }
});

// -------------------- Add Customer Modal --------------------
const btnAddCustomer = document.getElementById("btnAddCustomer");
btnAddCustomer.addEventListener("click", () => {
    let modal = document.getElementById("addCustomerModal");
    if (modal) {
        modal.style.top = "10px"; // top for mobile
        modal.style.display = "flex";
        document.getElementById("newCustomerName").focus();
        return;
    }

    modal = document.createElement("div");
    modal.id = "addCustomerModal";
    Object.assign(modal.style, {
        position: "fixed",
        top: "10px",
        left: "0",
        width: "100%",
        height: "auto",
        minHeight: "100px",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: "9999",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "20px",
        overflowY: "auto"
    });

    const box = document.createElement("div");
    Object.assign(box.style, {
        background: "#fff",
        padding: "25px 20px",
        borderRadius: "12px",
        width: "320px",
        maxWidth: "90%",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: "12px"
    });

    box.innerHTML = `
        <h5 style="margin:0 0 15px 0; text-align:center; font-weight:bold; color:#333;">Add New Customer</h5>
        <input type="text" id="newCustomerName" placeholder="Customer Name" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ccc; font-size:14px;">
        <input type="tel" id="newCustomerMobile" placeholder="Mobile Number" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ccc; font-size:14px;">
        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:10px;">
            <button id="cancelAddCustomer" style="padding:8px 16px; background:#e74c3c; color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:bold;">Cancel</button>
            <button id="saveAddCustomer" style="padding:8px 16px; background:#27ae60; color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:bold;">Save</button>
        </div>
    `;

    modal.appendChild(box);
    document.body.appendChild(modal);

    document.getElementById("newCustomerName").focus();

    // Cancel button
    document.getElementById("cancelAddCustomer").addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Save button
    document.getElementById("saveAddCustomer").addEventListener("click", () => {
    const customerName = document.getElementById("newCustomerName").value.trim();
    const mobileNumber = document.getElementById("newCustomerMobile").value.trim();
    const customerType = "NewCustomer"; // hardcoded

    if (!customerName) { alert("Enter Customer Name"); return; }
    if (!mobileNumber) { alert("Enter Mobile Number"); return; }

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            const resp = this.responseText.split("~");
            
             
            alert(resp);
            

            // Mimic selecting a customer 
            txtCustomerSearch.disabled = true;
            txtCustomerSearch.value = customerName + "~" + mobileNumber + "~" + customerType;
            txtCustomerSearch.style.fontWeight = "bold";
            txtCustomerSearch.style.backgroundColor = "#f0f8ff"; // highlight
            
       
             selectedCustomer = {
                customerName: customerName,
                mobile: mobileNumber,
                customerType: customerType,
                customerId: resp[1]   // assign the returned ID here
            };

           

            modal.style.display = "none";

            // Focus back on itemsearch
            txtItemSearch.focus();
        }
    };
    xhttp.open("GET", `?a=saveCustomerServiceAjax&appId=${app_id}&customerName=${customerName}&mobileNumber=${mobileNumber}&customerType=NewCustomer`, true);
    xhttp.send();
});

});

function showPreviewModal() {
    if (cart.length === 0) {
        alert("No items in cart to preview");
        return;
    }

    const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
    const totalAmount = cart.reduce((sum, i) => sum + i.amount, 0).toFixed(2);

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
                ${cart.map((i, idx) => `
                    <tr>
                        <td>${idx + 1}</td>
                        <td>${i.item_name}</td>
                        <td>${i.qty}</td>
                        <td>${i.price.toFixed(2)}</td>
                        <td>${i.amount.toFixed(2)}</td>
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

    

    if (selectedCustomer && selectedCustomer.customerId) {
    $('#previewCustomer').val(selectedCustomer.customerId);
} else {
    $('#previewCustomer').val('-1'); // Default to Walk In Customer
}

    const modalEl = document.getElementById("invoicePreviewModal");
    if (modalEl) {
        new bootstrap.Modal(modalEl).show();
    }

    $("#txtinvoicedate").datepicker({ dateFormat: 'dd/mm/yy' });
}


function updateCartItem(itemId, qty, rate) {
    const index = cart.findIndex(i => i.item_id === itemId);
    if (index >= 0) {
        cart[index].qty = qty;
        cart[index].price = rate;
        cart[index].amount = qty * rate;
    }
     saveStateToLocalStorage(); 
}
function removeItemFromGrid(itemId) {
    const row = document.getElementById(`item-${itemId}`);
    if (row) row.remove();

    cart = cart.filter(i => i.item_id !== itemId);

    updateTotal();
    updateRowColors();
    saveStateToLocalStorage();
}

function togglePaymentMode() {
    const paymentType = document.getElementById("previewPaymentType")?.value;
    const paymentModeContainer = document.getElementById("paymentModeContainer");

    if (paymentType === "Pending") {
        paymentModeContainer.style.display = "none";
    } else {
        paymentModeContainer.style.display = "block";
    }
}


function makeRowEditable(row) {
    document.querySelectorAll(".item-row").forEach(r => {
        const qty = r.querySelector(".item-qty");
        const rate = r.querySelector(".item-rate");
        if (r.id === row.id) {
            qty.readOnly = false;
            rate.readOnly = false;
        } else {
            qty.readOnly = true;
            rate.readOnly = true;
        }
    });
}


// -------------------- Add Item Modal --------------------
const btnAddItem = document.getElementById("btnAddItem");


document.getElementById("btnAddItem").addEventListener("click", () => {
    // Show modal
    const addItemModal = new bootstrap.Modal(document.getElementById('addItemModal'));
    addItemModal.show();

    const categorySelect = document.getElementById("newItemCategory");

    // Clear previous options
    categorySelect.innerHTML = '<option value="">Select Category</option>';

    fetch("?a=getCategoriesByAppId&app_id=" + app_id)
        .then(resp => resp.text())
        .then(str => {
            console.log("Raw response:", str);
            let data = [];
            try {
                data = JSON.parse(str);
            } catch (e) {
                console.error("Failed to parse response:", e);
            }

            data.forEach(cat => {
                const opt = document.createElement("option");
                opt.value = cat.category_id;
                opt.textContent = cat.category_name;
                categorySelect.appendChild(opt);
            });
        })
        .catch(err => console.error("Failed to fetch categories:", err));

    // Focus the first input
    document.getElementById("newItemName").focus();
});

document.getElementById("btnSaveNewItem").addEventListener("click", () => {
    const itemName = document.getElementById("newItemName").value.trim();
    const itemRate = document.getElementById("newItemRate").value.trim();
    const categoryId = document.getElementById("newItemCategory").value;

    if (!itemName) {
        alert("Please enter item name");
        document.getElementById("newItemName").focus();
        return;
    }
    if (!itemRate || isNaN(itemRate) || Number(itemRate) <= 0) {
        alert("Please enter valid rate");
        document.getElementById("newItemRate").focus();
        return;
    }
    if (!categoryId) {
        alert("Please select category");
        document.getElementById("newItemCategory").focus();
        return;
    }

    // Build URL with query parameters
    const url = `?a=saveNewItem&item_name=${encodeURIComponent(itemName)}&price=${encodeURIComponent(itemRate)}&category_id=${encodeURIComponent(categoryId)}`;

    console.log("GET request URL:", url);

    fetch(url, { method: "GET" })
        .then(resp => resp.text())
        .then(str => {
            console.log("Service response:", str);

            if (str.toLowerCase().includes("success")) {
                alert(str); // show success message

                // Optionally, add the new item to the local itemList for search
                
                var newItemId = str.split("~")[1];
                if (newItemId) {
                    itemList.push({
                        item_id: newItemId,
                        item_name: itemName,
                        price: Number(itemRate),
                        categoryId: categoryId
                    });
                }

                // Clear modal fields
                document.getElementById("newItemName").value = "";
                document.getElementById("newItemRate").value = "";
                document.getElementById("newItemCategory").value = "";

                // Hide modal
                const addItemModalEl = document.getElementById('addItemModal');
                const modalInstance = bootstrap.Modal.getInstance(addItemModalEl);
                modalInstance.hide();

                // Focus back on item search
                document.getElementById("txtItemSearch").focus();
            } else {
                alert("Failed to save item: " + str);
            }
        })
        .catch(err => {
            console.error("Error saving item:", err);
            alert("Error saving item. Check console for details.");
        });
});


function fetchPendingAmountForThisCustomer(customerId)
{
	
	var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() 
	  {
	    if (xhttp.readyState == 4 && xhttp.status == 200) 
	    { 		      
	    	var responseData=JSON.parse(xhttp.responseText);
			var details=responseData.reqData;
			
	    	if(details.pendingAmountDetails.PendingAmount!=undefined)
	    		{
	    			txtOutstanding.value=details.pendingAmountDetails.PendingAmount;
	    		}
	    	else
	    		{
	    			txtOutstanding.value=0;
					//alert("no pending amount for this customer");
	    			//window.location.reload();
	    		}
			
		
		}
	  };
	  xhttp.open("GET","?a=getPendingAmountForCustomer&customerId="+customerId, true);    
	  xhttp.send();
}


if(invoiceJson.invoice_id!=undefined)
{
    fetchItemList();
    loadInvoiceForEdit(invoiceJson);
    
}

function loadInvoiceForEdit(invoice) {
    // Hidden input for invoice_id

    
    console.log(invoiceJson);
    
    let hiddenInvoiceId = document.getElementById("hiddenInvoiceId");
    if(hiddenInvoiceId) hiddenInvoiceId.value = invoice.invoice_id;

    // Customer
    if(invoice.customer_id) {
        txtCustomerSearch.value = invoice.customerName + "~" + (invoice.mobile_number ?? "");
        txtCustomerSearch.readOnly = true;
        txtCustomerSearch.style.fontWeight = "bold";
        
        var selectedCustomerNew = {
                customerName: invoice.customerName,
                mobile: invoice.mobile_number,                
                customerId: invoice.customer_id   // assign the returned ID here
            };

        selectedCustomer = selectedCustomerNew;
    }
    if(invoice.customer_id!=0)
    {
        fetchPendingAmountForThisCustomer(invoice.customer_id);
    }
    
    // Invoice date
    if(invoice.invoice_date) document.getElementById("txtinvoicedate").value = invoice.theInvoiceDate;

    // Payment type/mode/remarks
    if(invoice.payment_type) document.getElementById("previewPaymentType").value = invoice.payment_type;
    if(invoice.payment_mode) document.getElementById("previewPaymentMode").value = invoice.payment_mode;
    if(invoice.remarks) document.getElementById("previewRemarks").value = invoice.remarks;

    // Populate items
    if(invoice.listOfItems && invoice.listOfItems.length > 0) {
        
        invoice.listOfItems.forEach(item => {
            let originalItem = itemList.find(i => i.item_id == item.item_id) || item;
            addItemToGrid({
                item_id: originalItem.item_id,
                item_name: originalItem.item_name,
                price: parseFloat(item.rate),
                product_code: originalItem.product_code,
                barcode: originalItem.barcode
            }, itemsContainer);

            // Update quantity/rate in grid & cart
            const row = document.getElementById(`item-${item.item_id}`);
            if(row) {
                const qtyInput = row.querySelector(".item-qty");
                const rateInput = row.querySelector(".item-rate");
                qtyInput.value = item.qty;
                rateInput.value = parseFloat(item.rate).toFixed(2);
                updateRowAmount(row);

                // Update cart array
                const cartItem = cart.find(c => c.item_id == item.item_id);
                if(cartItem) {
                    cartItem.qty = item.qty;
                    cartItem.price = parseFloat(item.rate);
                    cartItem.amount = item.qty * parseFloat(item.rate);
                }
            }
        });
    }

    updateTotal();
    updateRowColors();
}




function fetchItemList() {
    $.ajax({
        url: '?a=getItemsByAppId',
        type: 'POST',
        dataType: 'text', // since response is a string
        success: function (response) {
            try {
                var parsed = JSON.parse(response);
                 // full CustomResultObject
                
                    itemList = parsed; // ajaxData itself is stringified JSON
                    console.log(" Item list refreshed. Count:", itemList.length);
                
            } catch (err) {
                console.error("Error parsing item list:", err);
                itemList = [];
            }
        },
        error: function (xhr, status, error) {
            console.error(" Failed to fetch item list:", error);
            toastr.error("Failed to refresh item list");
        }
    });
}


// ✅ Call fetchItemList on page load
$(document).ready(function () {
    fetchItemList();
    const container = document.getElementById("itemsContainer"); // change to your actual container ID
    restoreStateFromLocalStorage(container);
});


/**
 * Render all items in the global cart array into the itemsContainer
 * Reuses addItemToGrid for each item
 */

function renderCartItems(container) {
    container.innerHTML = ""; // Clear existing rows first

    cart.forEach((item, index) => {
        // Create row
        const row = document.createElement("div");
        row.className = "item-row";
        row.id = `item-${item.item_id}`;

        // --- Columns ---
        const nameSpan = document.createElement("span");
        nameSpan.className = "item-name";
        nameSpan.textContent = item.item_name;

        const qtyInput = document.createElement("input");
        qtyInput.type = "number";
        qtyInput.min = 1;
        qtyInput.value = item.qty;
        qtyInput.className = "item-qty form-control form-control-sm";
        qtyInput.style.width = "60px";

        const rateInput = document.createElement("input");
        rateInput.type = "number";
        rateInput.min = 0;
        rateInput.value = parseFloat(item.price).toFixed(2);
        rateInput.className = "item-rate form-control form-control-sm";
        rateInput.style.width = "70px";

        const amountSpan = document.createElement("span");
        amountSpan.className = "item-amount";
        amountSpan.textContent = (item.qty * item.price).toFixed(2);
        amountSpan.style.textAlign = "center";

        const trash = document.createElement("i");
        trash.className = "fas fa-trash-alt item-trash";
        trash.style.cursor = "pointer";
        trash.addEventListener("click", () => removeItemFromGrid(item.item_id));

        // --- Event listeners ---
        qtyInput.addEventListener("input", () => {
            updateRowAmount(row);
            updateCartItem(item.item_id, parseInt(qtyInput.value), parseFloat(rateInput.value));
        });
        qtyInput.addEventListener("focus", () => qtyInput.select());

        rateInput.addEventListener("input", () => {
            updateRowAmount(row);
            updateCartItem(item.item_id, parseInt(qtyInput.value), parseFloat(rateInput.value));
        });
        rateInput.addEventListener("focus", () => rateInput.select());

        // Press Enter → focus item search
        rateInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                txtItemSearch.focus();
                txtItemSearch.select();
            }
        });

        // --- Append elements ---
        row.appendChild(nameSpan);
        row.appendChild(qtyInput);
        row.appendChild(rateInput);
        row.appendChild(amountSpan);
        row.appendChild(trash);
        container.prepend(row);


        // --- Click to make editable ---
        row.addEventListener("click", () => makeRowEditable(row));
    });

    markLatestRowEditable();

    updateTotal();
    updateRowColors();
}

function markLatestRowEditable() {
    const rows = document.querySelectorAll(".item-row");
    rows.forEach((r, index) => {
        const qty = r.querySelector(".item-qty");
        const rate = r.querySelector(".item-rate");
        if (index === 0) { // <-- because newest is prepended (on top)
            qty.readOnly = false;
            rate.readOnly = false;
            qty.focus();
            qty.select();
        } else {
            qty.readOnly = true;
            rate.readOnly = true;
        }
    });
}



// Save current cart and selected customer to localStorage
function saveStateToLocalStorage() {
    try {
        const state = {
            cart: cart,
            selectedCustomerId: document.getElementById("ddlCustomer")?.value || null
        };
        localStorage.setItem("invoiceState", JSON.stringify(state));
    } catch (err) {
        console.error("Error saving state:", err);
    }
}

// Restore cart and customer from localStorage
function restoreStateFromLocalStorage(container) {
    try {
        const saved = localStorage.getItem("invoiceState");
        if (!saved) return;

        const state = JSON.parse(saved);

        if (state.selectedCustomerId) {
            const ddl = document.getElementById("ddlCustomer");
            if (ddl) ddl.value = state.selectedCustomerId;
        }

        if (state.cart && Array.isArray(state.cart)) {
            cart = state.cart;
            renderCartItems(container);
            updateTotal();
            updateRowColors();
        }
    } catch (err) {
        console.error("Error restoring state:", err);
    }
}