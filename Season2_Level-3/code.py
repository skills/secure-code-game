from flask import Flask, request, render_template, jsonify
import os

app = Flask(__name__)

# Set the absolute path to the template directory
template_dir = os.path.abspath('templates')
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

        if planet:
            return f'<h2>Planet Details:</h2><p>{get_planet_info(planet)}</p>'
        else:
            return '<h2>Please enter a planet name.</h2>'

    return render_template('index.html')

@app.route('/getPlanetInfo', methods=['GET'])
def get_planet_info_endpoint():
    planet = request.args.get('planet')

    if planet:
        details = get_planet_info(planet)
        if details:
            return f'<h2>Planet Details:</h2><p>{details}</p>'
        else:
            return jsonify({'error': f"No information found for '{planet}'."}), 404
    else:
        return jsonify({'error': 'No planet name provided.'}), 400

def get_planet_info(planet):
    if planet in planet_data:
        return planet_data[planet]
    else:
        return f'No information found for {planet}.'

if __name__ == '__main__':
    app.run()
