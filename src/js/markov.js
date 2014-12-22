'use strict';

; (function(win) {
    
  var chainSize = 2;
  
  var CONST_MK_INPUT = "#markovFile";
  var CONST_MK_LOAD = "#markovLoad";
  var CONST_MK_SUBMIT = "#markovSubmit";
  var CONST_MK_OUTPUT = "#markovOutput";
  
  var sourceText = null;
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
  
  function setWords(source) {
    
	var text = source.replace(/[\r\n]/gi, ' ');
	var el = win.document.querySelector("#source");
	wordSet = markovWordsetBuilder.addWords(text, ' ');
	
	var dictionaryWorker = new Worker("js/markovDictionaryWorker.js");
	dictionaryWorker.onmessage = function(e) {
      dict = e.data.dict;
      enableStep(3);
	  dictionaryWorker.terminate();
    }
	
	dictionaryWorker.postMessage({
		'wordSet' : wordSet,
		'chainSize' : chainSize});
	
	// win.setTimeout(function() {
	  // var text = source.replace(/[\r\n]/gi, ' ');
	  // var el = win.document.querySelector("#source");
	  // wordSet = markovWordsetBuilder.addWords(text, ' ');
	  // dict = markovDictionaryBuilder.buildDict(wordSet, chainSize);	  
	  // enableStep(3);
	// }, 0);
  }
  
  function buildSentence(dict, wordSet, chainSize) {
	var sentence = markovGenerator.generateSentence(dict, wordSet, chainSize);
	var output = win.document.querySelector(CONST_MK_OUTPUT);
	output.textContent = sentence;
  } 
  
  function bind() {
	
	// bind change event to file input
	var wordFile = win.document.querySelector(CONST_MK_INPUT);
	wordFile.addEventListener("change", function(e) { readFile(e); });
	
	// bind click event to build dictionary button
	var wordFile = win.document.querySelector(CONST_MK_LOAD);
	wordFile.addEventListener("click", function(e) { setWords(sourceText); });
	
	// bind click event to generate sentence button	
    var wordSubmit = win.document.querySelector(CONST_MK_SUBMIT);
	wordSubmit.addEventListener("click", function(e) { buildSentence(dict, wordSet, chainSize); });
	
  }
  
  function init() {
	disableStep(2);
	disableStep(3);
	readFile(null); // detect any file already set even if the change event hasn't fired
  }
  
  bind();
  init();

  
})(this);