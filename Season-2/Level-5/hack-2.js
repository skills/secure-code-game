// EXPLOIT 2

// How to run the following exploit:

// 1. Double click index.html to open it in any browser. Are you using GitHub Codespaces?

// Please note that if you are inside a codespace, it is not possible to perform step 1.
// Instead, run the following command inside the codespace's terminal:
//    `cd Season-2/Level-5/ && python3 -m http.server`
// A pop up window will appear on the bottom right informing you that 
// "Your application running on port 8000 is available". Now click "Open in Browser".
// Another way to open the application on port 8000 is by clicking on the "Ports" tab 
// in terminal, followed by clicking on its respective URL.

// 2. Copy the following line, paste it in the javascript console and press enter.
CryptoAPI.sha1._round = function() { alert('Exploit 2'); };

// 3. Now copy this line, paste it in the javascript console and press enter.
CryptoAPI.sha1.hash("abc")

// 4. A popup should appear with the text "Exploit 2" in it. If it does, the exploit was successful.

// 5. Refresh the page to reset the level.

// * If the exploit was unsuccessful, you can proceed to the next exploit inside hack-3.js.
