// Define variables + regex conditions:
const jsPunsString = /JS Puns/;
const heartJS = /I ♥ JS/;
let totalCost = 0;

// Require a properly formated credit card, based on the following requirements: https://www.regular-expressions.info/creditcard.html
const creditCardRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/;

// Require email format, as per collected here: https://emailregex.com/
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Check to make sure the Postal Code follows the correct formatting 
const postalRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

// Match CVV for 3 or 4 numbers
const cvvRegex = /^[0-9]{3,4}$/

// Use jQuery to select the 'Name' input element and place focus on it.
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
// The goal for the t-shirt section is to filter the available "Color" options by the selected theme in the "Design" field. Doing this ensures that the user cannot select an invalid combination of values for the "Design" and "Color" fields.

// When the form is initially loaded, we need to update the "Design" and "Color" fields so that it's clear to the user that they need to select a theme before selecting a color.
// Use jQuery to:
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
// Like many code problems, there are multiple ways to complete this section of the project. One
// option would be to simply reference each checkbox input, as well as the cost, and day and time
// from each input’s parent `label` element, and store those values in variables, or in an object as
// key value pairs. Then, in an event handler that listens for ‘changes’ to the activity section, you
// could use a set of conditionals to disable conflicting activities, and add or subtract from the total
// cost element you create, depending on whether the checkbox was checked or unchecked.
// But a preferred approach would be to come up with a dynamic solution that will work even if
// the cost, day or time of the activities were changed in the HTML. To do that, we'll:

// Creating an element to display the total activity cost
$(".activities").append("<div id='total-cost'></div>");

function runningTotal(totalCost) {
	$("#total-cost").text("The total cost of your activities is $" + totalCost);
}
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
// Initially, the credit card section should be selected and displayed in the form, and the other two
// payment options should be hidden. The user should be able to change payment options at any
// time, but shouldn’t be able to select the “Select Payment Method” option. So you’ll need to
// check the currently selected payment option, and hide and show the payment sections in the
// form accordingly.

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
// function isValidName(name){
// 	return /^[a-z]+$/.test(name);
// }

// function isValidEmail(email) {
// 	return /^[^@]+@[^@.]+\.[a-z]+$/i.test(email);
//   }

// Form Validation and Validation Messages
// There are numerous ways to accomplish this part of the project. You could try to cram all the programming for this section into the submit event listener. You could try to validate all of the required fields in a single function and then call that function in a submit listener.

// You could separate the validation and validation messages into separate tasks handled independently of each other. But it's generally a good idea to start with the simplest possible solution. Here’s an example of a straightforward approach that takes it one step at a time.

// There are three sections of the form that are always required: name, email and activities. The credit section—comprised of three inputs—only needs to be validated if “credit card” is the selected payment method. To keep things simple, you can create a function to validate each required section, as well as add and remove a validation error indicator of some sort. Each required section will need to be tested to see if it meets certain criteria, which are detailed in the project instructions. If the criteria are not met, the validation function should add a validation error indication for that field and return false. Else, the function should remove any validation error indicator and return true.

// Create a separate validation function for each of the required form fields or sections
// ○ Name

function isValidName() {
	if ($("#name").val() === "") {
		$("input#name").css("backgroundColor", "red");
		return false;
	} else if (/[\w\-'\s]+/.test($("#name").val())) {
		$("input#name").css("backgroundColor", "green");
		return true;
	} else {
		$("input#name").css("backgroundColor", "red");
		return false;
	}
}

$("#name").on("input blur", () => {
	isValidName();
});

function isValidEmail() {
	if ($("#mail").val() === "") {
		$("input#mail").css("backgroundColor", "red");
		return false;
	} else if (
		emailRegex.test(
			$("#mail").val()
		)
	) {
		$("input#mail").css("backgroundColor", "green");
		return true;
	} else {
		$("input#mail").css("backgroundColor", "red");
		return false;
	}
}

$("#mail").on("input blur", () => {
	isValidEmail();
});

// ○ Activity Section

function isActivitiesSelected() {
	if ($(".activities input:checked").length > 0) {
		$(".activities").css("backgroundColor", "green");
		return true;
	} else {
		$(".activities").css("backgroundColor", "red");
		return false;
	}
}

$(".activities").on("input", () => {
	isActivitiesSelected();
});

// Credit Cards

function validateCreditCardNumber() {
	if ($("#payment option:selected").text() === "Credit Card") {
		if ($("#cc-num").val() === "") {
			$("#cc-num").css("backgroundColor", "red");
			return false;
		} else if (creditCardRegex.test($("#cc-num").val())) {
			$("#cc-num").css("backgroundColor", "green");
			return true;
		} else {
			$("#cc-num").css("backgroundColor", "red");
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
			$("#zip").css("backgroundColor", "red");
			return false;
		} else if (postalRegex.test($("#zip").val())) {
			$("#zip").css("backgroundColor", "green")
			return true;
		} else {
			$("#zip").css("backgroundColor", "red");
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
			$("#cvv").css("backgroundColor", "red");
			return false;
		} else if ((cvvRegex.test($("#cvv").val()))){
			$("#cvv").css("backgroundColor", "green");
			return true;
		} else {
			$("#cvv").css("backgroundColor", "red");
			return false;
		}
	} else {
		return true;
	}
}

$("#cvv").on("input blur", () => {
	validateCVV();
});

function testAllConditions(){
	if(isValidName() && isValidEmail() && isActivitiesSelected() && validateCreditCardNumber() && validatePostalCode() && validateCVV()){
		return true;
	} else {
		alert("You have some outstanding errors");
	}
}

// With the individual validation functions complete, a single master validation function can now be created to test them all with a single function call. If all the individual validation functions return true, then the master validation function should return true as well. And if any individual validation functions return false, then the master function should do the same.

// ○ NOTE: Remember, the name, email and activity section need to be validated on every submission attempt regardless of which payment method has been selected. But the three credit card fields  will only need to be validated if “credit card” is the selected payment method.

// Now that you have the individual validation functions and a function to orchestrate the whole validation process, we need a way to kick things off. For example, a submit event listener on the form element could prevent the default submission behavior of the form if any of the fields are invalid, or false.

$("form").submit(function(e) {
	e.preventDefault();
	if (testAllConditions()) {
		this.submit(); 
	}
	
});
