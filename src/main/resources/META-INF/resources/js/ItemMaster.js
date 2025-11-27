// Delete Item function
function deleteItem(itemId) {    
    if(!window.confirm("Are you sure you want to delete?")) return;

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState === 4 && xhttp.status === 200) {
            toastr["success"](xhttp.responseText);
            toastr.options = {
                "closeButton": false,
                "debug": false,
                "newestOnTop": false,
                "progressBar": false,
                "positionClass": "toast-top-right",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "1000",
                "hideDuration": "500",
                "timeOut": "500",
                "extendedTimeOut": "500",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            };
            window.location.reload();
        }
    };
    xhttp.open("GET","?a=deleteItem&itemId="+itemId, true);    
    xhttp.send();
}

// Show elements by name
function showElementsByName(name) {
    Array.from(document.getElementsByName(name)).forEach(el => el.style = 'display:');
}

// Execute after DOM loaded
document.addEventListener("DOMContentLoaded", () => {

    // Show relevant columns based on app type
    //alert(apptype);    

      if(apptype === "SnacksProduction") {
        ['lblcategoryname','lblitemname','lblrawmaterialname','lblpackagingtype','lblbtnedit','lblbtndelete'].forEach(showElementsByName);
    }

    if(apptype === "RetailMobile") {
        [ 'lblcategoryname','lblitemname','lblbtnedit','lblbtndelete'].forEach(showElementsByName);
    }

    if(apptype === "RetailChhaswala") {
        [ 'lblcategoryname','lblproductcode','lblitemname','lblbtnedit','lblbtndelete'].forEach(showElementsByName);
    }

    if(apptype === "Retail") {
        ['lblcategoryname','lblitemname','lblproductcode','lblsellingprice','lblavailableqty','lblorderno','lblprice','lblbtnedit','lblbtndelete'].forEach(showElementsByName);
    }

    if(apptype === "Jwellery") {
        ['lblcategoryname','lblitemname','lblproductcode','lblsellingprice','lblorderno','lblprice','lblbtnedit','lblbtndelete'].forEach(showElementsByName);
    }

    if(apptype === "PetrolPump") {
        ['lblcategoryname','lblitemname','lblproductcode','lblsellingprice','lblorderno','lblprice','lblbtnedit','lblbtndelete'].forEach(showElementsByName);
    }

    if(apptype === "Rental") {
        ['lblcategoryname','lblitemname','lblproductcode','lblsellingprice','lblorderno','lblprice','lblbtnedit','lblbtndelete'].forEach(showElementsByName);
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


  

    document.getElementById("divTitle").innerHTML="Item Master";
    document.title += " Item Master";

    // Search functions
    window.actualSearch = function() {
        window.location="?a=showItemMaster&searchInput="+txtsearch.value+"&categoryId="+drpcategoryId.value;  
    }

    window.searchprod = function(evnt) {
        if(evnt.which === 13) actualSearch();
    }

    window.showThisCategory = function() {
        window.location="?a=showItemMaster&searchInput="+txtsearch.value+"&categoryId="+drpcategoryId.value;
    }

    drpcategoryId.value='${param.categoryId}';

    // F2 shortcut to add new item
    window.addEventListener('keydown', function(event) {
        if(event.which === 113) window.location='?a=showAddItem';
    });

    $('[data-widget="pushmenu"]').PushMenu("collapse");
});
