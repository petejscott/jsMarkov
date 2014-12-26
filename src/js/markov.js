'use strict';

; (function(win, logger) {

	var CONST_MK_INPUT = "#markovFile";
	var CONST_MK_CHAINSIZE = "#markovChainSize";
	var CONST_MK_SELECTED_CHAINSIZE = "#selectedChainSize";
	var CONST_MK_LOAD = "#markovLoad";
	var CONST_MK_SUBMIT = "#markovSubmit";
	var CONST_MK_OUTPUT = "#markovOutput";
	var CONST_MK_NUMSENTENCES = "#markovNumberOfSentences";
	var CONST_MK_SELECTED_NUMSENTENCES = "#selectedNumberOfSentences";

	var markovSourceOptions = {
		sourceText : null,
		wordSet : null,
		chainSize : 0,
		dict : null
	};
	var markovOutputOptions = {
		seedPattern : /[A-Z]/,
		numberOfSentences : 1
	};

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

	function readFile(e) {
		markovSourceOptions.sourceText = null;
		markovSourceOptions.wordSet = null;
		markovSourceOptions.dict = null;
		setOutput("");
		var files = win.document.querySelector(CONST_MK_INPUT).files;
		if (files === null || files.length === 0) return;
		var file = files[0];
		var reader = new FileReader();
		reader.onload = function(e) {
			markovSourceOptions.sourceText = e.target.result;
			setCurrentStep(2);
		};
		reader.readAsText(file);
	} 
	
	function setChainSize(e) {	
		markovSourceOptions.wordSet = null;
		markovSourceOptions.dict = null;
		setOutput("");
		if (markovSourceOptions.sourceText !== null)
		{
			setCurrentStep(2);
		}
		var chainSizeElement = win.document.querySelector(CONST_MK_CHAINSIZE);
		markovSourceOptions.chainSize = chainSizeElement.value;		
		var chainSizeDescription = "";
		switch (markovSourceOptions.chainSize) {
			case "1":
				chainSizeDescription = "rather nonsensical";
				break;
			case "2":
				chainSizeDescription = "somewhat nonsensical";
				break;
			case "3":
				chainSizeDescription = "somewhat sensible";
				break;
			case "4":
				chainSizeDescription = "mostly sensible";
				break;
		}
		var selectedChainSizeElement = win.document.querySelector(CONST_MK_SELECTED_CHAINSIZE);
		selectedChainSizeElement.textContent = "(" + chainSizeDescription + ")";
	}
	
	function setNumberOfSentences(e) {
		var numSentencesElement = win.document.querySelector(CONST_MK_NUMSENTENCES);
		markovOutputOptions.numberOfSentences = numSentencesElement.value;
		var selectedNumSentencesElement = win.document.querySelector(CONST_MK_SELECTED_NUMSENTENCES);
		selectedNumSentencesElement.textContent = "(" + markovOutputOptions.numberOfSentences + ")";
	}

	function setWords(source) {
		markovSourceOptions.wordSet = null;
		markovSourceOptions.dict = null;
		setOutput("");
		setChainSize(null);
		var dictStatus = win.document.querySelector(".dictStatus");
		dictStatus.textContent = "Building...";
		var text = source.replace(/[\r\n]/gi, ' ');
		var el = win.document.querySelector("#source");
		markovSourceOptions.wordSet = markovWordsetBuilder.addWords(text, ' ');
		var dictionaryWorker = new Worker("js/markovDictionaryWorker.js");
		dictionaryWorker.onmessage = function(e) {
			if (typeof(e.data.dict) !== 'undefined') {
				markovSourceOptions.dict = e.data.dict;
				setCurrentStep(3);
				dictStatus.textContent = "";
			}
			if (typeof(e.data.error) !== 'undefined') {
				dictStatus.textContent = "Build failed!";
				alert("Sorry, I couldn't build that dictionary (" + e.data.error + ")");
			}
			dictionaryWorker.terminate();
		}

		dictionaryWorker.postMessage({
			'wordSet' : markovSourceOptions.wordSet,
			'chainSize' : markovSourceOptions.chainSize});
	}
	
	function setOutput(text) {
		var output = win.document.querySelector(CONST_MK_OUTPUT);
		output.textContent = text;
	}

	function buildSentence() {
		var sentences = markovGenerator.generateSentences(markovSourceOptions.dict, markovOutputOptions);
		setOutput(sentences);
	} 

	function bind() {

		// bind change event to file input
		win.document.querySelector(CONST_MK_INPUT)
			.addEventListener("change", function(e) { readFile(e); });
		
		// bind change event to chain size selection
		win.document.querySelector(CONST_MK_CHAINSIZE)
			.addEventListener("input", function(e) { setChainSize(e); });
		
		// bind click event to build dictionary button
		win.document.querySelector(CONST_MK_LOAD)
			.addEventListener("click", function(e) { setWords(markovSourceOptions.sourceText); });

		// bind change event to number of sentences selection 
		win.document.querySelector(CONST_MK_NUMSENTENCES)
			.addEventListener("input", function(e) { setNumberOfSentences(e); });
		
		// bind click event to generate sentence button	
		win.document.querySelector(CONST_MK_SUBMIT)
			.addEventListener("click", function(e) { buildSentence(); });
	}

	function init() {
		setCurrentStep(1);
		readFile(null); // detect any file already set even if the change event hasn't fired
		setChainSize();
		setNumberOfSentences();
	}

	bind();
	init();

})(this, logger);