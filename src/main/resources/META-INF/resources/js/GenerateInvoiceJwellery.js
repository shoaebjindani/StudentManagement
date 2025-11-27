let cart = [];


function fetchCategories() {
    fetch('?a=getCategoriesByAppId')
        .then(response => response.text()) // read as text
        .then(text => {
            let data;
            try {
				
                data = JSON.parse(text); // parse string to JSON
            } catch (err) {
                console.error("Error parsing JSON:", err, text);
                return;
            }
            renderCategories(data);
        })
        .catch(err => {
            console.error("Error fetching categories:", err);
        });
}

function renderCategories(categories) {
    // 1. Get the currently selected dropdown value (before clearing)
    let selectedValue = "Gold"; // default
    const existingDropdown = document.getElementById("drpmaterialselection");
    if (existingDropdown) {
        selectedValue = existingDropdown.value;
    }

    // 2. Clear the categories div
    categoriesDiv.innerHTML = "";

    // 3. Recreate the dropdown
    const dropdownDiv = document.createElement("div");
    dropdownDiv.className = "category";

    const dropdown = document.createElement("select");
    dropdown.id = "drpmaterialselection";
    dropdown.className = "form-control";
    dropdown.onchange = function () {
        renderCategories(categories); // Re-render on selection change
    };

    ["Gold", "Silver", "Metal"].forEach(val => {
        const option = document.createElement("option");
        option.value = val;
        option.text = val;
        if (val === selectedValue) {
            option.selected = true;
        }
        dropdown.appendChild(option);
    });

    dropdownDiv.appendChild(dropdown);
    categoriesDiv.appendChild(dropdownDiv);

    // 4. Sort categories by order_no
    categories.sort((a, b) => {
        return (a.order_no || 0) - (b.order_no || 0);
    });

    // 5. Filter and render categories as buttons
    let firstRendered = false;
    categories.forEach(cat => {
        const name = cat.category_name.toString();
        const nameToDisplay = cat.order_no + ". " + name;

        if (
            (selectedValue === "Gold" && name.startsWith("G")) ||
            (selectedValue === "Silver" && name.startsWith("S")) ||
            (selectedValue === "Metal" && name.startsWith("M"))
        ) {
            const button = document.createElement("button");
            button.className = "category-btn";
            button.innerText = nameToDisplay;
            button.dataset.id = cat.id;

            button.onclick = function () {
                document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
                button.classList.add("active");
                fetchItems(cat.category_name);
            };

            categoriesDiv.appendChild(button);

            // Auto-select first matching category
            if (!firstRendered) {
                button.classList.add("active");
                fetchItems(cat.category_name);
                firstRendered = true;
            }
        }
    });
}



function fetchItems(category_name) {    
    fetch('?a=getItemsForThisCategoryNameByAjax&category_name=' + encodeURIComponent(category_name))
        .then(response => response.text()) // Read as plain text
        .then(text => {
            let data;
            try {
                data = JSON.parse(text); // Parse string into JSON
				
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

// Initial load
fetchCategories();


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
			<td><button type="button" onclick="removeFromCart(this)">❌</button></td>

        `;
        cartItemsTbody.appendChild(row);
    });

    

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
			//searchForCustomer(searchString);
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

function copyThisToNewCustomer()
{
		mobileNumber.value=txtsearchcustomer.value;
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
		    
		    var items=JSON.parse(this.responseText);
		    
		    var reqString="";
		    for(m=0;m<items.length;m++)
		    	{
		    		
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

 function selectCustomer() {
        const customerName = document.getElementById("customer-name").value.trim();
        if(customerName) {
            alert("Customer selected: " + customerName);
            // TODO: populate cart or perform actions based on selected customer
        } else {
            alert("Please enter a customer name.");
        }
    }


	
	function removeFromCart(button) {
    // Get the row to remove
    const row = button.closest("tr");
    if (!row) return;

    // Get all rows in tbody
    const tbody = row.parentNode;
    const rows = Array.from(tbody.children);

    // Find the index of the clicked row
    const rowIndex = rows.indexOf(row);

    if (rowIndex >= 0 && rowIndex < cart.length) {
        // Remove the item from the cart array
        cart.splice(rowIndex, 1);
    }

    // Remove the row from the table
    row.remove();

    // Re-render the cart to update totals and focus
    renderCart();
}


function showPreviewModal() {
    let customerName = document.getElementById("txtsearchcustomer")?.value || "Walk-in Customer";
    let invoiceDate = new Date().toLocaleString();

    let items = [];
    let rows = document.getElementById("tblitems")?.rows || [];

    for (let x = 1; x < rows.length; x++) {
        let row = rows[x];
        if (!row) continue;

        try {
            let qty = Number(row.cells[1]?.querySelector('input')?.value || 0);
            let rate = Number(row.cells[2]?.querySelector('input')?.value || 0);
            let itemName = row.cells[0]?.querySelector('.item-name')?.innerText || "Item";

            items.push({
                name: itemName,
                qty: qty,
                rate: rate,
                amount: (qty * rate).toFixed(2)
            });
        } catch (err) {
            console.error("Error parsing row " + x, err);
        }
    }

    let totalAmount = document.getElementById("totalAmount")?.innerText || "0";
    let totalQty = document.getElementById("totalQty")?.innerText || "0";

    let html = `
      <p><strong>Customer:</strong> ${customerName}</p>
      <p><strong>Date:</strong> ${invoiceDate}</p>
      <table class="table table-bordered table-sm">
        <thead class="table-light">
          <tr>
            <th>Name</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(i => `
            <tr>
              <td>${i.name}</td>
              <td>${i.qty}</td>
              <td>${i.rate}</td>
              <td>${i.amount}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <div class="text-end fw-bold">
        <p>Total Qty: ${totalQty}</p>
        <p>Total Amount: ${totalAmount}</p>        
      </div>
    `;

    document.getElementById("invoicePreviewContent").innerHTML = html;
    var previewModal = new bootstrap.Modal(document.getElementById("invoicePreviewModal"));
    previewModal.show();
}

// Optional print function
function printPreview() {
    let content = document.getElementById("invoicePreviewContent").innerHTML;
    let w = window.open('', '', 'width=800,height=600');
    w.document.write('<html><head><title>Invoice Preview</title></head><body>');
    w.document.write(content);
    w.document.write('</body></html>');
    w.document.close();
    w.print();
}


function showPreviewModal() {
    // Customer Info
    document.getElementById("previewCustomerName").innerText = document.getElementById("txtsearchcustomer").value || "N/A";
    document.getElementById("previewDueAmount").innerText = document.getElementById("txtcustomerpendingamount").value || "0";
    document.getElementById("previewLastMonthSale").innerText = document.getElementById("txtcustomerlastmonthsale").value || "0";

    // Cart Items
    const cartItems = document.querySelectorAll("#cart-items tr");
    const previewTbody = document.querySelector("#previewItemsTable tbody");
    previewTbody.innerHTML = ""; // clear old rows

    let totalAmount = 0;
    cartItems.forEach(row => {
        const cells = row.querySelectorAll("td");
        if(cells.length < 5) return;
        const itemName = cells[0].innerText;
        const qty = cells[1].querySelector("input") ? cells[1].querySelector("input").value : cells[1].innerText;
        const wt = cells[2].querySelector("input") ? cells[2].querySelector("input").value : cells[2].innerText;
        const sz = cells[3].querySelector("input") ? cells[3].querySelector("input").value : cells[3].innerText;
        const amount = cells[4].querySelector("input") ? parseFloat(cells[4].querySelector("input").value) : parseFloat(cells[4].innerText);

        totalAmount += amount;

        const tr = document.createElement("tr");
        tr.innerHTML = `<td style="border:1px solid #ccc; padding:5px;">${itemName}</td>
                        <td style="border:1px solid #ccc; padding:5px;">${qty}</td>
                        <td style="border:1px solid #ccc; padding:5px;">${wt}</td>
                        <td style="border:1px solid #ccc; padding:5px;">${sz}</td>
                        <td style="border:1px solid #ccc; padding:5px;">${amount.toFixed(2)}</td>`;
        previewTbody.appendChild(tr);
    });

    document.getElementById("previewTotalAmount").innerText = totalAmount.toFixed(2);

    // Show modal
    document.getElementById("previewModal").style.display = "block";
}

function closePreviewModal() {
    document.getElementById("previewModal").style.display = "none";
}

// Example Save & Print function
function saveAndPrint() {
    alert("Save & Print logic goes here!");
    closePreviewModal();
}



  document.addEventListener("DOMContentLoaded", function () {
    // select all text & tel inputs inside modal and main form
    document.querySelectorAll("input[type='text'], input[type='tel'], input[type='number']").forEach(function (input) {
      input.addEventListener("focus", function () {
        this.select();
      });
    });
  });
