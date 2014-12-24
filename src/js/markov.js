'use strict';

; (function(win) {

	var CONST_MK_INPUT = "#markovFile";
	var CONST_MK_CHAINSIZE = "#markovChainSize";
	var CONST_MK_SELECTED_CHAINSIZE = "#selectedChainSize";
	var CONST_MK_LOAD = "#markovLoad";
	var CONST_MK_SUBMIT = "#markovSubmit";
	var CONST_MK_OUTPUT = "#markovOutput";
	var CONST_MK_NUMSENTENCES = "#markovNumberOfSentences";
	var CONST_MK_SELECTED_NUMSENTENCES = "#selectedNumberOfSentences";

	var sourceText = null;
	var chainSize = 0;
	var numberOfSentences = 1;
	var dict = null;
	var wordSet = null;

	function disableStep(step) {
		var element = win.document.querySelector("[data-step='"+step+"']");
		if (element === null) return;
		element.classList.remove("enabled");
		element.classList.add("disabled");
		var inputs = element.querySelectorAll("input");
		for (var i = 0, len = inputs.length; i < len; i++) {
			inputs[i].disabled = true;
		}
	}
	function enableStep(step) {
		var element = win.document.querySelector("[data-step='"+step+"']");
		if (element === null) return;
		element.classList.remove("disabled");
		element.classList.add("enabled");
		var inputs = element.querySelectorAll("input");
		for (var i = 0, len = inputs.length; i < len; i++) {
			inputs[i].disabled = false;
		}
	}

	function readFile(e) {
		sourceText = null;
		wordSet = null;
		dict = null;
		setOutput("");
		var files = win.document.querySelector(CONST_MK_INPUT).files;
		if (files === null || files.length === 0) return;
		var file = files[0];
		var reader = new FileReader();
		reader.onload = function(e) {
			sourceText = e.target.result;
			enableStep(2);
			disableStep(3);
		};
		reader.readAsText(file);
	} 
	
	function setChainSize(e) {	
		wordSet = null;
		dict = null;
		setOutput("");
		disableStep(3);
		var chainSizeElement = win.document.querySelector(CONST_MK_CHAINSIZE);
		chainSize = chainSizeElement.value;		
		var chainSizeDescription = "";
		switch (chainSize) {
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
		numberOfSentences = numSentencesElement.value;
		var selectedNumSentencesElement = win.document.querySelector(CONST_MK_SELECTED_NUMSENTENCES);
		selectedNumSentencesElement.textContent = "(" + numberOfSentences + ")";
	}

	function setWords(source) {
		wordSet = null;
		dict = null;
		setOutput("");
		setChainSize(null);
		var dictStatus = win.document.querySelector(".dictStatus");
		dictStatus.textContent = "Building...";
		var text = source.replace(/[\r\n]/gi, ' ');
		var el = win.document.querySelector("#source");
		wordSet = markovWordsetBuilder.addWords(text, ' ');
		var dictionaryWorker = new Worker("js/markovDictionaryWorker.js");
		dictionaryWorker.onmessage = function(e) {
			if (typeof(e.data.dict) !== 'undefined') {
				dict = e.data.dict;
				enableStep(3);
				dictStatus.textContent = "";
			}
			if (typeof(e.data.error) !== 'undefined') {
				dictStatus.textContent = "Build failed!";
				alert("Sorry, I couldn't build that dictionary (" + e.data.error + ")");
			}
			dictionaryWorker.terminate();
		}

		dictionaryWorker.postMessage({
			'wordSet' : wordSet,
			'chainSize' : chainSize});
	}
	
	function setOutput(text) {
		var output = win.document.querySelector(CONST_MK_OUTPUT);
		output.textContent = text;
	}

	function buildSentence() {
		var opts = {
			'seedPattern' : /[A-Z]/,
			'numberOfSentences' : numberOfSentences
		};
		var sentences = markovGenerator.generateSentences(dict, opts);
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
			.addEventListener("click", function(e) { setWords(sourceText); });

		// bind change event to number of sentences selection
		win.document.querySelector(CONST_MK_NUMSENTENCES)
			.addEventListener("input", function(e) { setNumberOfSentences(e); });
		
		// bind click event to generate sentence button	
		win.document.querySelector(CONST_MK_SUBMIT)
			.addEventListener("click", function(e) { buildSentence(); });
	}

	function init() {
		disableStep(2);
		disableStep(3);
		readFile(null); // detect any file already set even if the change event hasn't fired
		setChainSize();
		setNumberOfSentences();
	}

	bind();
	init();

})(this);