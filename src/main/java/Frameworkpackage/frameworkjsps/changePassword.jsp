<style>
.vertiAlignMiddle {
  vertical-align: middle !important;
}
</style>

<script>
$(document).ready(function() {
    $("#show_password_toggle").on('click', function(event) {
        event.preventDefault();
        var password_field = $("#txtoldpassword");
        var password_toggle = $("#show_password_toggle i");
        if (password_field.attr("type") == "password") {
            password_field.attr("type", "text");
            password_toggle.removeClass("fa-eye-slash").addClass("fa-eye");
        } else {
            password_field.attr("type", "password");
            password_toggle.removeClass("fa-eye").addClass("fa-eye-slash");
        }
    });
});

$(document).ready(function() {
	  // Toggle new password visibility
	  $("#newpassword_toggle").on('click', function(event) {
	    event.preventDefault();
	    var toggle = $(this).find('i');
	    var input = $("#txtnewpassword");
	    if (input.attr("type") == "password") {
	      input.attr("type", "text");
	      toggle.removeClass("fa-eye-slash");
	      toggle.addClass("fa-eye");
	    } else {
	      input.attr("type", "password");
	      toggle.removeClass("fa-eye");
	      toggle.addClass("fa-eye-slash");
	    }
	  });
	});

$(document).ready(function(){
	  $('#show_confirm_password_toggle').on('click', function(e){
	    e.preventDefault();
	    var type = $('#txtconfirmnewpassword').attr('type') === 'password' ? 'text' : 'password';
	    $('#txtconfirmnewpassword').attr('type', type);
	    $(this).find('i').toggleClass('fa-eye fa-eye-slash');
	  });
	});

document.getElementById("divTitle").innerHTML="Change Password";

function changePasswordAjax()
{	
	var oldPassword= encodeURIComponent(document.getElementById("txtoldpassword").value);
	var newPassword= encodeURIComponent(document.getElementById("txtnewpassword").value);
	var confirmnewpassword= encodeURIComponent(document.getElementById("txtconfirmnewpassword").value);
	
	
	if(confirmnewpassword!=newPassword)
		{
			alert("New password and Confirm Password should be same");
			return;	
		}
	
	
	
	
	
	var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() 
	  {
	    if (xhttp.readyState == 4 && xhttp.status == 200) 
	    { 		     
	    	 
	    	 
	    	 document.getElementById("responseText").innerHTML=xhttp.responseText;
	   	  document.getElementById("closebutton").style.display='block';
	   	  document.getElementById("loader").style.display='none';
	   	  $('#myModal').modal({backdrop: 'static', keyboard: false});;	    	 
	    
		}
	  };
	  xhttp.open("POST","?a=changePassword&oldPassword="+oldPassword+"&newPassword="+newPassword,true);    
	  xhttp.send();	
}
</script>

<div class="container">
  <table class="table table-bordered tablecss" border="3">

    <br>
    <div class="container" style="padding:20px;background-color:white">
      <form
        id="frm"
        action="?a=addCategory"
        method="post"
        enctype="multipart/form-data"
        accept-charset="UTF-8"
      >
        <input type="hidden" name="app_id" value="${userdetails.app_id}" />
        <input type="hidden" name="user_id" value="${userdetails.user_id}" />
        <input type="hidden" name="callerUrl" id="callerUrl" value="" />

        <div class="row">
          <div class="col-sm-12">
            <div class="form-group pass_show">
              <label>Current Password</label>
              <div class="input-group">
    <input type="password" class="form-control" id="txtoldpassword" placeholder="Current Password">
    <div class="input-group-append">
        <span class="input-group-text">
            <a href="#" id="show_password_toggle"><i class="fa fa-eye-slash"></i></a>
        </span>
    </div>
</div>
              <input
                type="hidden"
                name="hdnCategoryId"
                value="${categoryDetails.category_id}"
                id="hdnCategoryId"
              />
            </div>
          </div>

          <div class="col-sm-12">
            <div class="form-group pass_show">
  <label>New Password</label>
  <div class="input-group">
    <input
      type="password"
      class="form-control"
      id="txtnewpassword"
      placeholder="New Password"
    />
        <div class="input-group-append">
        <span class="input-group-text">
      <a href="#" id="newpassword_toggle"><i class="fa fa-eye-slash" aria-hidden="true"></i></a>
  </div>
</div>
</div>
</div>


          <div class="col-sm-12">
            <div class="form-group">
              <label>Confirm Password</label>
              <div class="input-group">
  <input type="password" class="form-control" id="txtconfirmnewpassword" placeholder="Confirm Password">
  <div class="input-group-append">
    <span class="input-group-text">
      <a href="#" id="show_confirm_password_toggle"><i class="fa fa-eye-slash"></i></a>
    </span>
  </div>
</div>
              
            </div>
          </div>

          <button
            class="btn btn-success"
            type="button"
            onclick="changePasswordAjax()"
          >
            Save
          </button>
          <button
            class="btn btn-danger"
            type="reset"
            onclick='window.location="?a=showHomePage"'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </table>
</div>
