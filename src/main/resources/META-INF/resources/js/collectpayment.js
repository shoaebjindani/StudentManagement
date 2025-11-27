// Trigger when customer is selected
document.getElementById("txtcustomer").addEventListener("change", function () {
  const selectedCustomer = this.value;
  const option = [...document.querySelectorAll("#customerList option")]
    .find(o => o.value === selectedCustomer);

  if (option) {
    const customerId = option.id;
    document.getElementById("customerId").value = customerId;
    txtcustomer.disabled = true;
    fetchCustomerData(customerId);
  }
});

function fetchCustomerData(customerId) {
  fetch(`?a=getPendingAmountForCustomer&customerId=${customerId}`)
    .then(res => res.text())
    .then(text => {
      let data = {};
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Invalid JSON from server:", text);
        return;
      }
      renderData(data.reqData || {});
    })
    .catch(err => console.error("Error fetching customer data:", err));
}

// Render all data from service
function renderData(data) {
  renderPendingAmount(data.pendingAmountDetails);  
  renderInvoices(data.last100Invoices);
  populateInvoiceDropdown(data.last100Invoices);
  fetchBankAccounts(); // ✅ fetch banks once data loads
}

// Show Pending Amount
function renderPendingAmount(pending) {
  const el = document.getElementById("pendingAmountSection");
  if (!pending || pending.length === 0) {
    el.innerHTML = "<small class='text-muted'>No pending amount found.</small>";
    document.getElementById("txtpendingamount").value = "";
    return;
  }
  txtpendingamount.value = pending.PendingAmount;
}

// Show Last Month Sales
function renderLastMonthSales(sales) {
  const el = document.getElementById("lastMonthSalesSection");
  if (!sales || sales.length === 0) {
    el.innerHTML = "";
    return;
  }
  let html = `<h6>Last Month Sales</h6><ul class="list-group mb-2">`;
  sales.forEach(s => {
    html += `<li class="list-group-item p-1">
      ${s.invoice_no} | ${s.invoice_date} | ${s.total_amount}
    </li>`;
  });
  html += `</ul>`;
  el.innerHTML = html;
}

// Show last 100 invoices
function renderInvoices(invoices) {
  const el = document.getElementById("last100InvoicesSection");
  if (!invoices || invoices.length === 0) {
    el.innerHTML = "";
    return;
  } 
}

// Populate Invoice Dropdown
function populateInvoiceDropdown(invoices) {
  const dropdown = document.getElementById("invoiceDropdown");
  dropdown.innerHTML = '<option value="-1">-- Select Invoice --</option>';

  invoices.forEach(inv => {
    const option = document.createElement("option");
    option.value = inv.invoice_id || inv.invoice_no;
    option.text = `${inv.invoice_no} | ${inv.invoice_date} | Rs.${inv.total_amount}/-`;
    dropdown.appendChild(option);
  });
}

// ✅ Fetch and render bank accounts
function fetchBankAccounts() {
  fetch(`?a=getBankAccountsByAppId`)
    .then(res => res.text())
    .then(text => {
      let list = [];
      try {
        list = JSON.parse(text);
      } catch (e) {
        console.error("Invalid bank data:", text);
        return;
      }
      populateBankDropdown(list);
    })
    .catch(err => console.error("Error fetching banks:", err));
}

function populateBankDropdown(banks) {
  const dropdown = document.getElementById("drpbankaccount");
  dropdown.innerHTML = '<option value="-1">-- Select Bank Account --</option>';

  banks.forEach(b => {
    const opt = document.createElement("option");
    opt.value = b.bank_id;
    opt.text = `${b.bank_name} (${b.account_no})`;
    dropdown.appendChild(opt);
  });
}

// ✅ Toggle bank dropdown based on payment mode
const modeSelect = document.getElementById("drppaymentmode");
if (modeSelect) {
  modeSelect.addEventListener("change", () => {
    const bankRow = document.getElementById("bankAccountRow");
    bankRow.style.display = modeSelect.value === "Cash" ? "none" : "block";
  });
}

// Save Payment
function savePayment() {
  const customerId  = document.getElementById("customerId").value;
  const amount      = document.getElementById("txtpayamount").value.trim();
  const remarks     = document.getElementById("txtremarks").value.trim();
  const invoiceId   = document.getElementById("invoiceDropdown").value;
  const mode        = document.getElementById("drppaymentmode") 
                        ? document.getElementById("drppaymentmode").value 
                        : "";
  const bankId      = document.getElementById("drpbankaccount") 
                        ? document.getElementById("drpbankaccount").value 
                        : "-1";
  const paymentDate = document.getElementById("txtdate").value;

  if (!customerId) { alert("Please select a customer."); return; }
  if (!amount || isNaN(amount) || Number(amount) <= 0) { alert("Please enter a valid amount."); return; }

  const payload = {
    customer_id: customerId,
    amount: Number(amount),
    remarks,
    invoice_id: invoiceId,
    payment_mode: mode,
    bank_id: bankId,
    type: param_type,
    user_id: userdetails.user_id,
    store_id: userdetails.store_id,
    app_id: userdetails.app_id,
    payment_date: paymentDate
  };

  fetch("?a=savePayment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(res => res.text())
  .then(text => {
    let resp;
    try { resp = JSON.parse(text); } 
    catch (e) { console.error("Invalid save response:", text); alert("Server returned invalid response!"); return; }

    if (resp.success) {
      alert("Payment saved successfully!");
      window.location.href = "?a=showHomePage";
    } else {
      alert(resp.message || "Error saving payment!");
    }
  })
  .catch(err => {
    console.error("Error saving payment:", err);
    alert("Network error while saving payment.");
  });
}
