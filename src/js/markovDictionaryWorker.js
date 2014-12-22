importScripts('markovDictionaryBuilder.js');

onmessage = function(e) {
  console.log('Message received from main script');
  
  var wordSet = e.data.wordSet;
  var chainSize = e.data.chainSize;
  
  var dict = markovDictionaryBuilder.buildDict(wordSet, chainSize);
  
  postMessage({ 'dict' : dict });
}