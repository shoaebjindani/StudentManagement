listOfRoles
<script src="js/jquery.min.js"></script>
<link href="css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
<script src="js/bootstrap.min.js"></script>



<div class="container">
    <div class="row">
        <div class="col-md-12">
            <div class="error-template">
                <h1>
                    You are Unauthorized to view this page.</h1>
                <h2>
                    ${username} having role of ${listOfRoles} is not allowed to perform this action: "${param.a}" Please contact one of the admins to get appropriate role</h2>
                <div class="error-details">
                    You may not be authorized to view this page
                </div>
                <div class="error-actions">
                    <a href="#" onclick="window.history.back();" class="btn btn-primary btn-lg"><span class="glyphicon glyphicon-home"></span>
                        Back</a>
                </div>
            </div>
        </div>
    </div>
</div>