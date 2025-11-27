


function getRequiredString() {
	var inputs = document.getElementsByTagName('input');
	var reqString = "";
	for (var i = 0; i < inputs.length; i++) {
		if (inputs[i].type == 'checkbox') {
			reqString += inputs[i].id + "=" + inputs[i].checked + "&";
		}
		else
			if (inputs[i].type == 'radio') {
				if (inputs[i].checked) {
					reqString += inputs[i].name + "=" + encodeURIComponent(inputs[i].value) + "&";
				}
			}
			else {
				reqString += inputs[i].id + "=" + inputs[i].value + "&";
			}
	}
	inputs = document.getElementsByTagName('select');
	for (var x = 0; x < inputs.length; x++) // for all the selects
	{
		reqString += inputs[x].id + "=";
		for (var m = 0; m < inputs[x].length; m++) {
			if (inputs[x][m].selected) {
				reqString += encodeURIComponent(inputs[x][m].value) + "~";
			}
		}
		reqString += "&"
	}


	inputs = document.getElementsByTagName('textarea');
	for (var i = 0; i < inputs.length; i++) {
		reqString += inputs[i].id + "=" + inputs[i].value + "&";
	}



	return reqString;
}
function digitsOnly(evnt) {
	var charpressed = String.fromCharCode(evnt.which);
	if (DigitsOnly.indexOf(charpressed) == -1) {
		evnt.preventDefault();
	}
}


function digitsOnlyWithDot(evnt) {
	var charpressed = String.fromCharCode(evnt.which);
	if (DigitsOnlyWithDots.indexOf(charpressed) == -1) {
		evnt.preventDefault();
	}
}



var AlphabetsAndSpace = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
var DigitsOnly = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

var DigitsOnlyWithDots = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'];

function downloadExcel() {
	window.location = window.location + "&exportFlag=E";
}

function downloadPDF() {
	window.open(window.location + "&exportFlag=P");
}

function downloadText() {
	window.open(window.location + "&exportFlag=T");
}

function disableInputs() {
	var inputs = document.getElementsByTagName("INPUT");
	for (var i = 0; i < inputs.length; i++) {
		inputs[i].disabled = true;
	}
}

function disableButtons() {
	var inputs = document.getElementsByTagName("button");
	for (var i = 0; i < inputs.length; i++) {
		inputs[i].disabled = true;
	}
}

function disableSelects() {
	var inputs = document.getElementsByTagName("select");
	for (var i = 0; i < inputs.length; i++) {
		inputs[i].disabled = true;
	}
}

function disableAllComponents() {

	disableInputs();
	disableButtons();
	disableSelects();

}

document.addEventListener('keydown', function(event) {
    // Check if Ctrl, Shift, and H keys are pressed simultaneously
    if (event.ctrlKey && event.shiftKey && event.key === 'H') {
        // Ctrl + Shift + H is pressed
       // alert('Ctrl + Shift + H is pressed');
		window.location='?a=showHomePage';
        // Add your code here to perform actions when Ctrl + Shift + H is pressed
    }
});
