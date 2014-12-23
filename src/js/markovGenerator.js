'use strict';

var markovGenerator = (function() {
	
	function getDictItemByKey(dict, key) {
		for (var i = 0, len = dict.length; i < len; i++) {
			if (dict[i].key === key) return dict[i];
		}
		return null;
	}
	
	function getRandomWords(dict, regex) {
		// grab words from dict at random
		var rWords = dict[Math.floor(Math.random() * dict.length)].words;
		
		// if a regex was not supplied, we're done. Return the selected words
		if (regex === null || typeof(regex) === 'undefined') return rWords;
		
		// otherwise, iterate until the regex is matched or we opt to give up
		var iteration = 0, maxIterations = dict.length;
		while (iteration <= maxIterations) {
			iteration++;
			if (regex.test(rWords[0])) return rWords;
			rWords = dict[Math.floor(Math.random() * dict.length)].words;
		}
		return rWords;
	}
	
	function getNextWord(words, dict, opts) {
		var randomNextWord = null;
		// get the last N words off the words array
		var lastWords = words.slice(-1 * dict[0].words.length);
		// get dict item with matching words. 
		var match = getDictItemByKey(dict, lastWords.join('/').toLowerCase());
		// if match is null, we've hit a word with nothing to follow. Close it out.
		if (match !== null)
		{
			// get a random word from the "next" property on dict item. 
			var randomNextWord = match.next[Math.floor(Math.random() * match.next.length)];
			if (typeof(randomNextWord) === 'undefined') randomNextWord = null;
		}
		return randomNextWord;
	}
	
	function setOptions(dict, opts) {
		if (opts === null || typeof(opts) === 'undefined') opts = {};
		// determine chainSize from dictionary
		var chainSize = dict[0].words.length;
		// if numberOfSentences is not provided, assume 1
		if (typeof(opts.numberOfSentences) === 'undefined') opts.numberOfSentences = 1;
		// make sure EOS is set
		if (typeof(opts.endOfSentenceRegex) === 'undefined') opts.endOfSentenceRegex = /[!?.]$/;
		return opts;
	}
	
	function generateSentence(dict, opts, iteration) {
		// ensure we don't infinitely recurse
		if (typeof(iteration) === 'undefined') iteration = 0;
		iteration++;
		if (iteration > 50) {
			throw "maximum iterations exceeded while trying to generate a sentence";
		}
		
		// select random words to use as a seed for the sentence
		var words = getRandomWords(dict, opts.seedPattern).slice();
		
		// build the rest of the sentence
		var runonLength = 50; // number of words in a single sentence
		while (words.length < runonLength) {
			var nextWord = getNextWord(words, dict, opts);
			// break loop if no next word available 
			if (nextWord === null) break;
			// add the word to the sentence
			words.push(nextWord);
			// break loop if we've ended in EOS punctuation
			if (opts.endOfSentenceRegex.test(nextWord)) break;
		}
		
		var sentence = words.join(" ");
		
		return sentence;
	}
	
	function generateSentences(dict, opts)
	{
		// ensure dictionary was provided
		if (dict === null || typeof(dict) === 'undefined') {
			throw "dictionary must be provided";
		}
		// set opts to good values
		opts = setOptions(dict, opts);
		// generate sentences
		var sentences = [];
		var cnt = 0;
		while (cnt < opts.numberOfSentences)
		{
			sentences.push(generateSentence(dict, opts));
			cnt++;
		}
		return sentences.join(" ");
	}

	return { 
		generateSentences : generateSentences,
		getRandomWords : getRandomWords };

})();
