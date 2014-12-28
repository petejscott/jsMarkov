'use strict';

var markovWordsetBuilder = (function(logger) {

	var wordSet = [];
	
	//TODO: consider making this function a source option and passing it in to addWords()
	function transformWord(word) {
		word = word.replace("Mr.", "Mr");
		word = word.replace("Mrs.", "Mrs");
		return word.replace(/[^A-Za-z0-9\s\.\!\?\'\,\—\-]/gi, '');	
	}
	
	function clearWords() {
		wordSet = [];
	}

	function addWords(words, delimiter) {
		
		var aw = words.split(delimiter);
		var len = aw.length;
		
		var wordsIncluded = 0;
		for (var i = 0; i < len; i++) {
			var word = transformWord(aw[i]);
			if (word.length > 0) {
				wordSet.push(word);
				wordsIncluded++;
			}
		}
		
		logger.logDebug("added " + wordsIncluded + " out of " + len + " words to wordSet");
		return wordSet;
	}

	return { 
		addWords : addWords, 
		clearWords : clearWords } ;
	
})(logger);
