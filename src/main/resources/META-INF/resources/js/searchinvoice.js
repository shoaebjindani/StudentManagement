
setTimeout(
	function() {
		document.getElementById("txtsearchinvoiceno").focus();
	}, 3000);function searchInvoice()
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
			window.location="?a=showGenerateInvoice&editInvoice=Y&invoice_id="+xhttp.responseText;
		}
  
  
}
};
xhttp.open("GET","?a=getInvoiceIdByInvoiceNo&invoiceNo="+txtsearchinvoiceno.value, true);    
xhttp.send();



}



document.getElementById("divTitle").onclick = function(){


document.getElementById("closebutton").style.display='none';
document.getElementById("loader").style.display='block';
$("#myModal").modal();

var searchElements=`<form onsubmit="searchInvoice(); return false;">
<div class="input-group">

<input type="number" class="form-control form-control-lg" placeholder="Search For Invoice" autofocus id="txtsearchinvoiceno">
<div class="input-group-append">
<button type="submit" class="btn btn-lg btn-default" >
	<i class="fa fa-search"></i>
</button>
</div>
</div>
</form>`;

  document.getElementById("responseText").innerHTML=searchElements;
  document.getElementById("closebutton").style.display='none';
  document.getElementById("loader").style.display='none';
  
  $("#myModal").modal();

  setTimeout(
	function() {
		document.getElementById("txtsearchinvoiceno").focus();
	}, 500);

  
 
  
  

};


$('#myModal').on('shown.bs.modal', function() {
$(this).find('input:first').focus();
});
