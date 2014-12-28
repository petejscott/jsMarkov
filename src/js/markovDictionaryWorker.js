if (typeof(importScripts) !== 'undefined') {
	importScripts('logger.js');
	importScripts('markovDictionaryBuilder.js');
}

onmessage = function(e) {
	if (typeof(e.data.wordSet) !== 'undefined' && typeof(e.data.chainSize) !== 'undefined') {
		var wordSet = e.data.wordSet;
		var chainSize = e.data.chainSize;
		try {
			var dict = markovDictionaryBuilder.buildDict(wordSet, chainSize);
			postMessage({ 'dict' : dict });
		} catch(e) {
			var error = e.message;
			postMessage({ 'error' : error });
		}
	}
}