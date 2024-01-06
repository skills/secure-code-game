# //////////////////////////////////////////////////////////////////////
# ///                                                      		     ///
# ///   0. tests.py file is passing but the code here is vulnerable  ///
# ///   1. Review the code in this file. Can you spot the bugs(s)?   ///
# ///   2. Fix the bug(s) in code.py. Ensure that tests.py passes    ///
# ///   3. Run hack.py and if passing then CONGRATS!       	         ///
# ///   4. If stuck then read the hint                     		     ///
# ///   5. Compare your solution with solution.txt   		         ///
# ///                                                      		     ///
# //////////////////////////////////////////////////////////////////////

# //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
# ///                               RUN CODE (RECOMMENDED TO PASS THIS LEVEL)                                            ///
# /// __________________________________________________________________________________________________________________ ///
# ///														                                                             ///
# ///  Run by opening a terminal and running the following:                                                              ///
# ///  $ export FLASK_APP=Season-2/Level-3/code.py && export FLASK_ENV=development && export FLASK_DEBUG=0 && flask run  ///
# ///													                                                                 ///
# //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import os
import re
from flask import Flask, request, render_template
app = Flask(__name__)

# Set the absolute path to the template directory
template_dir = os.path.abspath('Season-2/Level-3/templates')
app.template_folder = template_dir

# Hard-coded planet data
planet_data = {
    "Mercury": "The smallest and fastest planet in the Solar System.",
    "Venus": "The second planet from the Sun and the hottest planet.",
    "Earth": "Our home planet and the only known celestial body to support life.",
    "Mars": "The fourth planet from the Sun and often called the 'Red Planet'.",
    "Jupiter": "The largest planet in the Solar System and known for its great red spot.",
}

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        planet = request.form.get('planet')
        sanitized_planet = re.sub(r'[<>{}[\]]', '', planet if planet else '')

        if sanitized_planet:
            if 'script' in sanitized_planet.lower() :
                return '<h2>Blocked</h2></p>'
    
            return render_template('details.html', 
                                   planet=sanitized_planet, 
                                   info=get_planet_info(sanitized_planet))
        else:
            return '<h2>Please enter a planet name.</h2>'

    return render_template('index.html')

def get_planet_info(planet):
    return planet_data.get(planet, 'Unknown planet.')

if __name__ == '__main__':
    app.run()