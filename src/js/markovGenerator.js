'use strict';

var markovGenerator = (function(logger) {
	
	var map = null;
	
	function getDictItemByKey(dict, key) {
		var mi = dict.map[key];
		var match = null;
		if (typeof(mi) !== 'undefined') {
			match = dict.items[mi];
		}
		return match;
	}
	
	function getRandomWords(dict, regex) {
		// grab words from dict at random
		var rWords = dict.items[Math.floor(Math.random() * dict.items.length)].words;
		
		// if a regex was not supplied, we're done. Return the selected words
		if (regex === null || typeof(regex) === 'undefined') return rWords;
		
		// otherwise, iterate until the regex is matched or we opt to give up
		var iteration = 0, maxIterations = dict.items.length;
		while (iteration <= maxIterations) {
			iteration++;
			if (regex.test(rWords[0])) return rWords;
			rWords = dict.items[Math.floor(Math.random() * dict.items.length)].words;
		}
		return rWords;
	}
	
	function getNextWord(words, dict, opts) {
		var randomNextWord = null;
		// get the last N words off the words array
		var lastWords = words.slice(-1 * dict.items[0].words.length);
		// get dict item with matching words. 
		var key = lastWords.join('/').toLowerCase();
		var match = getDictItemByKey(dict, key);
		// if match is null, we've hit a word with nothing to follow. Close it out.
		// TODO: not sure this is even still possible. can the map ever have undefined values?
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
		
		opts.numberOfSentences = (typeof(opts.numberOfSentences) === 'undefined') 
			? 1 : opts.numberOfSentences;
		opts.endOfSentenceRegex = (typeof(opts.endOfSentenceRegex) === 'undefined') 
			?  /[!?.]$/ : opts.endOfSentenceRegex;
		opts.maxWordsPerSentence = (typeof(opts.maxWordsPerSentence) === 'undefined') 
			?  50 : opts.maxWordsPerSentence;
			
		return opts;
	}
	
	function generateSentence(dict, opts, iteration) {
		// ensure we don't infinitely recurse
		if (typeof(iteration) === 'undefined') iteration = 0;
		iteration++;
		if (iteration > 50) {
			logger.logWarning("maximum iterations exceeded while trying to generate a sentence");
			return ""; //return an empty sentence
		}
		
		// select random words to use as a seed for the sentence
		var words = [];
		while (true) {
			// loop until we find one that doesn't have words meeting the endOfSentenceRegex
			words = getRandomWords(dict, opts.seedPattern).slice();
			if (opts.endOfSentenceRegex.test(words[0]) === false && 
				opts.endOfSentenceRegex.test(words[1]) === false) {
					break;
				}
		}
		
		// build the rest of the sentence
		while (words.length < opts.maxWordsPerSentence) {
			var nextWord = getNextWord(words, dict, opts);
			// break loop if no next word available 
			if (nextWord === null) break;
			// add the word to the sentence
			words.push(nextWord);
			// break loop if we've ended in EOS punctuation
			if (opts.endOfSentenceRegex.test(nextWord)) {
				break;
			}
		}
		
		var sentence = words.join(" ");
		
		// if sentence does not end with punctuation, add ellipsis
		if (opts.endOfSentenceRegex.test(sentence) === false) {
			sentence += "...";
		}
		
		return sentence;
	}
	
	function generateSentences(dict, opts) {
		// ensure dictionary was provided
		if (dict === null || typeof(dict) === 'undefined') {
			throw "dictionary must be provided";
		}
		
		// set opts to good values
		opts = setOptions(dict, opts);
		// generate sentences
		var sentences = [];
		var cnt = 0;
		while (cnt < opts.numberOfSentences) {
			var sentence = generateSentence(dict, opts);
			if (sentence.length > 1) {
				sentences.push(sentence);
				cnt++;
			}
		}
		return sentences.join(" ");
	}

	return { 
		generateSentences : generateSentences,
		getRandomWords : getRandomWords };

})(logger);
