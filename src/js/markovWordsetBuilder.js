'use strict';

var markovWordsetBuilder = (function(logger) {

	var max_words = 80000;

	function transformWord(word) {
		word = word.replace("Mr.", "Mr");
		word = word.replace("Mrs.", "Mrs");
		return word.replace(/[^A-Za-z0-9\s\.\!\?\'\,\—\-]/gi, '');
	}

	function addWords(words, delimiter) {
		var wordSet = [];

		var aw = words.split(delimiter);
		var len = aw.length;
		if (len > max_words) len = max_words;
		logger.logInfo("adding words (max of " + len + ")");

		for (var i = 0; i < len; i++) {
			var word = transformWord(aw[i]);
			if (word.length > 0) wordSet.push(word);
		}
		return wordSet;
	}

	return { addWords : addWords } 
	
})(logger);
