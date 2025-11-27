<style>
	.date_field {position: relative; z-index:1000;}
	.ui-datepicker{position: relative; z-index:1000!important;}
</style>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:set var="jspName" value='${requestScope["outputObject"].get("contentJspName")}' />
<c:set var="userName" value='${requestScope["outputObject"].get("userName")}' />
<c:set var="elementsDB" value='${requestScope["outputObject"].get("elementsDB")}' />

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${projectName}</title>
  <link rel="icon" href="https://img.icons8.com/emoji/48/000000/cloud-emoji.png" type="image/png" sizes="16x16">

  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- CSS & LIBRARIES -->
  <link rel="stylesheet" href="css/jquery-ui.css">
  <link rel="stylesheet" href="plugins/datatables-bs4/css/dataTables.bootstrap4.min.css">
  <link rel="stylesheet" href="plugins/datatables-responsive/css/responsive.bootstrap4.min.css">
  <link rel="stylesheet" href="plugins/fontawesome-free/css/all.min.css">
  <link rel="stylesheet" href="css/font-awesome.min.css">
  <link rel="stylesheet" href="plugins/overlayScrollbars/css/OverlayScrollbars.min.css">
  <link rel="stylesheet" href="dist/css/adminlte.min.css">
  <link rel="stylesheet" href="css/site.css">
  <link rel="stylesheet" href="css/richtext.min.css">
  <link rel="stylesheet" href="plugins/toastr/toastr.min.css">

  <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700" rel="stylesheet">

  <!-- SCRIPTS -->
  <script src="js/common.js"></script>
  <script src="plugins/jquery/jquery.min.js"></script>
  <script src="plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script>
  <script src="dist/js/adminlte.min.js"></script>
  <script src="dist/js/demo.js"></script>
  <script src="js/jquery-ui.js"></script>
  <script src="plugins/toastr/toastr.min.js"></script>
  <script src="plugins/datatables/jquery.dataTables.min.js"></script>
  <script src="plugins/datatables-bs4/js/dataTables.bootstrap4.min.js"></script>
  <script src="plugins/datatables-responsive/js/dataTables.responsive.min.js"></script>
  <script src="plugins/datatables-responsive/js/responsive.bootstrap4.min.js"></script>

<!-- ========================================================= -->
<!--             FINAL FIX — TABLE HEADER COLOR                -->
<!-- ========================================================= -->

<style>
    :root {
      --primary-color: #d4af37; /* original gold */
      --primary-soft: #e8c86e;  /* **softer gold you selected** */
      --primary-dark: #b89122;
      --secondary-color: #6c757d;
      --background-color: #f7f7f7;
      --text-color: #212529;
      --navbar-bg: #ffffff;
      --sidebar-bg: #2f2f2f;
      --sidebar-text: #f1f1f1;
      --sidebar-hover: #d4af37;
    }

    body {
      background-color: var(--background-color);
      color: var(--text-color);
      font-family: "Segoe UI", sans-serif;
    }

    /* ============================
       NAVBAR
    ============================ */
    .main-header.navbar {
      background-color: var(--navbar-bg) !important;
      border-bottom: 2px solid var(--primary-color);
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }

    .main-header .nav-link {
      color: var(--text-color) !important;
      font-weight: 600;
    }
    .main-header .nav-link:hover {
      color: var(--primary-dark) !important;
    }

    /* ============================
       SIDEBAR
    ============================ */
    .main-sidebar {
      background-color: var(--sidebar-bg) !important;
    }

    .sidebar .nav-link {
      color: var(--sidebar-text) !important;
    }

    .sidebar .nav-link.active,
    .sidebar .nav-link:hover {
      background-color: rgba(212,175,55,0.15);
      border-left: 3px solid var(--sidebar-hover);
      color: var(--sidebar-hover) !important;
    }

    /* ============================
       TABLE HEADER FIX (IMPORTANT)
    ============================ */
    table thead th,
    table th {
        background-color: var(--primary-soft) !important; /* softer gold */
        color: #000 !important; /* black for readability */
        text-align: center;
        font-weight: 600;
    }

    /* TABLE BODY */
    td { color: #333; }

    /* BUTTONS */
    .btn-primary {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
    }
    .btn-primary:hover {
      background-color: var(--primary-dark);
    }

    /* MODAL */
    .modal-content {
      border-radius: 10px;
      border: 2px solid var(--primary-color);
    }

    /* TITLE */
    #divTitle {
      color: var(--primary-dark);
      font-size: 1.2rem;
      font-weight: 700;
    }
</style>

</head>

<body class="hold-transition sidebar-mini sidebar-expand layout-fixed">
<div class="wrapper">

<!-- ========================================================= -->
<!--                         NAVBAR                            -->
<!-- ========================================================= -->

  <nav class="main-header navbar navbar-expand navbar-white navbar-light">
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
      </li>
    </ul>

    <div class="row" style="width:-webkit-fill-available" align="center">
      <div class="col-12"><div id="divTitle"></div></div>
    </div>

    <ul class="navbar-nav ml-auto">

      <li class="nav-item">
        <a href="?a=showHomePage" class="nav-link"><strong>Home</strong></a>
      </li>

      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown">
          <strong>${userdetails.username}</strong>
        </a>

        <div class="dropdown-menu dropdown-menu-right">
          <a class="dropdown-item"><strong>Valid Till (${userdetails.validTillDDMMYYY})</strong></a>
          <a href="?a=showChangePassword" class="dropdown-item"><strong>Change Password</strong></a>
          <a href="?a=showShortcuts" class="dropdown-item"><strong>Shortcuts</strong></a>
          <a href="javascript:logout();" class="dropdown-item" id="refLogout"><strong>Logout</strong></a>
        </div>
      </li>

    </ul>
  </nav>

<!-- ========================================================= -->
<!--                        SIDEBAR                             -->
<!-- ========================================================= -->

  <aside class="main-sidebar sidebar-dark-primary elevation-4">
    <div class="sidebar">

      <div class="user-panel mt-3 pb-3 mb-3 d-flex">
        <div class="image">
          <img src="dist/img/user2-160x160.jpg" class="img-circle elevation-2">
        </div>
        <div class="info">
          <a href="#" class="d-block">${userdetails.username}<br>(${userdetails.firm_name}${userdetails.store_name})</a>
        </div>
      </div>

      <div class="form-inline sidebar-search-open">
        <div class="input-group">
          <input class="form-control form-control-sidebar" id="txtseachsidebar" onkeyup="searchElement(this)" placeholder="Search">
          <div class="input-group-append">
            <button class="btn btn-sidebar"><i class="fas fa-fw fa-search"></i></button>
          </div>
        </div>
      </div>

     <nav class="mt-2">
  <ul class="nav nav-pills nav-sidebar flex-column"
      data-widget="treeview"
      role="menu"
      data-accordion="false">

    <c:forEach items="${elementsDB}" var="item">
      <li class="nav-item has-treeview" name="listItemParentElements" id="${item.getElementName()}">
        <a href="#" name="anchorParentElement" class="nav-link" style="color:floralwhite;font-weight:800">
          <i class="nav-icon fas fa-tachometer-alt"></i>
          <p>${item.getElementName()}<i class="right fas fa-angle-left"></i></p>
        </a>
        <ul class="nav nav-treeview">
          <c:forEach items="${item.getChildElements()}" var="item1">
            <li id="${item1.getElementName()}" class="nav-item">
              <a href="${item1.getElementUrl()}" style="color:floralwhite" class="nav-link">
                <i class="nav-icon fas fa-edit"></i>
                <p style="color:cyan">${ item1.getElementName()}</p>
              </a>
            </li>
          </c:forEach>
        </ul>
      </li>
    </c:forEach>

  </ul>
</nav>


    </div>
  </aside>

<!-- ========================================================= -->
<!--                   MAIN CONTENT AREA                        -->
<!-- ========================================================= -->

  <div class="content-wrapper" style="background:lightblue">
    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <jsp:include page="${jspName}"/>
          </div>
        </div>
      </div>
    </section>
  </div>

</div> <!-- wrapper end -->

<!-- ========================================================= -->
<!--                       MODAL                                -->
<!-- ========================================================= -->

<div class="modal fade" id="myModal" role="dialog">
  <div class="modal-dialog modal-lg" style="min-width:100%">
    <div class="modal-content">
      <div class="modal-body" align="center">
        <p id="responseText"><div align="center" class="loader" id="loader"></div></p>
      </div>
      <div class="modal-footer" style="text-align:right">
        <button id="closebutton" type="button" onclick='location.reload()' class="btn btn-danger" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<!-- ========================================================= -->
<!--                  JAVASCRIPT FUNCTIONS                      -->
<!-- ========================================================= -->

<script>
function navigateToURL(theURL){ window.location=theURL; }

function logout() {
	document.getElementById("closebutton").style.display='none';
	$('#myModal').modal({backdrop: 'static', keyboard: false});

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	  if (xhttp.readyState == 4 && xhttp.status == 200) {
	    document.getElementById("loader").style.display='none';
	    document.getElementById("responseText").innerHTML=xhttp.responseText;
	    document.getElementById("closebutton").style.display='block';
	    window.location.reload();
	  }
	};
	xhttp.open("GET","?a=Logout", true);
	xhttp.send();
}
</script>

<script>
$(document).ready(function () {
  window.onkeydown = function(evt) {
    if (evt.keyCode == 119) logout();  // F8
  };
});
</script>

<!-- SEARCH SIDEBAR -->
<script>
function searchElement(txtsearch){
	var parentElements=document.getElementsByName("listItemParentElements");
	var showParent=false;

	for(var i=0;i<parentElements.length;i++){
		var childElements=parentElements[i].childNodes[3];
		var childElementsLi=childElements.getElementsByTagName("li");

		for(var m=0;m<childElementsLi.length;m++){
			var link = childElementsLi[m].querySelector("a p");
			if (!link) continue;

			var name = link.innerHTML.toLowerCase();
			if(!name.includes(txtsearch.value.toLowerCase())){
				childElementsLi[m].style.display="none";
			} else {
				childElementsLi[m].style.display="";
				showParent=true;
			}
		}

		if(parentElements[i].id.toLowerCase().includes(txtsearch.value.toLowerCase()) || showParent)
			parentElements[i].style.display="";
		else
			parentElements[i].style.display="none";

		showParent=false;
	}

	var list=document.getElementsByName("listItemParentElements");
	for(var z=0;z<list.length;z++){
		list[z].className = (txtsearch.value=="") 
		  ? "nav-item has-treeview"
		  : "nav-item has-treeview menu-open";
	}
}
</script>

<!-- KEYBOARD SHORTCUTS -->
<script>
window.addEventListener('keydown', function(e) {
  if (e.altKey && e.keyCode == 76) logout();   // ALT + L
});
window.addEventListener('keydown', function(e) {
  if (e.altKey && e.shiftKey && e.keyCode == 82) window.location.href = "?a=reloadSession"; // ALT+SHIFT+R
});

window.onload = function() {
  document.getElementById("txtseachsidebar").focus();
};

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.shiftKey && event.key === 'F') {
      document.getElementById("txtseachsidebar").focus();
    }
});
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.shiftKey && event.key === 'H') {
      window.location="?a=showHomePage";
    }
});
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.shiftKey && event.key === 'L') {
      logout();
    }
});
</script>

</body>
</html>