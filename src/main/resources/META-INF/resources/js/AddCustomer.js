

function addCustomer()
{	
	
	btnsave.disabled=true;
	if(document.getElementById("customername").value=="")
	{
		alert('Please enter Customer Name');
		mobileNumber.focus();
		btnsave.disabled=true;
		return; 
	}
	
	
	if(document.getElementById("mobileNumber").value=="" || document.getElementById("mobileNumber").value.length!=10)
		{
			alert('Please enter Valid Mobile number');
			mobileNumber.focus();
			btnsave.disabled=false;
			return; 
		}
	
	if(document.getElementById("alternate_mobile_no").value!="" && document.getElementById("alternate_mobile_no").value.length!=10)
	{
		alert('Please enter Valid Alternate Mobile number');
		alternate_mobile_no.focus();
		btnsave.disabled=false;
		return; 
	}
	
	document.getElementById("frm").submit(); 
}





// Show elements by name
function showElementsByName(name) {
    Array.from(document.getElementsByName(name)).forEach(el => el.style = 'display:');
}

// Execute after DOM loaded
document.addEventListener("DOMContentLoaded", () => {

    // Show relevant columns based on app type
    //alert(apptype);    

      

    if(apptype === "RetailMobile") {
        placeholderforcustomerreference.style="display:none";
        placeholderforalternatemobile.style="display:none";
        placeholderforcustomertype.style="display:none";
        placeholderforcustomergroup.style="display:none";
        placeholderforGSTNo.style="display:none"; 
        placeholderforpublicledger.style="display:none";        
    }

    

   


    // // Initialize DataTable
    // $('#example1').DataTable({
    //     "paging": true,      
    //     "lengthChange": false,
    //     "searching": false,
    //     "ordering": true,
    //     "info": true,
    //     "autoWidth": false,
    //     "responsive": true,
    //     "pageLength": 100,
    //     "order": [[1, "asc"]]
    // });


  

    document.getElementById("divTitle").innerHTML="Add Customer";
    document.title += " Add New Customer";

    

    
    
    // F2 shortcut to add new item
    window.addEventListener('keydown', function(event) {
        if(event.which === 113) window.location='?a=showAddItem';
    });

    $('[data-widget="pushmenu"]').PushMenu("collapse");
});
