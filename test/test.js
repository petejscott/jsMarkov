'use strict';

var mString = "The cat in the hat with the bat is a gnat";
var mWordSet = mString.split(' ');

QUnit.test( "Build Dictionary - Chain Size 1", function( assert ) 
{	
	var chainSize = 1;
	var dict = markovDictionaryBuilder.buildDict(mWordSet, chainSize);
	var items = dict.items;
	var dictSize = 8;
	assert.ok( items.length === dictSize , "Dictionary size is " + items.length + ", expected " + dictSize );
	assert.ok( items[0].words.length === chainSize , "Dictionary words contains " + items[0].words.length + " words, expected " + chainSize );
	
	var i = 0;
	assert.ok( items[i].words.join("/") === "The" , "Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "cat/hat/bat" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );
	
	i = 1;
	assert.ok( items[i].words.join("/") === "cat" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "in" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );	
	
	i = 2;
	assert.ok( items[i].words.join("/") === "in" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "the" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );
	
	i = 3;
	assert.ok( items[i].words.join("/") === "hat" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "with" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );	
	
	i = 4;
	assert.ok( items[i].words.join("/") === "with" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "the" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );	
	
	i = 5;
	assert.ok( items[i].words.join("/") === "bat" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "is" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );
	
	i = 6;
	assert.ok( items[i].words.join("/") === "is" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "a" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );
	
	i = 7;
	assert.ok( items[i].words.join("/") === "a" ,"Dictionary item at index " + i + ": words property contains expected value" );
	assert.ok( items[i].next.join("/") === "gnat" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );
	
});
QUnit.test( "Build Dictionary - Chain Size 2", function( assert ) 
{	
	var chainSize = 2;
	var dict = markovDictionaryBuilder.buildDict(mWordSet, chainSize);
	var items = dict.items;
	var dictSize = 9;
	assert.ok( items.length === dictSize , "Dictionary size is " + items.length + ", expected " + dictSize );
	assert.ok( items[0].words.length === chainSize , "Dictionary words contains " + items[0].words.length + " words, expected " + chainSize );
	
	var i = 0;
	assert.ok( items[i].words.join("/") === "The/cat" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "in" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );
	
	i = 1;
	assert.ok( items[i].words.join("/") === "cat/in" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "the" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );	
	
	i = 2;
	assert.ok( items[i].words.join("/") === "in/the" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "hat" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );
	
	i = 3;
	assert.ok( items[i].words.join("/") === "the/hat" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "with" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );
	
	i = 4;
	assert.ok( items[i].words.join("/") === "hat/with" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "the" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );
	
	i = 5;
	assert.ok( items[i].words.join("/") === "with/the" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "bat" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );
	
	i = 6;
	assert.ok( items[i].words.join("/") === "the/bat" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "is" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );
	
	i = 7;
	assert.ok( items[i].words.join("/") === "bat/is" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "a" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );
	
	i = 8;
	assert.ok( items[i].words.join("/") === "is/a" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "gnat" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );
});
QUnit.test( "Build Dictionary - Chain Size 3", function( assert ) 
{	
	var chainSize = 3;
	var dict = markovDictionaryBuilder.buildDict(mWordSet, chainSize);
	var items = dict.items;
	var dictSize = 8;
	assert.ok( items.length === dictSize , "Dictionary size is " + items.length + ", expected " + dictSize );
	assert.ok( items[0].words.length === chainSize , "Dictionary words contains " + items[0].words.length + " words, expected " + chainSize );
	
	var i = 0;
	assert.ok( items[i].words.join("/") === "The/cat/in" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "the" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );
	
	i = 1;
	assert.ok( items[i].words.join("/") === "cat/in/the" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "hat" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );	
	
	i = 2;
	assert.ok( items[i].words.join("/") === "in/the/hat" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "with" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );
	
	i = 3;
	assert.ok( items[i].words.join("/") === "the/hat/with" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "the" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );
	
	i = 4;
	assert.ok( items[i].words.join("/") === "hat/with/the" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "bat" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );
	
	i = 5;
	assert.ok( items[i].words.join("/") === "with/the/bat" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "is" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );
	
	i = 6;
	assert.ok( items[i].words.join("/") === "the/bat/is" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "a" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );
	
	i = 7;
	assert.ok( items[i].words.join("/") === "bat/is/a" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "gnat" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );
});
QUnit.test( "Build Dictionary - Chain Size 4", function( assert ) 
{	
	var chainSize = 4;
	var dict = markovDictionaryBuilder.buildDict(mWordSet, chainSize);
	var items = dict.items;
	var dictSize = 7;
	assert.ok( items.length === dictSize , "Dictionary size is " + items.length + ", expected " + dictSize );
	assert.ok( items[0].words.length === chainSize , "Dictionary words contains " + items[0].words.length + " words, expected " + chainSize );
	
	var i = 0;
	assert.ok( items[i].words.join("/") === "The/cat/in/the" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "hat" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );
	
	i = 1;
	assert.ok( items[i].words.join("/") === "cat/in/the/hat" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "with" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );	
	
	i = 2;
	assert.ok( items[i].words.join("/") === "in/the/hat/with" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "the" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );
	
	i = 3;
	assert.ok( items[i].words.join("/") === "the/hat/with/the" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "bat" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );
	
	i = 4;
	assert.ok( items[i].words.join("/") === "hat/with/the/bat" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "is" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );
	
	i = 5;
	assert.ok( items[i].words.join("/") === "with/the/bat/is" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "a" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );
	
	i = 6;
	assert.ok( items[i].words.join("/") === "the/bat/is/a" ,"Dictionary item at index " + i + ": words property value is " + items[i].words.join("/") );
	assert.ok( items[i].next.join("/") === "gnat" , "Dictionary item at index " + i + ": next property value is " + items[i].next.join("/") );
});
QUnit.test( "Generator - getRandomWords", function( assert ) 
{
	var chainSize = 2;
	var dict = markovDictionaryBuilder.buildDict(mWordSet, chainSize);
	
	var rWords = markovGenerator.getRandomWords(dict);
	assert.ok( rWords.length === chainSize , "getRandomWords word count matches chainSize" );
	
	var regexPassedWordSet = [ "The", "Cat", "In", "The", "Hat" ];
	var re = /[A-Z]/;
	var dict = markovDictionaryBuilder.buildDict(regexPassedWordSet, chainSize);
	var rWords = markovGenerator.getRandomWords(dict, re);
	assert.ok( re.test(rWords[0]) , "Provided RegExp succeeded" );
	
	var regexFailedWordSet = [ "the", "cat", "in", "the", "hat" ]; // after 50 attempts, we should get a result even if it doesn't match the expression
	var re = /[A-Z]/;
	var dict = markovDictionaryBuilder.buildDict(regexFailedWordSet, chainSize);
	var rWords = markovGenerator.getRandomWords(dict, re);
	assert.ok( re.test(rWords[0]) === false , "Provided RegExp failed (expected)" );
});
QUnit.test( "Generator - generateSentence with default options", function( assert )
{
	var chainSize = 2;
	var dict = markovDictionaryBuilder.buildDict(mWordSet, chainSize);
	
	var x = 0;
	while (x < 10) {
		x++;
		var sentence = markovGenerator.generateSentences(dict);
		assert.ok ( sentence.length > 1 );
	}
});