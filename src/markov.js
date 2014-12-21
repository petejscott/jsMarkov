'use strict';

; (function(win) {
    
  var chainSize = 2;
  
  var CONST_MK_INPUT = "#markovFile";
  var CONST_MK_LOAD = "#markovLoad";
  var CONST_MK_SUBMIT = "#markovSubmit";
  var CONST_MK_OUTPUT = "#markovOutput";
  
  var dict = null;
  var wordSet = null;
  
  function getFiles() {
	var wordFile = win.document.querySelector(CONST_MK_INPUT);
	return wordFile.files;
  }
  
  function readFile(e) {
	var files = getFiles();
	if (files.length === 0) {
	  var output = win.document.querySelector(CONST_MK_OUTPUT);
	  output.textContent = "Select a file first!";
	  return;
	};
	var file = files[0];
	var reader = new FileReader();
	reader.onload = onFileLoad;
	reader.readAsText(file);
  }
  
  function onFileLoad(e) {
	var sourceData = e.target.result;
	setWords(sourceData);
  }
  
  function bind() {
	var wordFile = win.document.querySelector(CONST_MK_LOAD);
	wordFile.addEventListener("click", function(e) { readFile(e); });
  }
  
  function setWords(source) {
	
	var output = win.document.querySelector(CONST_MK_OUTPUT);
	output.textContent = "Building dictionary... (this might take a while)";
	
	win.setTimeout(function() {
	  var text = source.replace(/[\r\n]/gi, ' ');
	  var el = win.document.querySelector("#source");
	  var wordSet = markovWordsetBuilder.addWords(text, ' ');
	  var dict = markovDictionaryBuilder.buildDict(wordSet, chainSize);
			  
	  var wordSubmit = win.document.querySelector(CONST_MK_SUBMIT);
	  wordSubmit.addEventListener("click", function(e) { buildSentence(dict, wordSet, chainSize); });
	  wordSubmit.classList.remove("hidden");
	  
	  output.textContent = "Ready!";
	}, 0);
  }
  
  function buildSentence(dict, wordSet, chainSize) {
	var sentence = markovGenerator.generateSentence(dict, wordSet, chainSize);
	var output = win.document.querySelector(CONST_MK_OUTPUT);
	output.textContent = sentence;
  }
  
  function init() {
  }
  
  bind();
  init();

  
})(this);