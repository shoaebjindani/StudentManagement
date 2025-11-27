
<script src="js/jquery.min.js"></script>
<link href="css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
<script src="js/bootstrap.min.js"></script>

<c:set var="error_id" value='${requestScope["outputObject"].get("error_id_with_date")}' />



<div class="container">
    <div class="row">
        <div class="col-md-12">
            <div class="error-template">
                <h1>
                    Error!</h1>
                <h2>
                    An Error has occured from doing the required Task <br>
                    Error id:- ${error_id}</h2>
                <div class="error-details">
                    Please contact support
                </div>
                <div class="error-actions">
                    <a href="#" onclick="window.history.back();" class="btn btn-primary btn-lg"><span class="glyphicon glyphicon-home"></span>
                        Back</a>
                </div>
            </div>
        </div>
    </div>
</div>
