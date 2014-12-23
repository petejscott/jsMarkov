'use strict';

var markovWordsetBuilder = (function() {

	var max_words = 80000;

	function stripChars(word) {
		return word.replace(/[^\w\s\.\!\?\'\,\—\-]/gi, '');
	}

	function addWords(words, delimiter) {
		var wordSet = [];

		var aw = words.split(delimiter);
		var len = aw.length;
		if (len > max_words) len = max_words;
		console.log("adding words (max of " + len + ")");

		for (var i = 0; i < len; i++) {
			var word = stripChars(aw[i]);
			if (word.length > 0) wordSet.push(word);
		}
		return wordSet;
	}

	return { addWords : addWords } 

})();
