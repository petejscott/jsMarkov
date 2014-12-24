'use strict';

var markovDictionaryBuilder = (function(logger) {

	function buildDict(wordSet, chainSize) {

		logger.logInfo("building dictionary from " + wordSet.length + " words with a chain size of " + chainSize);
		
		var map = [];
		var dict = [];
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
			
			var mi = map[dictItem.key];
			if (typeof(mi) !== 'number') {
				var dictIndex = dict.length;
				dict.push(dictItem);
				map[dictItem.key] = dictIndex;
			} else {
				dict[mi].next.push(dictItem.next[0]);
			}
		}
		return dict;
	}

	return { 
		buildDict : buildDict
	};

})(logger);