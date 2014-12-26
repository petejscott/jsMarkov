'use strict';

var UI = UI || {};
UI.workflow = (function(win) {

	function disableStep(element) {
		if (element === null) return;
		element.classList.remove("enabled");
		element.classList.remove("current");
		element.classList.add("disabled");
		var inputs = element.querySelectorAll("input");
		for (var i = 0, len = inputs.length; i < len; i++) {
			inputs[i].disabled = true;
		}
	}
	function enableStep(element) {
		if (element === null) return;
		element.classList.remove("disabled");
		element.classList.remove("current");
		element.classList.add("enabled");
		var inputs = element.querySelectorAll("input");
		for (var i = 0, len = inputs.length; i < len; i++) {
			inputs[i].disabled = false;
		}
	}
	
	function setCurrentStep(step) {
		var stepElements = win.document.querySelectorAll("[data-step]");
		for (var i = 0, len = stepElements.length; i < len; i++) {
			var stepElement = stepElements[i];
			var currentElementStep = parseFloat(stepElement.getAttribute("data-step"));
			if (currentElementStep < step) {
				enableStep(stepElement);
			}
			else if (currentElementStep === step) {
				enableStep(stepElement);
				stepElement.classList.add("current");
			}
			else if (currentElementStep > step) {
				disableStep(stepElement);
			}
		}
	}
	
	return {
		setCurrentStep : setCurrentStep
	};
	
})(this);
