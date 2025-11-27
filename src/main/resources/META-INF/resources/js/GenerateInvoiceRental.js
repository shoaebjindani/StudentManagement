

function resetField()
{
	
	txtcustomerpendingamount.value="0";
	
	document.getElementById("hdnSelectedCustomerType").value=
	grossAmount.innerHTML="0";
	txtitemdiscount.innerHTML="0";
	txtinvoicediscount.value="0";
	txtinvoicediscount.disabled=false;
	totalAmount.innerHTML="0";
	
	txtpaymenttype.value="Paid";
	txtpaymenttype.disabled=false;
	
	drppaymentmode.value="Cash";
	drppaymentmode.disabled=false;
	
	txtpaidamount.value="0";
	txtinvoicedate.value="";
	txtremarks.value="";
	hdnPreviousInvoiceId.value="";	
	
	$("#tblitems").find("tr:gt(0)").remove();

	txtsearchcustomer.value="";
	txtsearchcustomer.disabled=false;
	
	txtinvoicedate.value="${todaysDate}";
	txtinvoicedate.disabled=false;
	txtitem.disabled=false;
	
	txtremarks.value="";
	
	totalQty.innerHTML="0";
	gst.innerHTML="0";
	cgst.innerHTML="0";
	sgst.innerHTML="0";
	toReturn.value="0";
	givenByCustomer.value="0";
	
	chkgeneratePDF.checked=false;
	
	var partialPaymentElementsList=document.getElementsByName('partialPaymentElements');
	for(var x=0;x<partialPaymentElementsList.length;x++)
	{
		partialPaymentElementsList[x].style="display:none";
	}
	
	var paymentModeElements=document.getElementsByName('paymentModeElements');
	for(var x=0;x<paymentModeElements.length;x++)
	{
		paymentModeElements[x].style="display:";
	}
	drppaymentmode.value="Cash";
	btnsave.disabled=false;
	
	hdnSelectedCustomer.value='';
	setDefaultChecks();
		
}
function savedInvoiceCallback(data1)
{
		console.log(data1);
}






function generateInvoice(invoiceId)
{
	
	var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() 
	  {
	    if (xhttp.readyState == 4 && xhttp.status == 200) 
	    { 		      
	    	//alert(xhttp.responseText);
	    	window.open("BufferedImagesFolder/"+xhttp.responseText);		  
		}
	  };
	  xhttp.open("GET","?a=generateInvoicePDF&invoiceId="+invoiceId, false);    
	  xhttp.send();
}


function generateInvoicePdfPrint(invoiceId)
{
	
	var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() 
	  {
	    if (xhttp.readyState == 4 && xhttp.status == 200) 
	    { 	
	    	//window.open("BufferedImagesFolder/"+xhttp.responseText);		  

	    	try
  			{
      		var xhttp2 = new XMLHttpRequest();
      		xhttp2.onreadystatechange = function() {
      	    if (xhttp2.readyState == 4 && xhttp2.status == 200) 
      	    {
      	      //alert(xhttp2.responseText);
      	      
      	      
      	   
      	      
      	      
      	    }
      	  };
      	xhttp2.open("GET", "http://localhost:786/invoiceId="+invoiceId, false);
      	xhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      	xhttp2.send();
  			}
  			catch(ex)
  			{
  				resetField();
  				console.log(ex.message);
  			}
	    	
	    	
	    	
	    	
	    	
	    	
	    			  
		}
	  };
	  xhttp.open("GET","?a=generateInvoicePDF&invoiceId="+invoiceId, false);    
	  xhttp.send();
}
function searchForCustomer(searchString)
{	
	//if(searchString.length<3){return;}

	document.getElementById("closebutton").style.display='none';
	   document.getElementById("loader").style.display='block';
	var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() 
	  {
	    if (xhttp.readyState == 4 && xhttp.status == 200) 
	    { 		      
	    	var cusomerList=JSON.parse(xhttp.responseText);
	    	var reqString="";
	    	for(var x=0;x<cusomerList.length;x++)
	    	{
	    		//console.log(cusomerList[x]);
	    		reqString+="<option id="+cusomerList[x].customer_id+">"+cusomerList[x].customer_name+"~"+cusomerList[x].mobile_number+"~"+cusomerList[x].customer_type+"</option>";
	    	}
	    	
	    	document.getElementById('customerList').innerHTML=reqString;
		}
	  };
	  xhttp.open("GET","?a=searchForCustomer&searchString="+searchString, true);    
	  xhttp.send();
	
	 
	
}

function checkforMatchCustomer()
{
	
	var searchString= document.getElementById("txtsearchcustomer").value;	
	var options1=document.getElementById("customerList").options;
	var customerId=0;
	for(var x=0;x<options1.length;x++)
		{
			if(searchString==options1[x].value)
				{
					customerId=options1[x].id;
					txtitem.focus();
					break;
				}
		}
	if(customerId!=0)
		{
			document.getElementById("hdnSelectedCustomer").value=customerId;			
			document.getElementById("txtsearchcustomer").disabled=true;			
			document.getElementById("hdnSelectedCustomerType").value=document.getElementById("txtsearchcustomer").value.split("~")[2];
			fetchPendingAmountForThisCustomer(customerId);	
		}
	else
		{
			//searchForCustomer(searchString);
		}
	
	
	
}


function fetchPendingAmountForThisCustomer(customerId)
{
	document.getElementById("closebutton").style.display='none';
	   document.getElementById("loader").style.display='block';
	var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() 
	  {
	    if (xhttp.readyState == 4 && xhttp.status == 200) 
	    { 		      
	    	var responseData=JSON.parse(xhttp.responseText);	 
			var details=responseData.reqData;
   	
	    	if(details.pendingAmountDetails.PendingAmount!=undefined)
	    		{
	    			txtcustomerpendingamount.value=details.pendingAmountDetails.PendingAmount;
	    		}
	    	else
	    		{
					//alert("no pending amount for this customer");
	    			//window.location.reload();
	    		}
		}
	  };
	  xhttp.open("GET","?a=getPendingAmountForCustomer&customerId="+customerId, true);    
	  xhttp.send();
}


function checkforMatchItem()
{
	
	
	
	var searchString= document.getElementById("txtitem").value;	
	var options1=document.getElementById("itemList").options;
	
	var itemId=0;
	var purchaseDetailsId=0; 
	for(var x=0;x<options1.length;x++)
		{
			if(searchString==options1[x].value)
				{
				itemId=options1[x].id;
				purchaseDetailsId=options1[x].innerHTML.split('~')[2];				
					break;
				}
		}
	if(itemId!=0)
		{
				// code to check if item already exist inselection				
				getItemDetailsAndAddToTable(itemId,purchaseDetailsId);
				document.getElementById("txtitem").value="";
		}
	else
		{	
			var count=0;
			var ReqString="";
			for(var x=0;x<options1.length;x++)
				{
				var prodCode = options1[x].value.substring(
						options1[x].value.indexOf("(") + 1, 
						options1[x].value.lastIndexOf(")")
					);
					if(prodCode==(searchString.toLowerCase()))
						{
							count++;
							ReqString=options1[x].value;
						}
				}
			
			if(count==1)
				{
					document.getElementById("txtitem").value=ReqString;
					checkforMatchItem();
				}
			
		}
	
}



function getItemDetailsAndAddToTable(itemId, purchaseDetailsId) {
    var itemDetails = document.getElementById("hdn" + itemId).value.split("~");
    console.log(itemDetails);

    var table = document.getElementById("tblitems");
    var row = table.insertRow(-1);

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);
    var cell8 = row.insertCell(7);
    var cell9 = row.insertCell(8);
    var cell10 = row.insertCell(9);
    var cell11 = row.insertCell(10);
	var cell12 = row.insertCell(11);
	var cell13 = row.insertCell(12);

    cell1.innerHTML = "<div>" + Number(table.rows.length - 1) + "</div>" +
        "<input type='hidden' value='" + itemId + "~" + purchaseDetailsId + "'>";

    cell2.innerHTML = "<a onclick=window.open('?a=showItemHistory&itemId=" + itemId + "') href='#'>" +
        itemDetails[0] + " (" + itemDetails[10] + ")</a>";

    // Size
    cell3.innerHTML = "<input type='text' class='form-control form-control-sm' id='txtsize" + itemId + "'>";
	
	// Venue
	cell4.innerHTML = "<input type='text' class='form-control form-control-sm' id='txtvenue" + itemId + "'>";

	// Setup Date
	cell5.innerHTML = "<input type='text' class='form-control form-control-sm datepicker' id='txtsetupdate" + itemId + "'>";	

	// From Date (datepicker)
    cell6.innerHTML = "<input type='text' class='form-control form-control-sm datepicker'  id='txtfromdate" + itemId + "' onchange='calculateDays(" + itemId + ")'>";

    // To Date (datepicker)
    cell7.innerHTML = "<input type='text' class='form-control form-control-sm datepicker' id='txttodate" + itemId + "' onchange='calculateDays(" + itemId + ")'>";    

	// No of Days (calculated)
    cell8.innerHTML = "<input type='text' readonly onkeyup='calculateItemAmount(" + itemId + ")' class='form-control form-control-sm' id='txtdays" + itemId + "'>";

    // Sq Ft
    cell9.innerHTML = "<input type='text' class='form-control form-control-sm' id='txtsqft" + itemId + "' onkeyup='calculateItemAmount(" + itemId + ")'>";

    

    

    // Rate
    cell10.innerHTML = "<input type='text' class='form-control form-control-sm' id='txtrate" + itemId + "' value='" + itemDetails[1] + "' onkeyup='calculateItemAmount(" + itemId + ")'>";	

    // Item Amount
    cell11.innerHTML = "<input type='text' class='form-control form-control-sm' onkeyup='calculateRateFromAmount("+itemId+")' id='txtamount" + itemId + "'>";

    // Delete button
    cell12.innerHTML = '<button type="button" class="btn btn-sm btn-danger" onclick=removethisitem(this)>Delete</button>';

    // Activate datepickers
    $(".datepicker").datepicker({
        dateFormat: "dd/mm/yy"
    });

    document.getElementById("txtsize" + itemId).focus();
}



function checkIfEnterisPressed(evt,txtbox)
{
	
	if(evt.which!=13)
	{
		return;
	}
	
	if((txtbox.id.toString().indexOf('txtqty')!=-1)) // means that enter is pressed on qty
		{
			var itemId=txtbox.id.replace('txtqty','');
			document.getElementById('txtcustomrate'+itemId).focus();
			document.getElementById('txtcustomrate'+itemId).select();			
		}
	
	if((txtbox.id.toString().indexOf('txtcustomrate')!=-1)) // means that enter is pressed on customrate 
	{
		txtitem.focus();
	}
	
		
}

function paymentTypeChanged(selection)
{
		if(selection=="Partial")
			{
				var partialPaymentElementsList=document.getElementsByName('partialPaymentElements');
				for(var x=0;x<partialPaymentElementsList.length;x++)
				{
					partialPaymentElementsList[x].style="display:";
				}
			}
		else
		{
			var partialPaymentElementsList=document.getElementsByName('partialPaymentElements');
			for(var x=0;x<partialPaymentElementsList.length;x++)
			{
				partialPaymentElementsList[x].style="display:none";
			}
		}
		
		
		
		
		if(selection=="Pending")
		{
			var paymentModeElements=document.getElementsByName('paymentModeElements');
			for(var x=0;x<paymentModeElements.length;x++)
			{
				paymentModeElements[x].style="display:none";
			}
			
			drppaymentmode.value="NA";
		}
		else
		{
			var paymentModeElements=document.getElementsByName('paymentModeElements');
			for(var x=0;x<paymentModeElements.length;x++)
			{
				paymentModeElements[x].style="display:";
			}
			drppaymentmode.value="Cash";
		}
		
}

function calculateTotal() {	
    var total = 0;

    var rows = tblitems.rows;
    for (var x = 1; x < rows.length; x++) {
        // Item Amount is at column index 10
        var itemAmount = Number(rows[x].childNodes[10].childNodes[0].value) || 0;
        total += itemAmount;
    }

    // Update Total
    totalAmount.innerHTML = Number(total).toFixed(2);

    // Pending amount = total - paid
    txtpendingamount.innerHTML = Number(total - (Number(txtpaidamount.value) || 0)).toFixed(2);
    
    // Reset GST related fields (not used now)
    sgst.innerHTML = 0;
    cgst.innerHTML = 0;
    gst.innerHTML = 0;

    // Reset discounts (not used now)
    txtitemdiscount.innerHTML = "0.00";
    grossAmount.innerHTML = Number(total).toFixed(2);

    
}

function removethisitem(btn1)
{
	btn1.parentElement.parentElement.remove();
	//reshuffle id's next to this
	
	reshuffleSrNos();
	
	calculateTotal(); 
}

function reshuffleSrNos()
{
	var rows1=tblitems.rows;
	for(var x=1;x<rows1.length;x++)
		{
			rows1[x].childNodes[0].childNodes[0].innerHTML=x;
		}
}

document.getElementById("divTitle").innerHTML="Generate Invoice:- "+"${tentativeSerialNo}";
document.title +=" Generate Invoice:- " + " ${tentativeSerialNo} ";
$("#divBackButton").attr("href", "https://www.w3schools.com/jquery/");


$( "#txtinvoicedate" ).datepicker({ dateFormat: 'dd/mm/yy' });

	
	
	
function returnThisItem(detailsId)
{
		window.location="?a=showReturnScreen&detailsId="+detailsId;
}
function resetCustomer()
{
	window.location.reload();
	txtsearchcustomer.disabled=false;
	txtsearchcustomer.value="";
	hdnSelectedCustomer.value=0;	
}

function addCustomer()
{
	window.open("?a=showAddCustomer&mobileNo="+txtsearchcustomer.value);	
}


function calculateQtyFromAmount(itemId)
{	
	var amount=document.getElementById('txtamount'+itemId).value;
	var customRate=document.getElementById('txtcustomrate'+itemId).value;
	var qty=Number(amount)/Number(customRate);
	document.getElementById('txtqty'+itemId).value=qty;
	calculateTotal();
}

function formatQty(qtyTextBox)
{
	qtyTextBox.value=Number(qtyTextBox.value).toFixed(3);
		
}

function showThisItemIntoSelection(itemId)
{
	
		
				
				
				var rows=tblitems.rows;
				for(var x=1;x<rows.length;x++)
					{							
						if(itemId==rows[x].childNodes[0].childNodes[1].value)
							{
								alert('item already exist in selection');
								document.getElementById("txtitem").value="";
								return;
							}
					}
				
				// code to check if item already exist inselection				
				getItemDetailsAndAddToTable(itemId);
				document.getElementById("txtitem").value="";
		
}


function getPriceForThisCustomer(itemDetails)
{
	
	var customerType=document.getElementById('hdnSelectedCustomerType').value;
	
	if(customerType=="WholeSeller"){return itemDetails[2];}
	if(customerType=="Franchise"){return itemDetails[3];}
	if(customerType=="LoyalCustomer3"){return itemDetails[4];}
	if(customerType=="LoyalCustomer2"){return itemDetails[5];}
	if(customerType=="LoyalCustomer1"){return itemDetails[6];}
	if(customerType=="Distributor"){return itemDetails[7];}
	if(customerType=="Business2Business"){return itemDetails[8];;}
	if(customerType=="shrikhand"){return itemDetails[9];}
	
	return itemDetails[1];	
}

function quickAddCustomer()
{
	document.getElementById("closebutton").style.display='none';
	   document.getElementById("loader").style.display='block';
	var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() 
	  {
	    if (xhttp.readyState == 4 && xhttp.status == 200) 
	    { 		      
	    	
	    	
	    	if(xhttp.responseText.split("~")[1]==0)
	    		{
	    			alert(xhttp.responseText.split("~")[0]);
	    			return;
	    		}
	    		
	    	txtsearchcustomer.disabled=true;
	    	txtsearchcustomer.value=customerName.value+"~"+mobileNumber.value+"~"+customerType.value;
	    	customerName.value="";
	    	mobileNumber.value="";
	    	
	    	hdnSelectedCustomer.value=xhttp.responseText.split("~")[1];
	    	hdnSelectedCustomerType.value=customerType.value;
		}
	  };
	  xhttp.open("GET","?a=saveCustomerServiceAjax&appId=${userdetails.app_id}"+"&customerName="+customerName.value+"&mobileNumber="+mobileNumber.value+"&customerType="+customerType.value, true);    
	  xhttp.send();
}

function addremoveQuantity(itemId,addRemoveFlag) // 0 removes and 1 adds
{
	
	var	qtyElement=document.getElementById('txtqty'+itemId);
	var quantity=Number(qtyElement.value);
	
	if(quantity==1 && addRemoveFlag==0)
		{
			return;
		}
	
	if(addRemoveFlag==1)
		{
			quantity++;	
		}
	
	if(addRemoveFlag==0)
	{
		quantity--;	
	}
	
	qtyElement.value=quantity;
	formatQty(document.getElementById("txtqty"+itemId));
	
}

function closeModalFast()
{
	$("#myModal").modal('hide');
}

	
	
document.addEventListener("keypress", function onPress(event) {
	
    
});

window.addEventListener('keydown', function (e) {
	if(event.which==113)
	{
		saveInvoice();
	} 
	});
	



$('[data-widget="pushmenu"]').PushMenu("collapse");


function calculateReturnAmount()
{
	try
	{
		toReturn.value=  (Number(givenByCustomer.value)-Number(totalAmount.innerHTML)).toFixed(2);
	}
	catch(ex)
	{
		console.log(ex.message);
	}
	
}








// need to bring thhis flag from db saved for later
document.getElementById('row7').className='col-sm-12';
categoryPopulate.style="display:none";

function setDefaultChecks()
{
	if("${userdetails.invoice_default_checked_print}"=='Y')
		{
			chkprintinvoice.checked=true;		
		}
	
	if("${userdetails.invoice_default_checked_generatepdf}"=='Y')
	{
		chkgeneratePDF.checked=true;		
	}

}

setDefaultChecks();


function showLedger()
{
	window.open('?a=showCustomerLedger&txtfromdate=${todaysDateMinusOneMonth}&txttodate='+txtinvoicedate.value+'&customerId='+hdnSelectedCustomer.value);
}




function calculateDays(itemId) {
    let fromDate = document.getElementById("txtfromdate" + itemId).value;
    let toDate = document.getElementById("txttodate" + itemId).value;

    if (fromDate && toDate) {
        let partsFrom = fromDate.split("/");
        let partsTo = toDate.split("/");

        let d1 = new Date(partsFrom[2], partsFrom[1] - 1, partsFrom[0]);
        let d2 = new Date(partsTo[2], partsTo[1] - 1, partsTo[0]);

        let timeDiff = d2.getTime() - d1.getTime();
        let days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

        if (days > 0) {
            document.getElementById("txtdays" + itemId).value = days;
        } else {
            document.getElementById("txtdays" + itemId).value = "";
        }
    }
    calculateItemAmount(itemId);  // 🔥 trigger item amount recalc
}


function calculateItemAmount(itemId) {
    var rate = Number(document.getElementById('txtrate' + itemId).value) || 0;
    var sqft = Number(document.getElementById('txtsqft' + itemId).value) || 0;
	var noOfDays= document.getElementById('txtdays' + itemId).value;

    

 
    // Calculate item amount = rate * noOfDays * sqft
    var amount = (rate * noOfDays * sqft).toFixed(2);

    // Update amount in table
    document.getElementById('txtamount' + itemId).value = amount;

    // Recalculate grand total
    calculateTotal();
}





function calculateDays(itemId) {
    let fromDate = document.getElementById("txtfromdate" + itemId).value;
    let toDate = document.getElementById("txttodate" + itemId).value;

    if (fromDate && toDate) {
        let partsFrom = fromDate.split("/");
        let partsTo = toDate.split("/");

        let d1 = new Date(partsFrom[2], partsFrom[1] - 1, partsFrom[0]);
        let d2 = new Date(partsTo[2], partsTo[1] - 1, partsTo[0]);

        let timeDiff = d2.getTime() - d1.getTime();
        let days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // inclusive of both dates

        if (days > 0) {
            document.getElementById("txtdays" + itemId).value = days;
        } else {
            document.getElementById("txtdays" + itemId).value = "";
        }
    }
}




function calculateRateFromAmount(itemId) {
    var amount = Number(document.getElementById('txtamount' + itemId).value) || 0;
    var sqft = Number(document.getElementById('txtsqft' + itemId).value) || 0;
    var noOfDays = Number(document.getElementById('txtdays' + itemId).value) || 0;

    if (sqft > 0 && noOfDays > 0) {
        var rate = (amount / (sqft * noOfDays)).toFixed(2);
        document.getElementById('txtrate' + itemId).value = rate;
    } else {
        document.getElementById('txtrate' + itemId).value = 0;
    }

    // Recalculate grand total (if needed)
    calculateTotal();
}



function saveInvoice() {
    btnsave.disabled = true;

    if ((txtpaymenttype.value == "Pending" || txtpaymenttype.value == "Partial") && hdnSelectedCustomer.value == "") {
        alert("This Payment type is not supported for Unknown customers");
        return;
    }

    var rows = tblitems.rows;
    var items = [];

    for (var x = 1; x < rows.length; x++) {
        var row = rows[x];

        // hidden input (itemId~purchaseDetailsId) is in first cell
        var hiddenVal = row.cells[0].querySelector("input[type='hidden']").value;
        var parts = hiddenVal.split("~");
        var itemId = parts[0];
        var purchaseDetailsId = parts.length > 1 ? parts[1] : null;

        var itemData = {
            srNo: row.cells[0].innerText.trim(),
            itemId: itemId,
            purchaseDetailsId: purchaseDetailsId,
            itemName: row.cells[1].innerText.trim(),
            size: document.getElementById("txtsize" + itemId).value,
            venue: document.getElementById("txtvenue" + itemId).value,
            setupDate: document.getElementById("txtsetupdate" + itemId).value,
            fromDate: document.getElementById("txtfromdate" + itemId).value,
            toDate: document.getElementById("txttodate" + itemId).value,
            noOfDays: document.getElementById("txtdays" + itemId).value,
            sqFt: document.getElementById("txtsqft" + itemId).value,
            rate: document.getElementById("txtrate" + itemId).value,
            itemAmount: document.getElementById("txtamount" + itemId).value
        };

        items.push(itemData);
    }

    var payload = {
        customerId: hdnSelectedCustomer.value,
        customerType: hdnSelectedCustomerType.value,
        invoiceDate: txtinvoicedate.value,
        paymentType: txtpaymenttype.value,
        paymentMode: drppaymentmode.value,
        paidAmount: (document.getElementById("txtpaidamount") ? document.getElementById("txtpaidamount").value : 0),
        invoiceDiscount: document.getElementById("txtinvoicediscount").value,
        itemDiscount: document.getElementById("txtitemdiscount").innerHTML,
        remarks: document.getElementById("txtremarks").value,
        items: items,
        total_sgst: sgst.innerHTML,
        total_cgst: cgst.innerHTML,
        total_gst: gst.innerHTML,
        gross_amount: grossAmount.innerHTML,
        total_amount: totalAmount.innerHTML
    };

    console.log(payload);

    $.ajax({
        url: "?a=saveInvoiceRental",
        method: "POST",
        data: JSON.stringify(payload),
        contentType: "application/json",
        success: function(response) {
            alert("Invoice saved successfully!");
            window.location = "?a=showHomePage";
        },
        error: function(err) {
            alert("Error saving invoice");
            btnsave.disabled = false;
        }
    });
}
