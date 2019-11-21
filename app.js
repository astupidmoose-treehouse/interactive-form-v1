// Define variables + regex conditions:
const jsPunsString = /JS Puns/;
const heartJS = /I ♥ JS/;
let totalCost = 0;

// Regex for a name
const nameRegex = /[\w\-'\s]+/;

// Require email format, as per collected here: https://emailregex.com/
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Require a properly formated credit card, based on the following requirements: https://www.regular-expressions.info/creditcard.html
const creditCardRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/;

// Check to make sure the Postal Code follows the correct formatting 
const postalRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

// Match CVV for 3 or 4 numbers
const cvvRegex = /^[0-9]{3,4}$/
//----------------------------------------------------------------------------------

//Main Section
// Use jQuery to select the 'Name' input element and place focus on it when page loads.
$("#name").focus();

// Target the ‘Other’ input field, and hide it initially, so that it will display if JavaScript is disabled, but be hidden initially with JS.
$("#other-title").hide();

// If the other selection is made, show the other input field, else hide it.
$("#title").change(function() {
	checkTitleName = $("#title option:selected").text();
	if (checkTitleName === "Other") {
		$("#other-title").show();
	} else {
		$("#other-title").hide();
	}
});

// T-Shirt section
// ● Hide the “Select Theme” `option` element in the “Design” menu.
$("#design")
	.children(":first")
	.hide();

// Hide Color form until selected

$("#color").hide();

// ● Update the “Color” field to read “Please select a T-shirt theme”.
$("#color")
	.prepend("<option selected>Please select a T-shirt theme</option>")
	.children(":first")
	.hide();

// ● Hide the colors in the “Color” drop down menu.
$("#color")
	.children()
	.hide();

// Create a function to: Find all color options, hide them, then check if they contain the needed string for showing them.
function showColors(colorString) {
	$("#color")
		.children()
		.each(function() {
			$(this).hide();
			if (colorString.test($(this).text())) {
				$(this).show();
			}
		});
}

// Change trigger for design element.
$("#design").change(function() {
	// Reset the color to the default
	$("#color").prop("selectedIndex", 0);
	// check which design is selected, and show colors accordingly.
	if ($("#design option:selected").text() === "Theme - JS Puns") {
		$("#color").show();
		showColors(jsPunsString);
	} else {
		$("#color").show();
		showColors(heartJS);
	}
});

// Activity section
// Creating an element to display the total activity cost
$(".activities").append("<div id='total-cost'></div>");

// Create a function to add to display the cost

function runningTotal(totalCost) {
	$("#total-cost").text("The total cost of your activities is $" + totalCost);
}

// call the function
runningTotal(totalCost);

// Listening for changes in the activity section
// Add a change event listener to the activity section.

$(".activities input").change(function(event) {
	// set the element that was just clicked
	let activityInput = event.target;
	// set that elements cost as an Int
	let cost = parseInt(
		$(activityInput)
			.attr("data-cost")
			.replace(/[^0-9\.]+/g, "")
	);

	// loop through all inputs, for each of them, log the date/time, check if the conditions match
	$(".activities input").each(function() {
		if (
			$(this).attr("data-day-and-time") ===
				$(activityInput).attr("data-day-and-time") &&
			$(this).attr("name") !== $(activityInput).attr("name")
		) {
			if (activityInput.checked) {
				$(this).prop("disabled", true);
			} else {
				$(this).prop("disabled", false);
			}
		}
	});

	// if the target is checked, add the cost to total
	if (activityInput.checked) {
		totalCost += cost;
		runningTotal(totalCost);
		// if the target is unchecked, subtract the cost.
	} else {
		totalCost -= cost;
		runningTotal(totalCost);
	}
});

// Payment Section

// ● Hide the “Select Payment Method” `option` so it doesn’t show up in the drop down menu.
$("#payment")
	.prop("selectedIndex", 1)
	.children(":first")
	.hide();
$("#bitcoin").hide();
$("#paypal").hide();

// ● Get the value of the payment select element, and if it’s equal to ‘credit card’, set the
// credit card payment section in the form to show, and set the other two options to hide.

$("#payment").change(function() {
	checkPaymentMethod = $("#payment option:selected").text();
	$("#credit-card").hide();
	$("#bitcoin").hide();
	$("#paypal").hide();
	if (checkPaymentMethod === "Credit Card") {
		$("#credit-card").show();
	} else if (checkPaymentMethod === "PayPal") {
		$("#paypal").show();
	} else if (checkPaymentMethod === "Bitcoin") {
		$("#bitcoin").show();
	}
});

// Form Validation and Validation Messages

// create an error handler
function showError(element, message){
	$(".error").remove();
	element.after("<div class='error'><p style='font-weight: bold; color:red;'>" + message + "</p></div>");
}

// Validation function for name

function isValidName() {
	if ($("#name").val() === "") {
		$("input#name").css("borderColor", "red");
		showError($("input#name"), "Name is Missing");
		return false;
	} else if (nameRegex.test($("#name").val())) {
		$("input#name").css("borderColor", "green");
		$(".error").remove();
		return true;
	} else {
		showError($("input#name"), "Your name is not formatted correctly");
		$("input#name").css("borderColor", "red");
		return false;
	}
}

$("#name").on("input blur", () => {
	isValidName();
});

// Validation function for email

function isValidEmail() {
	if ($("#mail").val() === "") {
		showError($("input#mail"), "Your email address cannot be empty");
		$("input#mail").css("borderColor", "red");
		return false;
	} else if (
		emailRegex.test(
			$("#mail").val()
		)
	) {
		$("input#mail").css("borderColor", "green");
		$(".error").remove();
		return true;
	} else {
		showError($("input#mail"), "Email address must be formatted properly");
		$("input#mail").css("borderColor", "red");
		return false;
	}
}

$("#mail").on("input blur", () => {
	isValidEmail();
});

// ○ Activity Section
// Validation function for Activity
function isActivitiesSelected() {
	if ($(".activities input:checked").length > 0) {
		$(".error").remove();
		return true;
	} else {
		showError($(".activities"), "Please select at least one activity!");
		return false;
	}
}

$(".activities").on("input", () => {
	isActivitiesSelected();
});

// Credit Cards validation functions

function validateCreditCardNumber() {
	if ($("#payment option:selected").text() === "Credit Card") {
		if ($("#cc-num").val() === "") {
			showError($("#credit-card"), "Credit Card number cannot be empty");
			$("#cc-num").css("borderColor", "red");
			return false;
		} else if (creditCardRegex.test($("#cc-num").val())) {
			$("#cc-num").css("borderColor", "green");
			$(".error").remove();
			return true;
		} else {
			showError($("#credit-card"), "Credit Card must be a valid number");
			$("#cc-num").css("borderColor", "red");
			return false;
		}
	} else {
		return true;
	}
}

$("#cc-num").on("input blur", () => {
	validateCreditCardNumber();
});

function validatePostalCode() {
	if ($("#payment option:selected").text() === "Credit Card") {
		if ($("#zip").val() === "") {
			$("#zip").css("borderColor", "red");
			showError($("#credit-card"), "Postal code cannot be empty");
			return false;
		} else if (postalRegex.test($("#zip").val())) {
			$("#zip").css("borderColor", "green")
			$(".error").remove();
			return true;
		} else {
			$("#zip").css("borderColor", "red");
			showError($("#credit-card"), "Postal Code must be in the format of A1A1A1");
			return false;
		}
	} else {
		return true;
	}
}

$("#zip").on("input blur", () => {
	validatePostalCode();
});

function validateCVV() {
	if ($("#payment option:selected").text() === "Credit Card") {
		if ($("#cvv").val() === "") {
			$("#cvv").css("borderColor", "red");
			showError($("#credit-card"), "CVV cannot be empty");
			return false;
		} else if ((cvvRegex.test($("#cvv").val()))){
			$("#cvv").css("borderColor", "green");
			$(".error").remove();
			return true;
		} else {
			$("#cvv").css("borderColor", "red");
			showError($("#credit-card"), "CVV must be 3 or 4 numbers");
			return false;
		}
	} else {
		return true;
	}
}

$("#cvv").on("input blur", () => {
	validateCVV();
});

// Master validation check, return true, only if all functions return true. 

function testAllConditions(){
	if(isValidName() && isValidEmail() && isActivitiesSelected() && validateCreditCardNumber() && validatePostalCode() && validateCVV()){
		$(".error").remove();
		return true;
	} 
}

// Submit event listener on the form element to prevent the default, then check the master condition test. If good, submit the form.

$("form").submit(function(e) {
	e.preventDefault();
	if (testAllConditions()) {
		this.submit(); 
	}
	
});
