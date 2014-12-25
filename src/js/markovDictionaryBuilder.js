'use strict';

var markovDictionaryBuilder = (function(logger) {

	function buildDict(wordSet, chainSize) {

		logger.logDebug("building dictionary from " + wordSet.length + " words with a chain size of " + chainSize);
		
		var dict = {};
		dict.map = {};
		dict.items = [];
		
		for (var i = 0, len = wordSet.length - chainSize; i < len; i++) {
			
			var end = i + parseFloat(chainSize); 
			var workingSet = wordSet.slice(i, end+1);
			var k = workingSet.slice(0, workingSet.length-1);
			var n = workingSet.slice(-1);
			
			var dictItem = {
				'key' : k.join('/').toLowerCase(),
				'words' : k,
				'next' : n
			};
			
			var mi = dict.map[dictItem.key];
			if (typeof(mi) !== 'number') {
				var dictIndex = dict.items.length;
				dict.items.push(dictItem);
				dict.map[dictItem.key] = dictIndex;
			} else {
				dict.items[mi].next.push(dictItem.next[0]);
			}
		}
		
		Object.freeze(dict.map);
		Object.freeze(dict.items);
		
		return dict;
	}

	return { 
		buildDict : buildDict
	};

})(logger);