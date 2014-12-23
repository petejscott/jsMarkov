'use strict';

var markovGenerator = (function() {

	var EOS = /[!?.]/;
	
	function getDictItemByKey(dict, key) {
		for (var i = 0, len = dict.length; i < len; i++) {
			if (dict[i].key === key) return dict[i];
		}
		return null;
	}
	
	function getSeed(dict, chainSize) {
		// find a seed that starts with a capital letter
		var seed = [];
		var seedAttempt = 0;
		while (true) {
			seedAttempt++;
			var seed = dict[Math.floor(Math.random() * dict.length)].words;
			var firstChar = seed[0].charAt(0);
			if (firstChar === firstChar.toUpperCase()) {
				break;
			}
			// too many loops, just use this one and move on.
			// TODO: I'd like to do something more intelligent here.
			if (seedAttempt > 20) {
				break;
			}
		}
		return seed;
	}
	
	function getWords(words, dict, chainSize) {
		while (true) {
			var last_words = words.slice(-1 * chainSize);
			var match = getDictItemByKey(dict, last_words.join('/').toLowerCase());
			if (match === null) break;
			var next_opts = match.next;
			var rand_next = next_opts[Math.floor(Math.random() * next_opts.length)];
			if (typeof(rand_next) === 'undefined') break;
			words.push(rand_next);
			if (EOS.test(rand_next)) break;
		}
		return words;
	}

	function generateSentence(dict, chainSize) {
		console.log("generating sentence");
		var seed = getSeed(dict, chainSize);
		var generatedWords = getWords(seed, dict, chainSize);
		var sentence = generatedWords.join(' ');
		if (EOS.test(sentence) === false) {
			sentence = sentence + "."; // append a . to finish it
		}
		return sentence;
	}

	return { generateSentence : generateSentence }

})();
