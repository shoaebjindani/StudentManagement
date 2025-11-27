function printDirectAsFonts(invoiceNo, pendAmount) {
    try {
        if (invoiceNo == null) {
            alert("invoice No found as null");
            return;
        }

        var xhttp = new XMLHttpRequest();
        var invoiceResponse;
        var invoiceDetails;
        var listOfItems;

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                invoiceResponse = JSON.parse(xhttp.responseText);
                invoiceDetails = invoiceResponse.invoiceDetails;
                listOfItems = invoiceDetails.listOfItems;
            }
        };
        xhttp.open("GET", "?a=getInvoiceDetailsByNoAjax&invoiceNo=" + invoiceNo, false);
        xhttp.send();

        var topay = Number(invoiceDetails.total_amount) - Number(invoiceDetails.paid_amount);

        var c = new PosPrinterJob(getCurrentDriver(), getCurrentTransport());
        c.initialize();

        c.printText("Invoice Estimate: " + invoiceDetails.invoice_no, c.ALIGNMENT_CENTER, c.FONT_SIZE_MEDIUM2);
        c.printText(invoiceDetails.store_name, c.ALIGNMENT_CENTER, c.FONT_SIZE_BIG).bold(true);

        c.printText(invoiceDetails.address_line_1 + " " + invoiceDetails.address_line_2, c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL);
        c.printText(invoiceDetails.address_line_3, c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL);

        c.printText("Phone:- " + invoiceDetails.mobile_no, c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL);
        c.printText("Store Timings:- " + invoiceDetails.store_timing, c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL);

        c.printText("----------------------------------------------------------------", c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL);

        if (invoiceDetails.customer_name != null) {
            c.printText("Name : " + invoiceDetails.customer_name, c.ALIGNMENT_LEFT, c.FONT_SIZE_NORMAL);
        }
        c.printText("Date & Time : " + invoiceDetails.theUpdatedDate, c.ALIGNMENT_LEFT, c.FONT_SIZE_NORMAL);
        c.printText("Payment Type : " + invoiceDetails.payment_type, c.ALIGNMENT_LEFT, c.FONT_SIZE_NORMAL);
        if (invoiceDetails.payment_type != 'Pending') {
            c.printText("Payment Mode : " + invoiceDetails.payment_mode, c.ALIGNMENT_LEFT, c.FONT_SIZE_NORMAL);
        }

        c.printText("----------------------------------------------------------------", c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL);
        c.printText("SR   ITEM NAME                       QTYxRATE     AMOUNT", c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL);
        c.printText("----------------------------------------------------------------", c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL);

        // --- Print items using the new function ---
        for (var m = 0; m < listOfItems.length; m++) {
            var item = listOfItems[m];            
			printItem(c, m + 1, item.item_name.toUpperCase(), item.qty, Number(item.custom_rate).toFixed(2), Number(item.qty) * Number(item.custom_rate));

        }

        c.printText("----------------------------------------------------------------", c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL);

        var totalQty = listOfItems.reduce((sum, item) => sum + Number(item.qty), 0);
        c.printText("Total Qty : " + totalQty, c.ALIGNMENT_RIGHT, c.FONT_SIZE_NORMAL);

        if (invoiceDetails.invoice_discount != '' && invoiceDetails.invoice_discount != '0.00') {
            c.printText("----------------------------------------------------------------", c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL);
            c.printText("Invoice Discount :  " + invoiceDetails.invoice_discount, c.ALIGNMENT_RIGHT, c.FONT_SIZE_SMALL);
        }

        if (invoiceDetails.remarks != '') {
            c.printText("----------------------------------------------------------------", c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL);
            c.printText("Remarks :  " + invoiceDetails.remarks, c.ALIGNMENT_LEFT, c.FONT_SIZE_SMALL);
        }

        if (invoiceDetails.payment_type == 'Partial') {
            c.printText("----------------------------------------------------------------", c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL);
            c.printText("Total Amount :  " + Number(invoiceDetails.total_amount), c.ALIGNMENT_RIGHT, c.FONT_SIZE_MEDIUM1);

            c.printText("----------------------------------------------------------------", c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL);
            c.printText("Partially Paid Amount :  " + invoiceDetails.paid_amount, c.ALIGNMENT_RIGHT, c.FONT_SIZE_MEDIUM1);
            topay = Number(invoiceDetails.total_amount) - Number(invoiceDetails.paid_amount);
        }

        c.printText("----------------------------------------------------------------", c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL);
        c.printText("Total Amount :  " + Number(invoiceDetails.total_amount), c.ALIGNMENT_RIGHT, c.FONT_SIZE_MEDIUM1);
        
        if( pendAmount!=undefined && pendAmount!=0.00 &&  pendAmount!="0.00")
        {
            c.printText("----------------------------------------------------------------", c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL);
            c.printText("Previous Due Amount :  "+pendAmount, c.ALIGNMENT_LEFT, c.FONT_SIZE_SMALL); // Payment Type
        }

        c.printText("****************************************************************", c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL);
        c.printText("*Thank You, Visit Again*", c.ALIGNMENT_CENTER, c.FONT_SIZE_NORMAL);

        c.feed(3);
        c.execute();

        alert('Print Command Sent Successfully');
        

    } catch (ex) {
        alert(ex.message);
    }

    

	function printItem(c, srNo, itemName, qty, rate, amount) {
    const font = c.FONT_SIZE_NORMAL;
    const maxChars = 46; // max characters per line

    const srStr = srNo + " "; // no dot, just space after number
    const qtyRateStr = `${qty} x ${rate}`;
    const amountStr = amount.toFixed(2).padStart(7); // amount right-aligned

    // Calculate reserved width on the right (qtyRate + amount + spaces)
    const reservedRightWidth = qtyRateStr.length + amountStr.length + 2; // 2 spaces as separators
    const availableNameWidth = maxChars - srStr.length - reservedRightWidth;

    if (itemName.length <= availableNameWidth) {
        // Item name fits on one line
        const line = srStr + itemName.padEnd(availableNameWidth) + " " + qtyRateStr + " " + amountStr;
        c.printText(line, c.ALIGNMENT_LEFT, font);
    } else {
        // Item name too long - split to two lines
        const firstLineName = itemName.substring(0, availableNameWidth);
        const secondLineName = itemName.substring(availableNameWidth);

        // First line: srNo + partial item name + qty x rate + amount
        const firstLine = srStr + firstLineName.padEnd(availableNameWidth) + " " + qtyRateStr + " " + amountStr;
        c.printText(firstLine, c.ALIGNMENT_LEFT, font);

        // Second line: indent to start of item name, print remaining name only
        const indentSpaces = " ".repeat(srStr.length);
        c.printText(indentSpaces + secondLineName, c.ALIGNMENT_LEFT, font);
    }
}



}
