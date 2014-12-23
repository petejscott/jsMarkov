'use strict';

var markovDictionaryBuilder = (function() {
  
	function buildDict(wordSet, chainSize) {
		console.log("building dictionary from " + wordSet.length + " words with a chain size of " + chainSize);

		var dict = [];
		for (var i = 0, len = wordSet.length - chainSize; i < len; i++) {
			
			var end = i + parseFloat(chainSize);
			var k = wordSet.slice(i, end);
			var n = [wordSet[end]];
			
			var dictItem = {
				'key' : k.join('/').toLowerCase(),
				'words' : k,
				'next' : n
			};
			
			var match = getDictItemByKey(dict, dictItem.key);
		  
			if (match !== null) {
				var index = dict.indexOf(match);
				dict[index].next.push(dictItem.next[0]);
			} else {
				dict.push(dictItem);
			}
		}
		//console.log(dict);
		return dict;
	}

	function getDictItemByKey(dict, key) {
		for (var i = 0, len = dict.length; i < len; i++) {
			if (dict[i].key === key) return dict[i];
		}
		return null;
	}

	return { buildDict : buildDict  };

})();