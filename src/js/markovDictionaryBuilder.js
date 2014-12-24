'use strict';

var markovDictionaryBuilder = (function() {

	function buildDict(wordSet, chainSize) {

		console.log("building dictionary from " + wordSet.length + " words with a chain size of " + chainSize);

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
			
			//TODO: cheap hack to prevent keywords (e.g. "every") from being parsed as native code (e.g. function)
			// revisit this issue, because this is bloody stupid.
			var mapKey = "*" + dictItem.key;
			
			var mi = map[mapKey];
			if (typeof(mi) === 'undefined') {
				var dictIndex = dict.length;
				dict.push(dictItem);
				map[mapKey] = dictIndex;
			} else {
				dict[mi].next.push(dictItem.next[0]);
			}
		}
		return dict;
	}

	return { 
		buildDict : buildDict
	};

})();