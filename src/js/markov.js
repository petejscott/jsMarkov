'use strict';

; (function(win, logger, UI) {

	var uiElements = {
		sourceFileInput : "#markovFile",
		chainSizeInput : "#markovChainSize",
		chainSizeOutput : "#selectedChainSize",
		buildDictionaryButton : "#markovLoad",
		sentenceCountInput : "#markovNumberOfSentences",
		sentenceCountOutput : "#selectedNumberOfSentences",
		generateSentenceButton : "#markovSubmit",
		generateSentenceOutput : "#markovOutput"
	};

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


	//TODO: ugh. just ugh. tidy up the "reset" of sourceoptions, and make getting the file 
	// cleaner, and add some bloody error handling beyond "return;"
	function readFile(e) {
		markovSourceOptions.sourceText = null;
		markovSourceOptions.wordSet = null;
		markovSourceOptions.dict = null;
		setOutput("");
		var files = win.document.querySelector(uiElements.sourceFileInput).files;
		if (files === null || files.length === 0) return;
		var file = files[0];
		var reader = new FileReader();
		reader.onload = function(e) {
			markovSourceOptions.sourceText = e.target.result;
			UI.workflow.setCurrentStep(2);
		};
		reader.readAsText(file);
	} 
	//TODO: too many complaints to enumerate.
	function setChainSize(e) {	
		markovSourceOptions.wordSet = null;
		markovSourceOptions.dict = null;
		setOutput("");
		if (markovSourceOptions.sourceText !== null)
		{
			UI.workflow.setCurrentStep(2);
		}
		var chainSizeElement = win.document.querySelector(uiElements.chainSizeInput);
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
		var selectedChainSizeElement = win.document.querySelector(uiElements.chainSizeOutput);
		selectedChainSizeElement.textContent = "(" + chainSizeDescription + ")";
	}
	//TODO: this silly thing shouldn't even be necessary. Maybe abstract range handling somehow.
	function setNumberOfSentences(e) {
		var numSentencesElement = win.document.querySelector(uiElements.sentenceCountInput);
		markovOutputOptions.numberOfSentences = numSentencesElement.value;
		var selectedNumSentencesElement = win.document.querySelector(uiElements.sentenceCountOutput);
		selectedNumSentencesElement.textContent = "(" + markovOutputOptions.numberOfSentences + ")";
	}
	//TODO: big pile of ugly.
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
				UI.workflow.setCurrentStep(3);
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
	//TODO: bad function name. and probably a bit of overkill, making this its own function
	function setOutput(text) {
		var output = win.document.querySelector(uiElements.generateSentenceOutput);
		output.textContent = text;
	}
	//TODO again, not seeing a need for a function here (except for keeping "bind" clean).
	function buildSentence() {
		var sentences = markovGenerator.generateSentences(markovSourceOptions.dict, markovOutputOptions);
		setOutput(sentences);
	} 

	function bind() {

		// bind change event to file input
		win.document.querySelector(uiElements.sourceFileInput)
			.addEventListener("change", readFile);
		
		// bind change event to chain size selection
		win.document.querySelector(uiElements.chainSizeInput)
			.addEventListener("input", setChainSize);
		
		// bind click event to build dictionary button
		win.document.querySelector(uiElements.buildDictionaryButton)
			.addEventListener("click", function(e) { setWords(markovSourceOptions.sourceText); });

		// bind change event to number of sentences selection 
		win.document.querySelector(uiElements.sentenceCountInput)
			.addEventListener("input", setNumberOfSentences);
		
		// bind click event to generate sentence button	
		win.document.querySelector(uiElements.generateSentenceButton)
			.addEventListener("click", buildSentence);
	}

	//TODO: not sure what to do about this, but I'm sure something will occur to me by the time 
	// everything else is done.
	function init() {
		UI.workflow.setCurrentStep(1);
		readFile(null); // detect any file already set even if the change event hasn't fired
		setChainSize();
		setNumberOfSentences();
	}

	bind();
	init();

})(this, logger, UI);