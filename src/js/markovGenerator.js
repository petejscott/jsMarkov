'use strict';

var markovGenerator = (function() {

  var EOS = [ "." , "?", "!" ];
  var min_sentence_words = 5;
  var max_sentence_words = 30;
  
  function getDictItemByKey(dict, key) {
    for (var i = 0, len = dict.length; i < len; i++) {
      if (dict[i].key === key) return dict[i];
    }
    return null;
  }
  
  function generateSentence(dict, wordSet, chainSize) {
    
    console.log("generating sentence");
	
    var wordSize = wordSet.length;
    
    // find a seed that starts with a capital letter
	var seedAttempt = 0;
    while (true) {
      
      seedAttempt++;
	  var seedStart = Math.floor(Math.random() * wordSize);
	  var seedEnd = parseFloat(seedStart) + parseFloat(chainSize);
	  var seed = wordSet.slice(seedStart, seedEnd);
	  
      var firstChar = seed[0].charAt(0);
      if (firstChar === firstChar.toUpperCase())
      {
        var generatedWords = seed;
        break;
      }
	  
	  // too many loops, just use this one and move on.
	  if (seedAttempt > 20)
	  {
		var generatedWords = seed;
		break;
	  }
    }
    
	while (true) {
	  var last_words = generatedWords.slice(-1 * chainSize);
	  var match = getDictItemByKey(dict, last_words.join('/'));
      
      if (match === null) break;

      var next_opts = match.next;
      var rand_next = next_opts[Math.floor(Math.random() * next_opts.length)];
      
      if (typeof(rand_next) === 'undefined') break;
      
      generatedWords.push(rand_next);
      if (isFinalCharEOS(rand_next)) break;
	  
	}
    
    var sentence = generatedWords.join(' ');
    
    var wordCount= generatedWords.length;
    if (wordCount < min_sentence_words || wordCount > max_sentence_words) {
        sentence = generateSentence(dict, wordSet, chainSize);
    }
    
    if (!isFinalCharEOS(sentence)) {
      sentence = sentence + "."; // append a . to finish it
    }
    return sentence;
  }
  
  function isFinalCharEOS(str) {
    var final_char = str.charAt(str.length - 1); 
    if (EOS.indexOf(final_char) > -1) {
      return true;
    }
    return false;
  }
  
  return { generateSentence : generateSentence }

})();
