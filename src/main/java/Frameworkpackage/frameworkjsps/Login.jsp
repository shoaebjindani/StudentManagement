<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<head>
    <title>${projectName}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="img/favicon.ico" type="image/png" sizes="16x16">

    <link rel="stylesheet" href="../css/bootstrap.min.css">
    <link rel="stylesheet" href="../plugins/toastr/toastr.min.css">
    <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />

    <script src="../js/jquery.min.js"></script>
    <script src="../js/bootstrap.min.js"></script>
    <script src="../plugins/toastr/toastr.min.js"></script>

    <style>
        /* ====== Soft Champagne Gold Theme ====== */
        body, html {
            height: 100%;
            margin: 0;
            background: linear-gradient(135deg, #f7e7ce, #e6cfb2, #d4b483);
            background-attachment: fixed;
            font-family: 'Segoe UI', sans-serif;
            color: #333;
        }

        .card-container.card {
            max-width: 350px;
            padding: 40px 40px;
        }

        .card {
            background-color: #fdfaf6;
            padding: 25px 30px 35px;
            margin: 50px auto 25px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
            border: 1px solid #e3d7c3;
        }

        .profile-img-card {
            margin: 0 auto 15px;            
            height: 80px;
        }

        .btn-signin {
            background: linear-gradient(90deg, #c8ad7f, #d4b483);
            font-weight: 700;
            font-size: 15px;
            border-radius: 6px;
            border: none;
            color: #fff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            margin-top: 10px;
        }

        .btn-signin:hover {
            background: linear-gradient(90deg, #b99b6b, #c4a777);
            transform: translateY(-1px);
            box-shadow: 0 4px 6px rgba(0,0,0,0.25);
        }

        .form-control {
            border-radius: 6px;
            border: 1px solid #cbbd9e;
            padding: 10px;
            font-size: 14px;
        }

        .form-control:focus {
            border-color: #b99b6b;
            box-shadow: 0 0 5px rgba(201,173,127,0.6);
        }

        .input-group-addon {
            background: #f4ebdd;
            border: 1px solid #cbbd9e;
            border-left: 0;
            cursor: pointer;
            padding: 8px 10px;
            border-radius: 0 6px 6px 0;
        }

        .form-check {
            margin-top: 10px;
        }

        a {
            color: #a6864b;
        }

        a:hover {
            text-decoration: underline;
            color: #8c6e3e;
        }

        #currentAppCode {
            margin-bottom: 10px;
            text-align: center;
            font-weight: bold;
            color: #6e5b3b;
            display: none;
        }

        #currentAppCode a {
            margin-left: 10px;
            font-size: 12px;
            cursor: pointer;
        }

        /* Loader spinner */
        .loader {
            border: 16px solid #f3f3f3;
            border-top: 16px solid #c8ad7f;
            border-radius: 50%;
            width: 100px;
            height: 100px;
            animation: spin 2s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .modal-content {
            border-radius: 10px;
            border: 1px solid #d4b483;
        }

        .modal-header {
            background: #f3e7d1;
            border-bottom: 1px solid #d4b483;
        }

        .modal-title {
            color: #6e5b3b;
            font-weight: 600;
        }
    </style>

    <script>        

        window.addEventListener('keydown', function (e) { if (e.keyCode == 13) login(); });

        function login() {
            document.getElementById("closebutton").style.display = 'none';

            var username = document.getElementById("txtusername");
            var password = document.getElementById("txtpassword");
            var termsCheckbox = document.getElementById("termsCheckbox");
            var appCode = localStorage.getItem("app_code");

            if (!appCode) {
                $('#appCodeModal').modal('show');
                return;
            }

            if (username.value == "") { toastr.error("Please enter Valid username"); username.focus(); return; }
            if (password.value == "") { toastr.error("Please enter Valid password"); password.focus(); return; }
            if (!termsCheckbox.checked) { toastr.error("Please agree to the Terms and Conditions"); return; }

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    if (this.responseText == "Succesfully Logged In") {
                        window.location = window.location.toString().replace('Login.jsp', '../?a=showHomePage');
                    } else {
                        toastr.error(this.responseText);
                        username.value = ""; password.value = ""; username.focus();
                    }
                }
            };
            xhttp.open("POST", "../?actionName=validateLogin", true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send("txtusername=" + username.value + "&txtpassword=" + password.value + "&app_code=" + appCode);
        }

        function saveAppCode() {
            var codeInput = document.getElementById("inputAppCode").value.trim();
            if (codeInput == "") { toastr.error("Please enter App Code"); return; }
            localStorage.setItem("app_code", codeInput);
            $('#appCodeModal').modal('hide');
            toastr.success("App Code saved. Please login now.");
            updateAppCodeDisplay();
        }

        function resetAppCode() {
            localStorage.removeItem("app_code");
            toastr.info("App Code has been reset. Please enter a new App Code.");
            updateAppCodeDisplay();
            $('#appCodeModal').modal('show');
        }

        function showForgotPasswordScreen() { 
            alert('Please contact your admin of your organization to reset your password'); 
        }

        $(document).ready(function () {
            $("#show_hide_password a").on('click', function(event) {
                event.preventDefault();
                var input = $('#show_hide_password input'); 
                var icon = $('#show_hide_password i');
                if (input.attr("type") === "text") {
                    input.attr('type','password');
                    icon.addClass("fa-eye-slash").removeClass("fa-eye");
                } else {
                    input.attr('type','text');
                    icon.removeClass("fa-eye-slash").addClass("fa-eye");
                }
            });

            if (localStorage.getItem("termsAccepted") === "true") {
                $("#termsCheckbox").prop("checked", true);
            }

            $("#termsCheckbox").on("change", function() {
                if ($(this).is(":checked")) {
                    localStorage.setItem("termsAccepted","true");
                } else {
                    localStorage.removeItem("termsAccepted");
                }
            });

            var appCodeDiv = $("#currentAppCode");
            var displayAppCode = $("#displayAppCode");
            var profileImg = $("#profile-img");
            var appCode = localStorage.getItem("app_code");

            appCodeDiv.hide();

            if (appCode) displayAppCode.text(appCode);

            profileImg.off("dblclick").on("dblclick", function() {
                appCodeDiv.toggle();
            });

            $("#changeAppCode").on("click", function(e){
                e.preventDefault();
                $('#appCodeModal').modal('show');
            });

            $("#resetAppCode").on("click", function(e){
                e.preventDefault();
                resetAppCode();
            });

            $("#appCodeModal").on("hide.bs.modal", function() {
                var code = localStorage.getItem("app_code");
                displayAppCode.text(code ? code : "");
                appCodeDiv.hide();
            });

            if (!appCode) { 
                $('#appCodeModal').modal('show'); 
            }
        });
    </script>
</head>

<body>
    <div class="container">
        <div class="card card-container">
            <div class="row">
                <div align="center" class="col-md-12" style="font-size:30px; font-style: italic; color:#6e5b3b; font-weight:800;">
                    ${projectName}
                </div>
            </div>

            <img id="profile-img" src="../img/loginicon.png" class="img-responsive profile-img-card" />

            <div id="currentAppCode" style="display:none;">
                App Code: <span id="displayAppCode"></span>
                <a id="changeAppCode">(Change)</a>                
            </div>

            <form method="POST">
                <input type="text" id="txtusername" maxlength="30" name="txtusername" class="form-control" placeholder="Username" required autofocus>
                <div class="input-group" id="show_hide_password">
                    <input class="form-control" type="password" id="txtpassword" placeholder="Password" name="txtpassword">
                    <div class="input-group-addon">
                        <a href=""><i class="fa fa-eye-slash" aria-hidden="true"></i></a>
                    </div>
                </div>

                <div class="form-check">
                    <input type="checkbox" id="termsCheckbox" class="form-check-input">
                    <label class="form-check-label" for="termsCheckbox">
                        I agree to the <a href="${PRIVACY_POLICY}" target="_blank">Terms and Conditions</a>
                    </label>
                </div>

                <button class="btn btn-lg btn-primary btn-block btn-signin" type="button" onclick="login()">Sign in</button>
                <button class="btn btn-lg btn-primary btn-block btn-signin" type="button" onclick="showForgotPasswordScreen()">Forgot Password</button>
            </form>
        </div>
    </div>

    <!-- App Code Modal -->
    <div class="modal fade" id="appCodeModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-sm" role="document">
            <div class="modal-content">
                <div class="modal-header"><h5 class="modal-title">Enter App Code</h5></div>
                <div class="modal-body">
                    <input type="text" id="inputAppCode" class="form-control" placeholder="App Code">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-signin" onclick="saveAppCode()">Save</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Loader Modal -->
    <div class="modal fade" id="myModal" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body" align="center">
                    <div align="center" class="loader" id="loader"></div>
                </div>
                <div class="modal-footer">
                    <button id="closebutton" type="button" onclick='location.reload()' class="btn btn-signin" data-dismiss="modal">Close Me</button>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
