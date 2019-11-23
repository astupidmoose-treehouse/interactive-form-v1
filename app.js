// Define variables + regex conditions:
const jsPunsString = /JS Puns/;
const heartJS = /I ♥ JS/;
let totalCost = 0;

// Regex for a name
const nameRegex = /^([a-zA-Z ]){2,30}$/;

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

// $("#color").hide();
// $('label[for="color"]').hide();
$("#colors-js-puns").hide();

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
		$("#colors-js-puns").show();
		showColors(jsPunsString);
	} else {
		$("#colors-js-puns").show();
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
		$("#cvv-error").remove();
		$("#zip-error").remove();
		$("#ccnumber-error").remove();
	} else if (checkPaymentMethod === "Bitcoin") {
		$("#bitcoin").show();
		$("#cvv-error").remove();
		$("#zip-error").remove();
		$("#ccnumber-error").remove();
	}
});

// Form Validation and Validation Messages

// create an error handler ( defunct, and not working so removed from code. Will look at again in the future to see about a refactor)
// function showError(element, message){
// 	// $(".error").remove();
// 	console.log(element);
// 	$(element).after("<div id='" + element + "-error' style='font-weight: bold; color:red;'>" + message + "</div>");
// }

// Validation function for name

function isValidName() {
	if ($("#name").val() === "") {
		$("input#name").css("borderColor", "red");
		$("#name-error").remove();
		$("input#name").after("<div id='name-error' style='font-weight: bold; color:red;'>Name is Missing</div>");
		return false;
	} else if (nameRegex.test($("#name").val())) {
		$("input#name").css("borderColor", "green");
		$("#name-error").remove();
		return true;
	} else {
		$("input#name").css("borderColor", "red");
		$("#name-error").remove();
		$("input#name").after("<div id='name-error' style='font-weight: bold; color:red;'>Your name is not formatted correctly</div>");
		return false;
	}
}

$("#name").on("input blur", () => {
	isValidName();
});

// Validation function for email

function isValidEmail() {
	if ($("#mail").val() === "") {
		$("input#mail").css("borderColor", "red");
		$("#email-error").remove();
		$("input#mail").after("<div id='email-error' style='font-weight: bold; color:red;'>Your email address cannot be empty</div>");
		return false;
	} else if (
		emailRegex.test(
			$("#mail").val()
		)
	) {
		$("input#mail").css("borderColor", "green");
		$("#email-error").remove();
		return true;
	} else {
		$("input#mail").css("borderColor", "red");
		$("#email-error").remove();
		$("input#mail").after("<div id='email-error' style='font-weight: bold; color:red;'>Email address must be formatted properly</div>");
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
		$("#activity-error").remove();
		return true;
	} else {
		$("#activity-error").remove();
		$(".activities").after("<div id='activity-error' style='font-weight: bold; color:red;'>Please select at least one activity!</div>");
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
			$("#cc-num").css("borderColor", "red");
			$("#ccnumber-error").remove();
			$("#credit-card").after("<div id='ccnumber-error' style='font-weight: bold; color:red;'>Credit Card number cannot be empty</div>");
	
			return false;
		} else if (creditCardRegex.test($("#cc-num").val())) {
			$("#cc-num").css("borderColor", "green");
			$("#ccnumber-error").remove();
			return true;
		} else {
			$("#cc-num").css("borderColor", "red");
			$("#ccnumber-error").remove();
			$("#credit-card").after("<div id='ccnumber-error' style='font-weight: bold; color:red;'>Credit Card must be a valid number</div>");
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
			$("#zip-error").remove();
			$("#credit-card").after("<div id='zip-error' style='font-weight: bold; color:red;'>Postal code cannot be empty</div>");

			return false;
		} else if (postalRegex.test($("#zip").val())) {
			$("#zip").css("borderColor", "green")
			$("#zip-error").remove();
			return true;
		} else {
			$("#zip").css("borderColor", "red");
			$("#zip-error").remove();
			$("#credit-card").after("<div id='zip-error' style='font-weight: bold; color:red;'>Postal Code must be in the format of A1A1A1</div>");

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
			// showError($("#credit-card"), "CVV cannot be empty");
			$("#cvv-error").remove();
			$("#credit-card").after("<div id='cvv-error' style='font-weight: bold; color:red;'>CVV cannot be empty</div>");
			return false;
		} else if ((cvvRegex.test($("#cvv").val()))){
			$("#cvv").css("borderColor", "green");
			$("#cvv-error").remove();
			return true;
		} else {
			$("#cvv").css("borderColor", "red");
			// showError($("#credit-card"), "CVV must be 3 or 4 numbers");
			$("#cvv-error").remove();
			$("#credit-card").after("<div id='cvv-error' style='font-weight: bold; color:red;'>CVV must be 3 or 4 numbers</div>");

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
	isValidName();
	isValidEmail();
	isActivitiesSelected();
	validateCVV();
	validatePostalCode();
	validateCreditCardNumber();

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
