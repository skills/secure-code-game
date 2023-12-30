# ///////////////////////////////////////////////////////////////////////
# ///                          RUN HACK                      	      ///
# /// _______________________________________________________________ ///
# ///																  ///
# ///   This file exploits the vulnerabilities in code.py 			  ///
# ///   To run this file, you must be running code.py (flask app)     ///
# ///   in parallel. To do this, we recommend opening 2 terminals.    ///
# ///   In the first terminal, run the app following the instructions ///
# ///   in code.py, and in the second terminal run this file using:   ///
# ///                                                                 ///
# ///   $ python3 Season-2/Level-3/hack.py                            ///
# ///                                                                 ///                
# ///   Running this file will fail initially (it contains failing    ///
# ///   tests). As all other levels, your goal is to get this file    ///
# ///   to pass while ensuring that the tests.py file still passes.   ///
# ///                                                                 ///         
# ///////////////////////////////////////////////////////////////////////

import requests

# Target URL
target_url = "http://localhost:5000/"

# XSS payload
payload = "<<img src='x' onerror='alert(1)'>>"

# Craft the malicious URL with the payload
malicious_url = f"{target_url}getPlanetInfo?planet={payload}"

# Send the request
response = requests.get(malicious_url)

# Print the response content
print(response.text)