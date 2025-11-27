let cart = [];




function fetchItems(category_name) {    
    fetch('?a=getItemsForThisCategoryNameByAjax&category_name=' + encodeURIComponent(category_name))
        .then(response => response.text()) // Read as plain text
        .then(text => {
            let data;
            try {
                data = JSON.parse(text); // Parse string into JSON
				console.log(text);
            } catch (err) {
                console.error("Error parsing JSON:", err, text);
                return;
            }
            renderItems(data);
        })
        .catch(err => {
            console.error("Error fetching items:", err);
        });
}

// Render items in the right panel
function renderItems(items) {
    itemsDiv.innerHTML = "";
    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "item-card";
        card.innerHTML =
            '<h4>' + item.item_name + '</h4>' +
            '';
        
              card.addEventListener("click", () => {
            addToCart(item.item_id, item.category_name+" "+item.item_name, item.price);
        });

        itemsDiv.appendChild(card);
    });
}

	



function renderCart(focusLast = false) {
    const cartItemsTbody = document.getElementById("cart-items");
    const cartTotalDiv = document.getElementById("cart-total");

    cartItemsTbody.innerHTML = "";
    let total = 0;

    cart.forEach((item, idx) => {
        const itemAmount = item.pieces * item.price;
        total += itemAmount;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>
                <input id="qty-${idx}" type="number" min="1" step="1" value="${item.pieces}" 
                       onchange="updateCartField(${idx}, 'pieces', this.value)">
            </td>
            <td>
                <input id="weight-${idx}" type="number" step="0.01" value="${item.weight}" 
                       onchange="updateCartField(${idx}, 'weight', this.value)">
            </td>
            <td>
                <input id="size-${idx}" type="number" step="0.01" value="${item.size || ''}" 
                       onchange="updateCartField(${idx}, 'size', this.value)">
            </td>
            <td>
                <input id="amount-${idx}" type="number" step="0.01" min="0" value="${itemAmount.toFixed(2)}"
                       onchange="updateCartField(${idx}, 'amount', this.value)">
            </td>
            <td><span class="remove-btn" onclick="removeFromCart(${idx})">✖</span></td>
        `;
        cartItemsTbody.appendChild(row);
    });

    cartTotalDiv.innerText = "Total: " + total.toFixed(2);

    // 👇 Focus qty for last added item
    if (focusLast && cart.length > 0) {
        const lastIdx = cart.length - 1;
        const qtyInput = document.getElementById("qty-" + lastIdx);
        if (qtyInput) {
            qtyInput.focus();
            qtyInput.select();
        }
    }

    // 👇 Enter key navigation: Qty → Weight → Size → Amount → next Qty
    cart.forEach((_, idx) => {
        const qtyInput = document.getElementById("qty-" + idx);
        const weightInput = document.getElementById("weight-" + idx);
        const sizeInput = document.getElementById("size-" + idx);
        const amountInput = document.getElementById("amount-" + idx);

        if (qtyInput && weightInput) {
            qtyInput.addEventListener("keydown", e => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    weightInput.focus();
                    weightInput.select();
                }
            });
        }

        if (weightInput && sizeInput) {
            weightInput.addEventListener("keydown", e => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    sizeInput.focus();
                    sizeInput.select();
                }
            });
        }

        if (sizeInput && amountInput) {
            sizeInput.addEventListener("keydown", e => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    amountInput.focus();
                    amountInput.select();
                }
            });
        }

        if (amountInput) {
            amountInput.addEventListener("keydown", e => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    const nextQty = document.getElementById("qty-" + (idx + 1));
                    if (nextQty) {
                        nextQty.focus();
                        nextQty.select();
                    }
                }
            });
        }
    });
}



function addToCart(id, name, price) {
    cart.push({
        id: id,
        name: name,
        price: price,
        pieces: 1,
        weight: ""
    });
    renderCart(true); // pass true → focus last qty
}

function updateCartField(idx, field, value) {
    if (field === "pieces") {
        cart[idx].pieces = parseInt(value) || 1;
    } else if (field === "weight") {
        cart[idx].weight = parseFloat(value) || 0;
    } else if (field === "size") {
        cart[idx].size = parseFloat(value) || 0;
    } else if (field === "amount") {
        // override calculated price based on amount entered
        const newAmount = parseFloat(value) || 0;
        cart[idx].price = newAmount / (cart[idx].pieces || 1);
    }
    renderCart();
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
			
		}
	
	
	
}
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
	    			txtcustomerpendingamount.value=details.pendingAmountDetails.PendingAmount;
	    			pendingamount=details.pendingAmountDetails.PendingAmount;
	    		}
	    	else
	    		{
	    			pendingamount=0;
					//alert("no pending amount for this customer");
	    			//window.location.reload();
	    		}
			
			if(details.LastMonthSalesDetails.lstSalesAmount!=undefined)
	    		{
	    			txtcustomerlastmonthsale.value=details.LastMonthSalesDetails.lstSalesAmount;
	    			//pendingamount=details.pendingAmountDetails.PendingAmount;
	    		}
	    	else
	    		{
	    			pendingamount=0;
					//alert("no pending amount for this customer");
	    			//window.location.reload();
	    		}
		}
	  };
	  xhttp.open("GET","?a=getPendingAmountForCustomer&customerId="+customerId, true);    
	  xhttp.send();
}
function getItemDetailsAndAddToTable(itemId)
{
		      
	
	
		var itemDetails=document.getElementById("hdn"+itemId).value.split("~");
		
	
	    	
	    	//console.log(itemDetails);
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
	    	
	    	
	    	
	    	
	    	//
	    	
	    	cell1.innerHTML = "<div>"+Number(table.rows.length-1)+"</div>" +"<input type='hidden' value='"+itemId+"'>";
	    	cell2.innerHTML = "<a onclick=window.open('?a=showItemHistory&itemId="+itemId+"') href='#'>"+ itemDetails[5] + " "+itemDetails[0]+" </a>";
	    	cell3.innerHTML = '<div class="input-group"><span class="input-group-btn"><button class="btn btn-info" type="button" onclick="addremoveQuantity(this,0)"><i class="fa fa-minus"></i></button></span><input type="tel" style="text-align:center" class="form-control form-control-sm"  id="txtqty'+itemId+'" onkeyup="calculateAmount(this.parentNode.parentNode.parentNode);checkIfEnterisPressed(event,this);"  onkeypress="digitsOnlyWithDot(event);" value="1"> <input type="hidden" class="form-control form-control-sm"  readonly id="hdnavailableqty'+itemId+'" value='+itemDetails[2]+'><span class="input-group-btn"><button class="btn btn-info" type="button" onclick="addremoveQuantity(this,1)"><i class="fa fa-plus"></i></button></span></div>';
	    	cell4.innerHTML='<div class="input-group"><input type="text" readonly style="display:none" class="form-control form-control-sm" value="'+itemDetails[1]+'" id="txtrate'+itemId+'">  <input type="tel" class="form-control form-control-sm" id="txtcustomrate'+itemId+'" onfocus="checkforZero(this)"   onkeyup="checkIfEnterisPressed(event,this)" onkeypress="digitsOnlyWithDot(event)" style="width:50%;display:none">      <input type="tel" class="form-control form-control-sm" id="txtweight'+itemId+'" onfocus="checkforZero(this)"   onblur="formatQty(this);" onkeyup="checkIfEnterisPressed(event,this);calculateTotal()" onkeypress="digitsOnlyWithDot(event);" style="width:50%"> <input type="tel" class="form-control form-control-sm" id="txtsize'+itemId+'" onfocus="checkforZero(this)"   onkeyup="checkIfEnterisPressed(event,this)"  value="0" style="width:50%">  </div>';
	    	
	    	cell5.innerHTML = "<input type='tel' class='form-control form-control-sm' value='0' id='txtamount"+itemId+"' onfocus='checkforZero(this)' onkeyup='calculateCustomRateFromAmount(this.parentNode.parentNode);calculateAmount(this.parentNode.parentNode)'>";
	    	
	    	
	    	 var sgstAmount=0;
		    var cgstAmount=0;
		    
		    var customRate=itemDetails[1];
		    
		    sgstAmount=(Number(customRate)*Number(itemDetails[3])/100) + Number(customRate);
		    cgstAmount=(Number(customRate)*Number(itemDetails[4])/100) + Number(customRate);
		    
		       
		    
		    
		    cell6.innerHTML = "<div class='input-group'>  <input type='text' readonly class='form-control form-control-sm' name='txtsgstamountgroup' id='txtsgstamount"+itemId+"' value='"+sgstAmount+"'   style='width:25%'>      <input type='text' style='width:25%' class='form-control form-control-sm' onkeyup='calculateAmount(this.parentNode.parentNode.parentNode)' id='txtsgstpercent"+itemId+"' value='"+itemDetails[3]+"'> <input type='text' readonly class='form-control form-control-sm' name='txtcgstamountgroup' id='txtcgstamount"+itemId+"' value='"+cgstAmount+"'   style='width:25%'>      <input type='text' style='width:25%' class='form-control form-control-sm' onkeyup='calculateAmount(this.parentNode.parentNode.parentNode)' id='txtcgstpercent"+itemId+"' value='"+itemDetails[4]+"'> <input type='hidden' id='txtgstamount"+itemId+"'  /></div>";
		   
	    	//cell6.innerHTML = "<input type='text' class='form-control form-control-sm' value='0' readonly id='gst"+itemId+"' onkeyup='calculateAmount("+itemId+")'> <input type='hidden' id='hdngst"+itemId+"' value=" +itemDetails[3]+ ">";
	    	
		    cell7.innerHTML = '<button type="button" class="btn btn-sm btn-danger"  onclick=removethisitem(this) id="btn11" style="cursor:pointer">Delete</button>';
	    	calculateCustomRateFromAmount(row);
	    	calculateAmount(row);
	    	calculateTotal();
	    	row.childNodes[2].childNodes[0].childNodes[1].select();
	    	row.childNodes[2].childNodes[0].childNodes[1].focus();	    
}
function calculateAmount(rowElement)
{
	
	
	
	var customrate=rowElement.childNodes[3].childNodes[0].childNodes[2].value;	
	var rate=rowElement.childNodes[3].childNodes[0].childNodes[0].value;
	var qty=rowElement.childNodes[2].childNodes[0].childNodes[1].value;
	
	var amount=(Number(customrate) *Number(qty) ).toFixed(2);
		 
	
	//document.getElementById('txtqty'+itemId).parentNode.parentNode.parentNode.childNodes[6].childNodes[0].value= (Number(customrate) *Number(qty) ).toFixed(2);
	
	var itemDiscount=(Number(rate) - Number(customrate)) *  Number(qty);
	
	var itemId=rowElement.childNodes[2].childNodes[0].childNodes[1].id.replace('txtqty','');
	
	
	var itemSGSTPercentage=document.getElementById('txtsgstpercent'+itemId).value;
	var itemCGSTPercentage=document.getElementById('txtcgstpercent'+itemId).value;
	
	var SGSTAmount=0;
	var CGSTAmount=0;
	
			SGSTAmount=(Number(customrate) *Number(qty) )*itemSGSTPercentage / 100;
			
			document.getElementById('txtsgstamount'+itemId).value=SGSTAmount;
			
			CGSTAmount=(Number(customrate) *Number(qty) )*itemCGSTPercentage / 100;
			document.getElementById('txtcgstamount'+itemId).value=CGSTAmount;
			
			document.getElementById('txtgstamount'+itemId).value= Number(SGSTAmount) + Number(CGSTAmount);
			
	calculateTotal();
}
function checkIfEnterisPressed(evt,txtbox)
{
	
	if(evt.which!=13)
	{
		return;
	}
	
	if((txtbox.id.toString().indexOf('txtqty')!=-1)) // means that enter is pressed on qty
		{
			txtbox.parentNode.parentNode.parentNode.childNodes[3].childNodes[0].childNodes[4].select();
		}	
	if((txtbox.id.toString().indexOf('txtweight')!=-1)) // means that enter is pressed on customrate 
	{
		txtbox.parentNode.parentNode.parentNode.childNodes[3].childNodes[0].childNodes[6].select();
	}
	
	if((txtbox.id.toString().indexOf('txtsize')!=-1)) // means that enter is pressed on customrate 
	{
		txtbox.parentNode.parentNode.parentNode.childNodes[4].childNodes[0].select();
		
	}
	
	
	
	if((txtbox.id.toString().indexOf('txtamount')!=-1)) // means that enter is pressed on weight 
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
function calculateTotal()
{	
		var total=0;
		var totalQtyCalculated=0;
		var totalDiscountCalculated=0;
		var grossAmountCalculated=0;
		var totalSGSTCalculated=0;
		var totalCGSTCalculated=0;
		var totalWeightCalculated=0;
		
		var rows=tblitems.rows;
		for(var x=1;x<rows.length;x++)
			{
				var itemTotalAmount=Number(rows[x].childNodes[4].childNodes[0].value);
				total+=itemTotalAmount;
				
				var itemQty=Number(rows[x].childNodes[2].childNodes[0].childNodes[1].value);
				
				totalQtyCalculated+=itemQty;
				
				var rate=Number(rows[x].childNodes[3].childNodes[0].value);
				var grossItemAmount=itemTotalAmount;
				totalDiscountCalculated+=grossItemAmount  -itemTotalAmount;
				
				grossAmountCalculated+=grossItemAmount;
				
				totalSGSTCalculated+=Number(rows[x].childNodes[5].childNodes[0].childNodes[1].value);
				totalCGSTCalculated+=Number(rows[x].childNodes[5].childNodes[0].childNodes[5].value);			
				
				
				
				
				totalWeightCalculated+=Number(rows[x].childNodes[3].childNodes[0].childNodes[4].value);
			}
		
		
		total=total-txtinvoicediscount.value+Number(totalSGSTCalculated)+Number(totalCGSTCalculated);
		totalAmount.innerHTML=Number(total).toFixed(2);
		totalQty.innerHTML=Number(totalQtyCalculated).toFixed(2);
		txtitemdiscount.innerHTML=Number(totalDiscountCalculated).toFixed(2);
		grossAmount.innerHTML=Number(grossAmountCalculated).toFixed(2);
		
		txtpendingamount.innerHTML=Number(total-txtpaidamount.value).toFixed(2);
		// 
		if(chkgstEnabled.checked)
			{	
				sgst.innerHTML=Number(totalSGSTCalculated).toFixed(2);
				cgst.innerHTML=Number(totalCGSTCalculated).toFixed(2);
				gst.innerHTML=Number(Number(totalCGSTCalculated)+Number(totalSGSTCalculated)).toFixed(2);
			}
		else
			{
			sgst.innerHTML=0;
			cgst.innerHTML=0;
			gst.innerHTML=0;
			}
		
		txttotalweight.value=Number(totalWeightCalculated).toFixed(3);
		
		
		calculateReturnAmount();
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



function checkforZero(obj)
{
	
	if(obj.value=="0.00" || obj.value=="0" || obj.value=="0.000")		
		obj.value="";
}
function formatQty(qtyTextBox)
{
	qtyTextBox.value=Number(qtyTextBox.value).toFixed(3);		
}
txtitemdiscount.parentNode.style="display:none";
function hideOthers()
{
	
	var Elements=document.getElementById("custom-tabs-one-tab").childNodes;
	for(var m=0;m<Elements.length;m++)
		{
		
		
			if(m%2!=0)
				{
				Elements[m].childNodes[0].style="display:block";
					var itemGroup=document.getElementById("itemGroup").value;
					if(!Elements[m].childNodes[0].innerHTML.toString().startsWith(itemGroup))
					{
						Elements[m].childNodes[0].style="display:none";
					}
				}
		}
}
function setDefaultChecks()
{
	if("${returnData.invoice_default_checked_print}"=='Y')
		{
			chkprintinvoice.checked=true;		
		}
	
	if("${returnData.invoice_default_checked_generatepdf}"=='Y')
	{
		chkgeneratePDF.checked=true;		
	}
	itemGroup.value="G";
	hideOthers();
}
setDefaultChecks();
function copyThisToNewCustomer()
{
		mobileNumber.value=txtsearchcustomer.value;
}
paymentTypeChanged(txtpaymenttype.value);
function printDirectAsFonts(invoiceNo,pendAmount) 
{
	
	
	
	try
	{
		
		if(invoiceNo==null)
			{
				alert("invoice No found as null");
				return;
			}
	
	var xhttp = new XMLHttpRequest();
	var invoiceResponse;
	var invoiceDetails;
	var listOfItems;
	
		  xhttp.onreadystatechange = function() 
		  {
		    if (xhttp.readyState == 4 && xhttp.status == 200) 
		    { 		      
		    	console.log(xhttp.responseText);
		       invoiceResponse=JSON.parse(xhttp.responseText);
		       invoiceDetails=(invoiceResponse.invoiceDetails);
		       listOfItems=invoiceDetails.listOfItems;
		       console.log(listOfItems);
		   		
			}
		  };
		  xhttp.open("GET","?a=getInvoiceDetailsByNoAjax&invoiceNo="+invoiceNo, false);    
		  xhttp.send();
		
		  console.log(invoiceDetails.invoice_no);
		  var topay=Number(invoiceDetails.total_amount)-Number(invoiceDetails.paid_amount);
			
    var c = new PosPrinterJob(getCurrentDriver(), getCurrentTransport());
    c.initialize();
     c.printText("Invoice Estimate: "+invoiceDetails.invoice_no, c.ALIGNMENT_CENTER, c.FONT_SIZE_MEDIUM2); // Invoice no   
    c.printText(invoiceDetails.store_name, c.ALIGNMENT_CENTER, c.FONT_SIZE_BIG).bold(true); // store name
    
    c.printText(invoiceDetails.address_line_1 + invoiceDetails.address_line_2, c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL); // address line 1
    c.printText(invoiceDetails.address_line_3, c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL); // address line 2     
    
    //c.printText(invoiceDetails.city+" - "+invoiceDetails.pincode, c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL); // city pincode
    
    c.printText("Phone:- "+invoiceDetails.mobile_no, c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL); // mobile
    c.printText("Store Timings:- "+invoiceDetails.store_timing, c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL); // timings
    
    c.printText("----------------------------------------------------------------", c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL); // mobile
    
		    c.printText("Name : "+invoiceDetails.customer_name, c.ALIGNMENT_LEFT, c.FONT_SIZE_NORMAL); // Name
		    c.printText("Date & Time : "+invoiceDetails.theUpdatedDate, c.ALIGNMENT_LEFT, c.FONT_SIZE_NORMAL); // Date & Time
		    c.printText("Payment Type : "+invoiceDetails.payment_type, c.ALIGNMENT_LEFT, c.FONT_SIZE_NORMAL); // Payment Type
    if(invoiceDetails.payment_type!='Pending')
    	{
    		c.printText("Payment Mode : "+invoiceDetails.payment_mode, c.ALIGNMENT_LEFT, c.FONT_SIZE_NORMAL); // Payment Type
    	}
    
    c.printText("----------------------------------------------------------------", c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL); // mobile
    
    c.printText("SR       ITEM NAME      QTY       WT.     Amount", c.ALIGNMENT_LEFT, c.FONT_SIZE_NORMAL); // Payment Type
    
    c.printText("----------------------------------------------------------------", c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL); // mobile
    var template="$sr$itemName0123456789$QTY5678901$WT456789$Amount";
    var totalWeight=0;
    var totalQty=0;
    for(var m=0;m<listOfItems.length;m++)
    	{
    	var srnumber=m+1;
    	if(srnumber<=9)
    		{
    			srnumber="0"+srnumber;
    		}
    	
    	var oneLiner=template.replace("$sr",srnumber);
    	totalWeight+=Number(listOfItems[m].weight);
    	totalQty+=Number(listOfItems[m].qty);    	
    	
    	var custom_rate=listOfItems[m].custom_rate;
    	var qtyNum=listOfItems[m].qty;
    	var Amount=Number(custom_rate)*Number(qtyNum);    	
    	Amount=Amount.toFixed(0);
    	
    	var catName=listOfItems[m].category_name
    	for(k=0;k<18;k++)
    		{
	    		if(catName.length<18)
	    		{
	    			if(k%2==0){catName+=" ";}
	    			if(k%2!=0){catName=" "+catName;}
	    		}
    		}
    	
    	var qtyWithWhiteSpaces=listOfItems[m].qty;
    	for(k=0;k<12;k++)
    		{
	    		if(qtyWithWhiteSpaces.toString().length<12)
	    		{
	    			if(k%2==0){qtyWithWhiteSpaces+=" ";}
	    			if(k%2!=0){qtyWithWhiteSpaces=" "+qtyWithWhiteSpaces;}	    					
	    		}
    		}
    	
    	
    	var weightWithWhiteSpace=Number(listOfItems[m].weight).toFixed(3);
    	for(k=0;k<9;k++)
    		{
	    		if(weightWithWhiteSpace.toString().length<9)
	    		{
	    			if(k%2==0){weightWithWhiteSpace+=" ";}
	    			if(k%2!=0){weightWithWhiteSpace=" "+weightWithWhiteSpace;}	    					
	    		}
    		}
    	
    	var amountWithSpaces=listOfItems[m].item_amount;		
    	for(k=0;k<7;k++)
    		{
	    		if(amountWithSpaces.toString().length<7)
	    		{
	    			if(k%2==0){amountWithSpaces+=" ";}
	    			if(k%2!=0){amountWithSpaces=" "+amountWithSpaces;}	    					
	    		}
    		}
    	
    	oneLiner=oneLiner.replace("$itemName0123456789",catName);
    	oneLiner=oneLiner.replace("$QTY5678901",qtyWithWhiteSpaces);
    	oneLiner=oneLiner.replace("$WT456789",weightWithWhiteSpace);
    	oneLiner=oneLiner.replace("$Amount",amountWithSpaces);
    	
    	c.printText(oneLiner, c.ALIGNMENT_LEFT, c.FONT_SIZE_NORMAL); // Payment Type
    	var size1=listOfItems[m].size==""?"":" Size : ("+listOfItems[m].size+") ";
    	c.printText(listOfItems[m].item_name+size1, c.ALIGNMENT_LEFT, c.FONT_SIZE_SMALL); 
    	
    
    	}
    
        
    c.printText("----------------------------------------------------------------", c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL);
    
    c.printText("Total Weight : "+totalWeight.toFixed(3), c.ALIGNMENT_RIGHT, c.FONT_SIZE_NORMAL); // Payment Type
    c.printText("Total Qty : "+totalQty, c.ALIGNMENT_RIGHT, c.FONT_SIZE_NORMAL); // Payment Type
	c.printText("Gross Amt : "+invoiceDetails.gross_amount, c.ALIGNMENT_RIGHT, c.FONT_SIZE_NORMAL); // Payment Type
    
    if(invoiceDetails.invoice_discount!='' && invoiceDetails.invoice_discount!='0.00')
	{
	    c.printText("----------------------------------------------------------------", c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL);
	    c.printText("Invoice Discount :  "+invoiceDetails.invoice_discount, c.ALIGNMENT_RIGHT, c.FONT_SIZE_SMALL); // Remarks
	}
    
    if(invoiceDetails.remarks!='')
	{
	    c.printText("----------------------------------------------------------------", c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL);
	    c.printText("Remarks :  "+invoiceDetails.remarks, c.ALIGNMENT_LEFT, c.FONT_SIZE_SMALL); // Remarks
	}
    
    var topay=invoiceDetails.total_amount;
    
    if(invoiceDetails.payment_type=='Partial')
    	{    	
    	
    	// need to discuss and implement
    	c.printText("----------------------------------------------------------------", c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL);
        c.printText("Total Amount :  "+Number(invoiceDetails.total_amount), c.ALIGNMENT_RIGHT, c.FONT_SIZE_MEDIUM1);         
        
    	c.printText("----------------------------------------------------------------", c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL);
        c.printText("Partially Paid Amount :  "+invoiceDetails.paid_amount, c.ALIGNMENT_RIGHT, c.FONT_SIZE_MEDIUM1); // Payment Type
        topay=Number(invoiceDetails.total_amount)-Number(invoiceDetails.paid_amount);
    	}
    
    
    c.printText("----------------------------------------------------------------", c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL);
    c.printText("Previous Due Amount :  "+pendAmount, c.ALIGNMENT_LEFT, c.FONT_SIZE_SMALL); // Payment Type
    
    
    
    
    
    
    c.printText("----------------------------------------------------------------", c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL);
    c.printText("Payable Amount :  "+topay, c.ALIGNMENT_RIGHT, c.FONT_SIZE_MEDIUM1); // Payment Type
    
  
    
    
   
	c.printText("", c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL);
	c.printText("", c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL);
	c.printText("****************************************************************", c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL);
    c.printText("*Powered By studentmanagement.in*", c.ALIGNMENT_CENTER, c.FONT_SIZE_NORMAL);
    c.printText("****************************************************************", c.ALIGNMENT_CENTER, c.FONT_SIZE_SMALL);
    c.printText("*Thank You, Visit Again*", c.ALIGNMENT_CENTER, c.FONT_SIZE_NORMAL);
	
    
    
        
    c.feed(3);
    c.execute();
    
	}
	catch(ex)
	{
		alert(ex.message);
	}
    
}


function showLedger()
{       
	window.open('?a=showCustomerLedger&txtfromdate='+todaysDateMinusOneMonth+'&txttodate='+txtinvoicedate.value+'&customerId='+hdnSelectedCustomer.value);
}
function checkforLengthAndEnableDisable()
{
		if(txtsearchcustomer.value.length>=3)
			{
				txtsearchcustomer.setAttribute("list", "customerList");
			}
		else
			{
				txtsearchcustomer.setAttribute("list", "");
			}
}

function getItemsForThisCategoryNameByAjax(categoryName)
{
	
		  const xhttp = new XMLHttpRequest();
		  xhttp.onload = function() {
		    //console.log(this.responseText);
		    var items=JSON.parse(this.responseText);
		    //console.log(items[0]);
		    //console.log(JSON.parse(items));
		    var reqString="";
		    for(m=0;m<items.length;m++)
		    	{
		    		//console.log(items[m].item_name);
		    		reqString+=`
		    			<div class="col-sm-2 col-md-4 col-lg-6" style="max-width:130px;font-size:13px" align="center">
						<img  height="50px" width="50px"  onclick="showThisItemIntoSelection(`+items[m].item_id+`)"   src="BufferedImagesFolder/dummyImage.jpg">
						<input type="hidden" id="hdn`+items[m].item_id+`" value="`+items[m].item_name+`~`+items[m].price+`~`+items[m].qty_available+`~`+items[m].sgst+`~`+items[m].cgst+`~`+items[m].category_name+`">
						
					<br>`+items[m].item_name+`				
					</div>`;
		    	}
		    //alert(reqString);
		    document.getElementById('someIdGoesHere').innerHTML=reqString; 
		  }
		  xhttp.open("GET", "?a=getItemsForThisCategoryNameByAjax&category_name="+categoryName);
		  xhttp.send();
			
	
}





// Bind button click
document.getElementById("openSearchModal").addEventListener("click", createSearchModal);
openSearchModal.disabled=false;

// Function to create a very simple modal
function createSearchModal() {
  // Remove existing modal if any
  const existing = document.getElementById("searchModal");
  if (existing) existing.remove();

  // Create modal wrapper
  const modal = document.createElement("div");
  modal.className = "modal fade";
  modal.id = "searchModal";
  modal.tabIndex = -1;
  modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Search for Invoice No</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <input type="text" id="txtinvoiceno" class="form-control" placeholder="Enter invoice number">
        </div>
        <div class="modal-footer">
          <button type="button" id="searchBtn" onclick='searchInvoice()' class="btn btn-primary">Search</button>
        </div>
      </div>
    </div>
  `;

  // Add modal to body
  document.body.appendChild(modal);

  // Init Bootstrap modal
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();

 
}

// Open modal on button click
document.getElementById("openSearchModal").addEventListener("click", createSearchModal);


function searchInvoice()
{
	
	

	var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() 
	  {
	    if (xhttp.readyState == 4 && xhttp.status == 200) 
	    { 		      
	    	if(xhttp.responseText=="No Invoice Found")
	    		{
	    			alert(xhttp.responseText);
	    		}
	    	else
	    		{
	    			window.location="?a=showGenerateInvoice&oldInvoiceFormat=true&editInvoice=Y&invoice_id="+xhttp.responseText;
	    		}
	      
		  
		}
	  };
	  xhttp.open("GET","?a=getInvoiceIdByInvoiceNo&invoiceNo="+txtinvoiceno.value, true);    
	  xhttp.send();
	
	
	
}