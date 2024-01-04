#!/bin/bash

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
# ///   $ ./Season-2/Level-3/hack.sh                                  ///
# ///                                                                 ///                
# ///   Running this file will fail initially (it contains failing    ///
# ///   tests). As all other levels, your goal is to get this file    ///
# ///   to pass while ensuring that the tests.py file still passes.   ///
# ///                                                                 ///         
# ///////////////////////////////////////////////////////////////////////

curl -F "planet=<img src='x' onerror='alert(1)'>" http://localhost:5000/