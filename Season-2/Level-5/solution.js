// Contribute new levels to the game in 3 simple steps!
// Read our Contribution Guideline at github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md

// In-depth explanation follows at the end of the file. Scroll down to see it.
var CryptoAPI = (function() {
	var encoding = {
		a2b: function(a) { },
		b2a: function(b) { }
	};

	var API = {
		sha1: {
			name: 'sha1',
			identifier: '2b0e03021a',
			size: 20,
			block: 64,
			hash: function(s) {
        
        // FIX for hack-1.js
        if (typeof s !== "string") {
          throw "Error: CryptoAPI.sha1.hash() should be called with a 'normal' parameter (i.e., a string)";
        }
				
        var len = (s += '\x80').length,
					blocks = len >> 6,
					chunk = len & 63,
					res = "",
					i = 0,
					j = 0,
					H = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0],
        
          // FIX for hack-3.js
          w = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
          ];
					
				while (chunk++ != 56) {
					s += "\x00";
					if (chunk == 64) {
						blocks++;
						chunk = 0;
					}
				}
				
				for (s += "\x00\x00\x00\x00", chunk = 3, len = 8 * (len - 1); chunk >= 0; chunk--) {
					s += encoding.b2a(len >> (8 * chunk) & 255);
				}
					
				for (i = 0; i < s.length; i++) {
					j = (j << 8) + encoding.a2b(s[i]);
					if ((i & 3) == 3) {
						w[(i >> 2) & 15] = j;
						j = 0;
					}
					// FIX for hack-2.js
					if ((i & 63) == 63) internalRound(H, w);
				}
				
				for (i = 0; i < H.length; i++)
					for (j = 3; j >= 0; j--)
						res += encoding.b2a(H[i] >> (8 * j) & 255);
				return res;
			}, // End "hash"
			_round: function(H, w) { }
		} // End "sha1"
	}; // End "API"
  
  // FIX for hack-2.js
  var internalRound = API.sha1._round;

	return API; // End body of anonymous function
})(); // End "CryptoAPI"


// --------------------------------------------------------------------------------------------
// Explanation
// --------------------------------------------------------------------------------------------
// Vulnerability 1
// --------------------------------------------------------------------------------------------

// The parameter "s" could be an object, and when cast to
// a string by the implicit type conversion of the "+=" operator, the
// conversion can trigger malicious code execution. (This operator is used
// on lines 18, 28, 35 and 36 of code.js.)


// Exploit 1

// We can provide a malicious object as the parameter for
// CryptoAPI.sha1.hash() that triggers the type conversion, e.g.:

var x = { toString: function() { alert('1'); } };

// or by what was provided in hack-1.js


// Fix 1

// We could fix this vulnerability by adding between lines 17 and 18 of code.js.

if (typeof s !== "string") {
  throw "Error: CryptoAPI.sha1.hash() should be called with a 'normal' parameter (i.e., a string)";
}

// becoming

// code ...
hash: function example (input) {
  if (typeof input !== "string") {
    throw "Error: CryptoAPI.sha1.hash() should be called with a 'normal' parameter (i.e., a string)";
  }
  var len = (input += '\x80').length
// more code ...
}


// --------------------------------------------------------------------------------------------
// Vulnerability 2
// --------------------------------------------------------------------------------------------

// The reference to CryptoAPI.sha1._round on line 45 of code.js is
// non-local, so the "_round" property of CryptoAPI.sha1 can be overwritten
// with attacker-defined code that will be executed by CryptoAPI.sha1.hash.
// It's important to realise that this is because of how the function is
// called on line 45 of code.js, not because of how it is defined on line 53.


// Exploit 2

// We could alter the definition of CryptoAPI.sha1._round after
// loading CryptoAPI, e.g.:

CryptoAPI.sha1._round = function() { alert('2'); };

// or by what was provided in hack-2.js


// Fix 2

// We could fix this vulnerability by storing a local
// reference to the "_round" property on line 56 of code.js, 
// after "API" has been defined:

var internalRound = API.sha1._round;

// and using this local reference in the body of the "hash" function in the
// invocation of the function on line 45 of code.js instead:

if ((i & 63) == 63) internalRound(H, w);

// This works because in JS, a method is first going to be
// searched locally and then globally (non-locally).



// --------------------------------------------------------------------------------------------
// Vulnerability 3
// --------------------------------------------------------------------------------------------

// The array "w" is initialised as an empty array on line 25 of code.js, 
// but other code in CryptoAPI.sha1.hash makes implicit references to
// elements at specific indices (which are simply properties of an object),
// so an assignment to one of these elements (e.g., on line 42) could
// trigger malicious code execution as a result of poisoning the Array
// prototype. Specifically, 128 elements of "w" are accessed by the CryptoAPI code.

// Although the reason for this vulnerability was the failure
// to correctly initialise "w" on line 25 of code.js with the number of elements that
// would be used by the code that followed it, someone could also identify
// that the assignment on line 42 of code.js could trigger malicious code execution. 


// Exploit 3

// We could poison the Array prototype before CryptoAPI is
// defined such that attempting to set the value of the element at index 0
// in an array triggers execution of user-defined code, e.g.:

var g = null;
var s = null;

(function() {
  var zero = undefined;
  g = function() { return zero; }
  s = function(x) { alert('3'); zero = x; }
})();

Object.defineProperty(Array.prototype, "0", { get: g, set: s });

// or the quicker, dirtier hack:

Array.prototype.__defineSetter__("0", function() { alert('3'); });

// or by what was provided in hack-3.js


// Fix 3
 
// 128 elements of "w" are accessed by the CryptoAPI code, so
// we could fix this vulnerability by declaring "w" as an array initialised
// explicitly with 128 elements. This way, when we attempt to set the value 
// of an element in "w" on line 42 of code.js we don't inherit a malicious 
// setter for that property via the Array prototype.

w = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ];