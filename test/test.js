var mString = "The cat in the hat with the bat is a gnat";
var mWordSet = mString.split(' ');

QUnit.test( "Build Dictionary - Chain Size 1", function( assert ) 
{	
	var chainSize = 1;
	var dict = markovDictionaryBuilder.buildDict(mWordSet, chainSize);
	var dictSize = 8;
	assert.ok( dict.length === dictSize , "Dictionary size is " + dict.length + ", expected " + dictSize );
	assert.ok( dict[0].words.length === chainSize , "Dictionary words contains " + dict[0].words.length + " words, expected " + chainSize );
	
	var i = 0;
	assert.ok( dict[i].words.join("/") === "The" , "Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "cat/hat/bat" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );
	
	i = 1;
	assert.ok( dict[i].words.join("/") === "cat" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "in" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );	
	
	i = 2;
	assert.ok( dict[i].words.join("/") === "in" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "the" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );
	
	i = 3;
	assert.ok( dict[i].words.join("/") === "hat" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "with" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );	
	
	i = 4;
	assert.ok( dict[i].words.join("/") === "with" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "the" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );	
	
	i = 5;
	assert.ok( dict[i].words.join("/") === "bat" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "is" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );
	
	i = 6;
	assert.ok( dict[i].words.join("/") === "is" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "a" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );
	
	i = 7;
	assert.ok( dict[i].words.join("/") === "a" ,"Dictionary item at index " + i + ": words property contains expected value" );
	assert.ok( dict[i].next.join("/") === "gnat" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );
	
});
QUnit.test( "Build Dictionary - Chain Size 2", function( assert ) 
{	
	var chainSize = 2;
	var dict = markovDictionaryBuilder.buildDict(mWordSet, chainSize);
	var dictSize = 9;
	assert.ok( dict.length === dictSize , "Dictionary size is " + dict.length + ", expected " + dictSize );
	assert.ok( dict[0].words.length === chainSize , "Dictionary words contains " + dict[0].words.length + " words, expected " + chainSize );
	
	var i = 0;
	assert.ok( dict[i].words.join("/") === "The/cat" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "in" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );
	
	i = 1;
	assert.ok( dict[i].words.join("/") === "cat/in" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "the" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );	
	
	i = 2;
	assert.ok( dict[i].words.join("/") === "in/the" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "hat" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );
	
	i = 3;
	assert.ok( dict[i].words.join("/") === "the/hat" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "with" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );
	
	i = 4;
	assert.ok( dict[i].words.join("/") === "hat/with" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "the" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );
	
	i = 5;
	assert.ok( dict[i].words.join("/") === "with/the" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "bat" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );
	
	i = 6;
	assert.ok( dict[i].words.join("/") === "the/bat" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "is" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );
	
	i = 7;
	assert.ok( dict[i].words.join("/") === "bat/is" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "a" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );
	
	i = 8;
	assert.ok( dict[i].words.join("/") === "is/a" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "gnat" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );
});
QUnit.test( "Build Dictionary - Chain Size 3", function( assert ) 
{	
	var chainSize = 3;
	var dict = markovDictionaryBuilder.buildDict(mWordSet, chainSize);
	var dictSize = 8;
	assert.ok( dict.length === dictSize , "Dictionary size is " + dict.length + ", expected " + dictSize );
	assert.ok( dict[0].words.length === chainSize , "Dictionary words contains " + dict[0].words.length + " words, expected " + chainSize );
	
	var i = 0;
	assert.ok( dict[i].words.join("/") === "The/cat/in" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "the" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );
	
	i = 1;
	assert.ok( dict[i].words.join("/") === "cat/in/the" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "hat" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );	
	
	i = 2;
	assert.ok( dict[i].words.join("/") === "in/the/hat" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "with" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );
	
	i = 3;
	assert.ok( dict[i].words.join("/") === "the/hat/with" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "the" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );
	
	i = 4;
	assert.ok( dict[i].words.join("/") === "hat/with/the" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "bat" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );
	
	i = 5;
	assert.ok( dict[i].words.join("/") === "with/the/bat" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "is" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );
	
	i = 6;
	assert.ok( dict[i].words.join("/") === "the/bat/is" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "a" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );
	
	i = 7;
	assert.ok( dict[i].words.join("/") === "bat/is/a" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "gnat" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );
});
QUnit.test( "Build Dictionary - Chain Size 4", function( assert ) 
{	
	var chainSize = 4;
	var dict = markovDictionaryBuilder.buildDict(mWordSet, chainSize);
	var dictSize = 7;
	assert.ok( dict.length === dictSize , "Dictionary size is " + dict.length + ", expected " + dictSize );
	assert.ok( dict[0].words.length === chainSize , "Dictionary words contains " + dict[0].words.length + " words, expected " + chainSize );
	
	var i = 0;
	assert.ok( dict[i].words.join("/") === "The/cat/in/the" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "hat" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );
	
	i = 1;
	assert.ok( dict[i].words.join("/") === "cat/in/the/hat" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "with" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );	
	
	i = 2;
	assert.ok( dict[i].words.join("/") === "in/the/hat/with" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "the" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );
	
	i = 3;
	assert.ok( dict[i].words.join("/") === "the/hat/with/the" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "bat" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );
	
	i = 4;
	assert.ok( dict[i].words.join("/") === "hat/with/the/bat" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "is" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );
	
	i = 5;
	assert.ok( dict[i].words.join("/") === "with/the/bat/is" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "a" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );
	
	i = 6;
	assert.ok( dict[i].words.join("/") === "the/bat/is/a" ,"Dictionary item at index " + i + ": words property value is " + dict[i].words.join("/") );
	assert.ok( dict[i].next.join("/") === "gnat" , "Dictionary item at index " + i + ": next property value is " + dict[i].next.join("/") );
});