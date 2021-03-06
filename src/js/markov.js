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
	
	//TODO: get those regexps tightened up
	var markovOutputOptions = {
		seedPattern : /^[A-Z].*[^"!.?']$/,
		sentenceRegex : /^[A-Z"'][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[!.?]['"]?(?=\s|$)/,
		maxWordsPerSentence : 50,
		numberOfSentences : 1
	};
	Object.preventExtensions(markovOutputOptions);
	
	function readFile(callback) {
		var fileElement = win.document.querySelector(uiElements.sourceFileInput);
		var files = fileElement.files;
		
		var processedCount=0;
		var totalFiles = files.length;
		
		for (var i = 0; i < totalFiles; i++) {
			var file = files[i];
			var reader = new FileReader();
			reader.onload = function(e) {
				var text = e.target.result.replace(/[\r\n]/gi, ' ');
				markovSourceOptions.wordSet = markovWordsetBuilder.addWords(text, ' ');
				logger.logDebug("added words for file " + i + " of " + totalFiles + " files. Wordset contains " + markovSourceOptions.wordSet.length + " words.");
			};
			reader.onloadend = function(e) {
				processedCount++;
				logger.logDebug("finished processing file " + processedCount + " of " + totalFiles);
				if (processedCount === totalFiles) callback();
			};
			reader.readAsText(file);
		}	
	}
	
	function buildDictionary() {
		if (markovSourceOptions.wordSet === null) {
			readFile(buildDictionary);
			return;
		}
		
		markovSourceOptions.buildingDictionary = true;
		setOutput("Building dictionary...");
		if (markovSourceOptions.dictBuilder === null || typeof(markovSourceOptions.dictBuilder) === 'undefined') {
			logger.logDebug("creating dictionary worker");
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
	
		var inputEvent = "input";
		
		// check for oninput support
		var el = document.createElement('input');
		el.setAttribute('oninput', '');
		if ('oninput' in el === false) {
			inputEvent = "change"; // use change instead
			logger.logDebug("using 'change' event instead of 'input' event.");
		}	
		
		win.document.querySelector(uiElements.sourceFileInput)
			.addEventListener("change", function(e) { 
				markovSourceOptions.wordSet = null;
				markovWordsetBuilder.clearWords();
				buildDictionary();
			});

		win.document.querySelector(uiElements.chainSizeInput)
			.addEventListener(inputEvent, function(e) {
				setChainSizeDescription(e.currentTarget.value);
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
			.addEventListener(inputEvent, function(e) {
				setSentenceCountDescription(e.currentTarget.value);
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
	
	function setChainSizeDescription(chainSize) {
		if (!chainSize) {
			chainSize = win.document.querySelector(uiElements.chainSizeInput).value;
		}
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
	
	function setSentenceCountDescription(numSentences) {
		if (!numSentences) {
			numSentences = win.document.querySelector(uiElements.sentenceCountInput).value;
		}
		var selectedNumSentencesElement = win.document.querySelector(uiElements.sentenceCountOutput);
		selectedNumSentencesElement.textContent = "(" + numSentences + ")";
	}
	
	function getUnsupportedFunctionality() {
		var unsupported = [];
		
		// check for web worker support
		if (typeof(win.Worker) === 'undefined') {
			unsupported.push("Web Worker");
		}

		// check for querySelector support
		if (!typeof(win.document.querySelector) === 'undefined') {
			unsupported.push("document.querySelector");
		}
		
		return unsupported;
	}
	
	function init() {
		
		// ensure client can be supported
		var unsupported = getUnsupportedFunctionality();
		if (unsupported.length > 0) {
			document.getElementsByTagName("main")[0].textContent = ("Sorry, your client lacks required functionality: " + unsupported.join(", "));
			return;
		}
		
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