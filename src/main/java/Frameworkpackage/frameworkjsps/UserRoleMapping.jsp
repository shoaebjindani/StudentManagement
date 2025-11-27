

<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>



  <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
           
<style>


/* Change the background and text color of selected items */
.select2-selection__choice {
    background-color: blue!important; /* Green background */
    color: white!important; /* White text */
    border-radius: 5px;
    padding: 5px 10px;
}



/* Change the appearance of the entire selection box */
.select2-selection {
    background-color: #f0f0f0; /* Light gray background */
    border: 2px solid #4CAF50; /* Green border */
    border-radius: 5px;
    padding: 8px;
}


/* Change placeholder text appearance */
.select2-selection__placeholder {
    color: #888; /* Gray placeholder text */
    font-style: italic;
}

/* Style the selected items in a multi-select */
.select2-selection__choice {
    background-color: #2196F3; /* Blue background for selected items */
    color: white; /* White text */
    margin-right: 5px;
    border-radius: 10px;
    font-size: 14px;
}

/* Highlight selected item in dropdown */
.select2-results__option[aria-selected="true"] {
    background-color: #4CAF50; /* Green background for selected option in dropdown */
    color: white; /* White text */
}



</style>
           


<c:set var="userList" value='${requestScope["outputObject"].get("userList")}' />
<c:set var="roleList" value='${requestScope["outputObject"].get("roleList")}' />

  
</head>
<br>

<div class="container" style="padding:20px;background-color:white;width: 100%;max-width: 100%;">

<form id="frm" method="post" enctype="multipart/form-data" accept-charset="UTF-8">
<div class="row">

<div class="col-sm-12">
  	<div class="form-group">
  	<label for="EmployeeName">Search Username</label> 	
  	<div class="input-group input-group-md">
                  <input type="text" class="form-control" id="txtsearchuser"   placeholder="Search For Username" name="txtsearchusername"  list='userList' oninput="checkforMatchUser()">
                  <span class="input-group-append">
                    <button type="button" class="btn btn-danger btn-flat" onclick="resetUser()">Reset</button>
                  </span>
    </div>                 
      <input  type="hidden" name="hdnSelectedUser" id="hdnSelectedUser" value="">
   			      
    </div>
  </div>



  
  
  <div class="col-sm-4">
                      <!-- Select multiple-->
                      <div class="form-group">
                        <label>Current Tagged Roles</label>


					  <select class="js-example-basic-multiple" name="states[]" multiple="multiple">
  							<c:forEach var="entry" items="${roleList}">
	   							<option id="${entry.key}">${entry.value.roleName}</option>	
	   						</c:forEach>    					  </select>
                        
                      </div>
                    </div>
                    
                    
                   
                    
                    
                    <div class="col-sm-8">
                      <!-- Select multiple-->
                      <div class="form-group">
                        <label>Current Tagged Elements</label>
                        <select style="height:550px" multiple="" class="custom-select" id="drpcurrentelements">                          
                        </select>
                      </div>
                    </div>
  
  
  
  
  
  <div class="col-sm-12" align="center">
  	<div class="form-group">
      <button class="btn btn-success" type="button" onclick='saveRole()'>Save</button>	  
	  <button class="btn btn-danger" type="button" onclick='window.location="?a=showHomePage"'>Cancel</button>	  
	</div>
  </div>
  
  
   
</div>


<datalist id="userList">
<c:forEach items="${userList}" var="user">
			    <option id="${user.user_id}">${user.username}~${user.name}</option>			    
	   </c:forEach></select>	   	   	
</datalist>
</form>

<script>
	document.getElementById("divTitle").innerHTML="User Role Mapping";
	
	
	function checkforMatchUser()
	{
		var searchString= document.getElementById("txtsearchuser").value;	
		var options1=document.getElementById("userList").options;	
		var userId=0;
		for(var x=0;x<options1.length;x++)
			{
				if(searchString==options1[x].value)
					{
					userId=options1[x].id;
						break;
					}
			}
		if(userId!=0)
			{				
				document.getElementById("txtsearchuser").disabled=true;
				hdnSelectedUser.value=userId;
				getRoleDetailsForthisUser(userId);
			}		
	}
	
	
	function getRoleDetailsForthisUser(userId)
	{
		document.getElementById("closebutton").style.display='none';
		
		var xhttp = new XMLHttpRequest();
		  xhttp.onreadystatechange = function() 
		  {
		    if (xhttp.readyState == 4 && xhttp.status == 200) 
		    { 		      
		      
		      var returnData=JSON.parse(xhttp.responseText);
		      var listOfRoleDetails=returnData.lstUserRoleDetails;
		      var listOfElements=returnData.lstElements;
		      
		      var reqString="";		      
		      for (const element of listOfElements) { // You can use `let` instead of `const` if you like
		    	    //console.log(element.elementName);
		      		for(const childElement of element.childElements)
		      			{
		      				console.log(element.elementName+" --> "+childElement.elementName);
		      				reqString+="<option id=''>"+element.elementName+" --> "+childElement.elementName+"</option>";
		      			}
		    	}
		      
		      drpcurrentelements.innerHTML=reqString;
		      
		      reqString="";
			  let selectedRoles = []; // Array to hold the roles


		      for(var x=0;x<listOfRoleDetails.length;x++)
		      {
		    	  reqString+="<option id='"+listOfRoleDetails[x].role_id+"'>"+listOfRoleDetails[x].role_name+"</option>";
				  console.log("Setting value:", listOfRoleDetails[x].role_name); // Debug				  
				  selectedRoles.push(listOfRoleDetails[x].role_name);
		      }

			  $('.js-example-basic-multiple').val(selectedRoles).trigger('change');
		      

			  
			  
		      
			}
		  };
		  xhttp.open("GET","?a=getRoleDetailsForthisUser&userId="+userId, true);    
		  xhttp.send();
	}

	function saveRole()
	{



		let selectedIds = [];
		$('.js-example-basic-multiple option:selected').each(function() {
			let optionId = $(this).attr('id'); // Get the `id` attribute of each selected option
			if (optionId) {
				selectedIds.push(optionId); // Add it to the array
			}
		});

		// Log the array of selected IDs
		console.log("Selected IDs:", selectedIds);

		
		
		document.getElementById("closebutton").style.display='none';		
		var xhttp = new XMLHttpRequest();
		  xhttp.onreadystatechange = function() 
		  {
		    if (xhttp.readyState == 4 && xhttp.status == 200) 
		    { 
		    	
		    	toastr["success"](xhttp.responseText);
		    	toastr.options = {"closeButton": false,"debug": false,"newestOnTop": false,"progressBar": false,
		    	  "positionClass": "toast-top-center","preventDuplicates": false,"onclick": null,"showDuration": "1000",
		    	  "hideDuration": "500","timeOut": "500","extendedTimeOut": "500","showEasing": "swing","hideEasing": "linear",
		    	  "showMethod": "fadeIn","hideMethod": "fadeOut"}
		    	
		    	getRoleDetailsForthisUser(hdnSelectedUser.value);
			}
		  };
		  xhttp.open("GET","?a=addRemoveRole&userId="+hdnSelectedUser.value+"&listOFRoles="+selectedIds, true);    
		  xhttp.send();		
	}
	
	
	function addRemoveRole(addRemoveFlag)
	{
		
		var drpName="";
		if(addRemoveFlag==1)
			{
				//getListOfRolesToRemove
				drpName="drpavailableroles";		
			}
		else
			{
				//getListofRolesToAdd
			drpName="drpcurrentroles";
			}
		var options1=document.getElementById(drpName).options;
		var listOfOptions="";
		for(var x=0;x<options1.length;x++)
			{
				if(options1[x].selected)
					{
						listOfOptions+=options1[x].id+"~";
					}
			}	
		document.getElementById("closebutton").style.display='none';		
		var xhttp = new XMLHttpRequest();
		  xhttp.onreadystatechange = function() 
		  {
		    if (xhttp.readyState == 4 && xhttp.status == 200) 
		    { 
		    	
		    	toastr["success"](xhttp.responseText);
		    	toastr.options = {"closeButton": false,"debug": false,"newestOnTop": false,"progressBar": false,
		    	  "positionClass": "toast-top-center","preventDuplicates": false,"onclick": null,"showDuration": "1000",
		    	  "hideDuration": "500","timeOut": "500","extendedTimeOut": "500","showEasing": "swing","hideEasing": "linear",
		    	  "showMethod": "fadeIn","hideMethod": "fadeOut"}
		    	
		    	getRoleDetailsForthisUser(hdnSelectedUser.value);
			}
		  };
		  xhttp.open("GET","?a=addRemoveRole&userId="+hdnSelectedUser.value+"&listOFRoles="+listOfOptions+"&action="+addRemoveFlag, true);    
		  xhttp.send();		
	}
	
	function resetUser()
	{
		window.location.reload();
	}


	$(document).ready(function() {
    
	

	$('.js-example-basic-multiple').select2({
        width: '100%' // Ensures the dropdown is responsive
    });
	
});
</script>



