




<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${projectName}</title>
  <link rel="icon" href="https://img.icons8.com/emoji/48/000000/cloud-emoji.png" type="image/png" sizes="16x16">
  
  <!-- Tell the browser to be responsive to screen width -->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  
   <link rel="stylesheet" href="css/jquery-ui.css">
  <!-- Font Awesome -->
  
  

  <link rel="stylesheet" href="plugins/datatables-bs4/css/dataTables.bootstrap4.min.css">
  <link rel="stylesheet" href="plugins/datatables-responsive/css/responsive.bootstrap4.min.css">
  
  <link rel="stylesheet" href="plugins/fontawesome-free/css/all.min.css">
  <link rel="stylesheet" href="css/font-awesome.min.css">
  <!-- Ionicons -->
  <!-- <link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css"> -->
  <!-- overlayScrollbars -->
  <link rel="stylesheet" href="plugins/overlayScrollbars/css/OverlayScrollbars.min.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="dist/css/adminlte.min.css">
  
  <link rel="stylesheet" href="css/site.css">
  <link rel="stylesheet" href="css/richtext.min.css">
  
  
  <link rel="stylesheet" href="plugins/toastr/toastr.min.css">
  
  
  
  <!-- Google Font: Source Sans Pro -->
  <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700" rel="stylesheet">
  
  
  <!-- jQuery -->
  
  <script src="js/common.js"></script>
<script src="plugins/jquery/jquery.min.js"></script>
<!-- Bootstrap 4 -->
<script src="plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
<!-- overlayScrollbars -->
<script src="plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script>
<!-- AdminLTE App -->
<script src="dist/js/adminlte.min.js"></script>
<!-- AdminLTE for demo purposes -->
<script src="dist/js/demo.js"></script>

<script src="js/jquery-ui.js"></script>
<script src="plugins/toastr/toastr.min.js"></script>



<script src="plugins/datatables/jquery.dataTables.min.js"></script>
<script src="plugins/datatables-bs4/js/dataTables.bootstrap4.min.js"></script>
<script src="plugins/datatables-responsive/js/dataTables.responsive.min.js"></script>
<script src="plugins/datatables-responsive/js/responsive.bootstrap4.min.js"></script>


</head>  


<style>
	.date_field {position: relative; z-index:1000;}
	.ui-datepicker{position: relative; z-index:1000!important;}

	
<style>

.table-responsive {
  overflow-x: auto;
}

body, html {
  height: 100%;
  margin: 0;
}

.bg {
  /* The image used */
  

  /* Full height */
  height: 100%; 

  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  
}
</style>
</style>


<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>  

<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

           

<c:set var="reportDetails" value='${requestScope["outputObject"].get("reportDetails")}' />
<c:set var="message" value='${requestScope["outputObject"].get("reportData")}' />
<c:set var="defaultParameterValues" value='${requestScope["outputObject"].get("defaultParameterValues")}' />





<script>

 $(function () {
    
    $('#example1').DataTable({
      "paging": true,      
      "lengthChange": false,
      "searching": false,
      "ordering": true,
      "info": true,
      "autoWidth": false,
      "responsive": true,
      "pageLength": 200,
	  "order": [[0, 'asc']]
    });
  });
	
	
	

 function ReloadFilters()
 {	  
	var reqString="";
	<c:forEach var="parametersq1" items="${reportDetails.get('paramtersWithOptions')}">
		var m="${parametersq1.get('parameter_form_id')}";				
		document.getElementById(m).value;	
		reqString+="&"+m+"="+document.getElementById(m).value;
	</c:forEach>

 	window.location="?a=showReport&report_id=${reportDetails.report_id}"+reqString;
 }

 
 function checkforvalidfromtodate()
 {        	
 	var fromDate=document.getElementById("txtfromdate").value;
 	var toDate=document.getElementById("txttodate").value;
 	
 	var fromDateArr=fromDate.split("/");
 	var toDateArr=toDate.split("/");
 	
 	
 	var fromDateArrDDMMYYYY=fromDate.split("/");
 	var toDateArrDDMMYYYY=toDate.split("/");
 	
 	var fromDateAsDate=new Date(fromDateArrDDMMYYYY[2],fromDateArrDDMMYYYY[1]-1,fromDateArrDDMMYYYY[0]);
 	var toDateAsDate=new Date(toDateArrDDMMYYYY[2],toDateArrDDMMYYYY[1]-1,toDateArrDDMMYYYY[0]);
 	
 	if(fromDateAsDate>toDateAsDate)
 		{
 			alert("From Date should be less than or equal to To Date");
 			window.location.reload();        			
 		}
 }
</script>




<div class="card">

<br>



		

	<div class="row">


		<div class="row" style="width:-webkit-fill-available" align="center">
				<div class="col-12"><div style="font-weight:800"id="divTitle"></div></div>
			</div>

		<c:forEach var="parametersq1" items="${reportDetails.get('paramtersWithOptions')}">
			<div class="col-sm-1" align="center">
				<label for="${parametersq1.get('parameter_form_id')}">${parametersq1.get('parameter_label')}</label>			
			</div>
			
			
			<div class="col-sm-2" align="center">
				<div class="input-group input-group-sm" style="width: 200px;">

				<c:if test="${parametersq1.get('parameter_type') eq 'date'}">	        
			        <input type="text" id="${parametersq1.get('parameter_form_id')}" onchange="ReloadFilters();"  name="${parametersq1.get('parameter_form_id')}" readonly class="form-control date_field" placeholder="${parametersq1.get('parameter_label')}"/>
	  			</c:if>

				<c:if test="${parametersq1.get('parameter_type') eq 'select'}">	        
					<select id="${parametersq1.get('parameter_form_id')}" class="form-control" onchange="ReloadFilters();">
						<c:forEach var="paramOption" items="${parametersq1.get('parameterOptions')}">
							<option value="${paramOption.option_value}">${paramOption.option_display_name}</option>
						</c:forEach>
						
					</select>
			        
	  			</c:if>
					
				</div>
			</div>
		</c:forEach>


		
	
	
		


		<div class="col-sm-2" align="center">
			<div class="card-tools">
				<div class="input-group input-group-sm" align="center" style="width: 200px;display:inherit">
					<div class="icon-bar" style="font-size:22px;color:firebrick">
						<a title="Download Excel" onclick="downloadExcel()"><i class="fa fa-file-excel-o" aria-hidden="true"></i></a> 
						<a title="Download PDF" onclick="downloadPDF()"><i class="fa fa-file-pdf-o"></i></a>
						<a title="Download Text"  onclick="downloadText()"><i class="fa fa-file-text-o"></i></a>  
					</div>           
				</div>
			</div>
		</div>
	


	</div>
	<br>
	
	
	<!-- /.card-header -->
	
	<div class="card-body table-responsive p-0" style="height: 800px;">                
		<table id="example1"class="table" role="grid" aria-describedby="example1_info">             
			
			<thead>
				<tr>	
					

					<c:forEach var="columnsq1" items="${reportDetails.get('columns')}">

					
					

						<th><b>${(columnsq1.get('column_name'))}</b></th>


					</c:forEach>
				


					
					
				</tr>
			</thead>
			<tbody>
			

			
			<c:forEach var="reportData" items="${reportDetails.get('reportData')}">

						<tr>
							<c:forEach var="columnobj" items="${reportDetails.get('columns')}">
								

								
								<c:choose>

									<c:when test="${fn:contains(columnobj.get('column_value'), '~edit')}">
										<c:set var="editValue" value="${fn:split(columnobj.get('column_value'), '~')}" />
										<td><a href="?a=${editValue[1]}&${editValue[2]}=${reportData.get(editValue[2])}">Edit</a></td>
									</c:when>


									<c:when test="${fn:contains(columnobj.get('column_value'), '~delete')}">
										<c:set var="deleteValue" value="${fn:split(columnobj.get('column_value'), '~')}" />
									<td><input type="button" class="btn btn-danger" value="Delete" onclick="DeleteThis('${deleteValue[1]}','${deleteValue[2]}','${reportData.get(deleteValue[2])}')"></td>

									</c:when>

									<c:otherwise>
										<td>${reportData.get(columnobj.get('column_value'))} </td>
									</c:otherwise>

								</c:choose>

								

								

								


							</c:forEach>
						</tr>

			</c:forEach>

			</tbody>
		</table>
	</div>
</div>


<script>


function DeleteThis(action,key,value)
		{

		
		
			var answer = window.confirm("Are you sure you want to delete ?");
			if (!answer) 
			{
				return;    
			}
			
			
			var xhttp = new XMLHttpRequest();
			  xhttp.onreadystatechange = function() 
			  {
			    if (xhttp.readyState == 4 && xhttp.status == 200) 
			    { 		      
			    	toastr["success"](xhttp.responseText);
			    	toastr.options = {"closeButton": false,"debug": false,"newestOnTop": false,"progressBar": false,
			    	  "positionClass": "toast-top-right","preventDuplicates": false,"onclick": null,"showDuration": "1000",
			    	  "hideDuration": "500","timeOut": "500","extendedTimeOut": "500","showEasing": "swing","hideEasing": "linear",
			    	  "showMethod": "fadeIn","hideMethod": "fadeOut"}
			    	
			    	window.location.reload();
		      
			      
				  
				}
			  };
			  xhttp.open("GET","?a="+action+"&"+key+"="+value, true);    
			  xhttp.send();
		}

	
	
	//$( "#txtfromdate" ).datepicker({ dateFormat: 'dd/mm/yy' });
	//$( "#txttodate" ).datepicker({ dateFormat: 'dd/mm/yy' });


	<c:forEach var="entry" items="${defaultParameterValues}">	
		document.getElementById('${entry.key}').value='${entry.value}';
		
	</c:forEach>



	const urlParams = new URLSearchParams(window.location.search);
	<c:forEach var="parametersq1" items="${reportDetails.get('paramtersWithOptions')}">
		var m="${parametersq1.get('parameter_form_id')}";
		//alert(m);
		
		

		// Get the value based on the key
		keyValue = urlParams.get(m);

		// Log the value to the console
		//console.log(keyValue);
		if(keyValue!=null)
		{
			document.getElementById(m).value=keyValue;
		}

		
	</c:forEach>

document.getElementById("divTitle").innerHTML="${reportDetails.report_name}";
</script>