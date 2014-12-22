'use strict';

var markovDictionaryBuilder = (function() {
  
  function getChains(wordSet, chainSize) {
    if (wordSet.length < chainSize) return;
    var chainSet = [];
    for (var start = 0, len = (wordSet.length - chainSize + 1); start < len; start++) { 
	  var end = parseFloat(start) + parseFloat(chainSize);
	  chainSet.push(wordSet.slice(start, end));
    }
    return chainSet;
  }
  
  function buildDict(wordSet, chainSize) {
    console.log("building dictionary from " + wordSet.length + " words with a chain size of " + chainSize);
    var chains = getChains(wordSet, chainSize);
	var dict = [];
	
    for (var i = 0, len = chains.length; i < len; i++) {
      var chainSet = chains[i];
      
      var dictItem = { 
        'key' : chainSet.join('/') , 
        'words' : chainSet, 
        'next' : [] };
      
	  var inc = chainSize - 1;
	  if (inc === 0) inc = 1;
      var nextIndex = parseFloat(i) + inc;
	  if (len > nextIndex) {
        dictItem.next.push(chains[nextIndex][1]);
      }
      
      var match = getDictItemByKey(dict, dictItem.key);
      
      if (match !== null) {
        var index = dict.indexOf(match);
        dict[index].next.push(dictItem.next[0]);
      } else {
        dict.push(dictItem);
      }
    }
	return dict;
  }
  
  function getDictItemByKey(dict, key) {
    for (var i = 0, len = dict.length; i < len; i++) {
      if (dict[i].key === key) return dict[i];
    }
    return null;
  }
  
  onmessage = function(e) {
    console.log('Message received from main script');
    var wordSet = e.data.wordSet;
	var chainSize = e.data.chainSize;
	buildDict(wordSet, chainSize);
	postMessage( { 'dict' : dict , 'wordSet' : wordSet });
  }

  return { 
	onmessage : onmessage ,
	buildDict : buildDict
	};

})();