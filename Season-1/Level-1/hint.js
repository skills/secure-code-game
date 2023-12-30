// Example of underflow vulnerability in JS
var a = 10000000000000000; // 16 zeroes, try with 15 zeroes ;)
var b = 2;
var c = 1;

console.log(a + b - c - a);