if (typeof(importScripts) !== 'undefined') importScripts('markovDictionaryBuilder.js');

onmessage = function(e) {
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