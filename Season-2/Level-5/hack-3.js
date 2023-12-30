// EXPLOIT 3

// How to run the following exploit:

// 1. Double click index.html to open it in any browser. Are you using Codespaces?

// Please note that if you are inside a Codespace, it is not possible to perform step 1. For
// this reason, please create a local copy for the file 'index.html'. You can do so by copying 
// and pasting the contents of 'index.html' in a local file so that you can open it in a browser.
// Then, follow the remaining steps.

// 2. Copy the following line, paste it in the javascript console and press enter.
Array.prototype.__defineSetter__("0", function() { alert('Exploit 3'); });

// 3. Now copy this line, paste it in the javascript console and press enter.
CryptoAPI.sha1.hash("abc")

// 4. A popup should appear with the text "Exploit 3" in it. If it does, the exploit was successful.

// 5. Refresh the page to reset the level.

// * If the exploit was unsuccessful, you have now resolved this exploit. Congratulations!