// EXPLOIT 3

// How to run the following exploit:

// 1. Double click index.html to open it in any browser. Are you using Codespaces?

// Please note that if you are inside a codespace, it is not possible to perform step 1.
// Instead, run the following in terminal from the root of the game level (Season-2/Level-5/):
//    `python3 -m http.server`
// Once running, select on the "ports" tab of the codespace and click on the URL that exposes
// port 8000. Navigating to the URL should serve the HTML and vulnerable JavaScript.
// Proceed with the remaining steps.

// 2. Copy the following line, paste it in the javascript console and press enter.
Array.prototype.__defineSetter__("0", function() { alert('Exploit 3'); });

// 3. Now copy this line, paste it in the javascript console and press enter.
CryptoAPI.sha1.hash("abc")

// 4. A popup should appear with the text "Exploit 3" in it. If it does, the exploit was successful.

// 5. Refresh the page to reset the level.

// * If the exploit was unsuccessful, you have now resolved this exploit. Congratulations!
