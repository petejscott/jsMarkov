'use strict';

; (function(win, logger) {
	
	var uiElements = {
		sourceFileInput : "#markovFile",
		chainSizeInput : "#markovChainSize",
		chainSizeOutput : "#selectedChainSize",
		sentenceCountInput : "#markovNumberOfSentences",
		sentenceCountOutput : "#selectedNumberOfSentences",
		generateSentenceButton : "#markovGenerate",
		generateSentenceOutput : "#markovOutput"
	};

	var markovSourceOptions = {
		wordSet : null,
		chainSize : 1,
		dict : null,
		dictBuilder : null,
		buildingDictionary : false
	};
	Object.preventExtensions(markovSourceOptions);
	
	var markovOutputOptions = {
		seedPattern : /[A-Z]/,
		endOfSentenceRegex : /[!?.]$/,
		maxWordsPerSentence : 50,
		numberOfSentences : 1
	};
	Object.preventExtensions(markovOutputOptions);
	
	function readFile(callback) {
		var files = win.document.querySelector(uiElements.sourceFileInput).files;
		if (files === null || files.length === 0) return;
		var file = files[0];
		var reader = new FileReader();
		reader.onload = function(e) {
			var text = e.target.result.replace(/[\r\n]/gi, ' ');
			markovSourceOptions.wordSet = markovWordsetBuilder.addWords(text, ' ');
			callback();
		};
		reader.readAsText(file);
	}
	
	function buildDictionary() {
		if (markovSourceOptions.wordSet === null) {
			readFile(function() { buildDictionary() });
			return;
		}
		markovSourceOptions.buildingDictionary = true;
		setOutput("Building dictionary...");
		if (markovSourceOptions.dictBuilder === null || typeof(markovSourceOptions.dictBuilder) === 'undefined') {
			console.log("creating dictionary worker");
			markovSourceOptions.dictBuilder = new Worker("js/markovDictionaryWorker.js");
		}
		
		markovSourceOptions.dictBuilder.onmessage = function(e) {
			markovSourceOptions.buildingDictionary = false;
			logger.logDebug("received a response from the dictBuilder");
			if (typeof(e.data.dict) !== 'undefined') {
				markovSourceOptions.dict = e.data.dict;
				buildSentences();
			}
			else if (typeof(e.data.error) !== 'undefined') {
				setOutput("Sorry, I couldn't build that dictionary (" + e.data.error + ")");
			}
		}

		markovSourceOptions.dictBuilder.postMessage({
			'wordSet' : markovSourceOptions.wordSet,
			'chainSize' : markovSourceOptions.chainSize});
	}
	
	function buildSentences() {
		if (markovSourceOptions.dict === null) return;
		var sentences = markovGenerator.generateSentences(markovSourceOptions.dict, markovOutputOptions);
		setOutput(sentences, true);
	}

	function setOutput(text, showGenerateOption) {
		var output = win.document.querySelector(uiElements.generateSentenceOutput);
		output.textContent = text;
		if (showGenerateOption) { 
			win.document.querySelector(uiElements.generateSentenceButton).classList.remove("hidden");
		} else {
			win.document.querySelector(uiElements.generateSentenceButton).classList.add("hidden");
		}
	}

	
	function bind() {
	
		win.document.querySelector(uiElements.sourceFileInput)
			.addEventListener("change", function(e) { 
				markovSourceOptions.wordSet = null;
				buildDictionary();
			});
		
		win.document.querySelector(uiElements.chainSizeInput)
			.addEventListener("input", function(e) {
				setChainSizeDescription();
			});
			
		win.document.querySelector(uiElements.chainSizeInput)
			.addEventListener("change", function(e) { 
				var val = e.currentTarget.value;
				markovSourceOptions.chainSize = val;
				setChainSizeDescription();
				if (markovSourceOptions.buildingDictionary) {
					markovSourceOptions.dictBuilder.terminate();
					markovSourceOptions.dictBuilder = null;
					logger.logDebug("terminated and unset the dictBuilder");
				}
				buildDictionary();
			});
		
		win.document.querySelector(uiElements.sentenceCountInput)
			.addEventListener("input", function(e) {
				setSentenceCountDescription();
			});
			
		win.document.querySelector(uiElements.sentenceCountInput)
			.addEventListener("change", function(e) { 
				var val = e.currentTarget.value;
				markovOutputOptions.numberOfSentences = val;
				setSentenceCountDescription();
				buildSentences();
			});
		
		win.document.querySelector(uiElements.generateSentenceButton)
			.addEventListener("click", function(e) {
				buildSentences();
				e.preventDefault();
			});
	}
	
	function setChainSizeDescription()
	{
		var chainSize = win.document.querySelector(uiElements.chainSizeInput).value;
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
		var selectedChainSizeElement = win.document.querySelector(uiElements.chainSizeOutput);
		selectedChainSizeElement.textContent = "(" + chainSizeDescription + ")"; 
	}
	
	function setSentenceCountDescription()
	{
		var selectedNumSentencesElement = win.document.querySelector(uiElements.sentenceCountOutput);
		selectedNumSentencesElement.textContent = "(" + markovOutputOptions.numberOfSentences + ")";
	}
	
	function init() {
		
		// set the source/output options to match the values set in the DOM
		markovSourceOptions.chainSize = win.document.querySelector(uiElements.chainSizeInput).value;
		markovOutputOptions.numberOfSentences = win.document.querySelector(uiElements.sentenceCountInput).value;
		
		setSentenceCountDescription();
		setChainSizeDescription();
		
		bind();
		buildDictionary();
	}

	init();

})(this, logger);