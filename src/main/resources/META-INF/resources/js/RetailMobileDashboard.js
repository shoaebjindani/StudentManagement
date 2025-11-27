/* Toggle Speed Dial */
function toggleSpeedDial() {
	const sd = document.getElementById("speedDial");
	sd.classList.toggle("open");
}

/* Auto-close when clicking outside */
document.addEventListener("click", function(e) {
	const sd = document.getElementById("speedDial");
	if (!sd.contains(e.target)) {
		sd.classList.remove("open");
	}
});

/* Invoice Search */
function searchInvoiceNew(){
	const invoiceNo = document.getElementById("invoiceNo").value.trim();

	if(invoiceNo){
		window.location.href =
			'?a=generateDailyInvoiceReport&txtfromdate=23/01/1992&invoice_no=' +
			encodeURIComponent(invoiceNo);
	} else {
		alert("Please enter an invoice number.");
	}
}
