# Run tests.py by following the instructions below:

# This file contains passing tests.

# Run them by opening a terminal and running the following:
# $ python3 Season-2/Level-3/tests.py

# Note: first you have to run code.py following the instructions
# on top of that file so that the environment variables align but
# it's not necessary to run both files in parallel as the tests
# initialize a new environment, similar to code.py

from code import app, get_planet_info
import unittest
from flask_testing import TestCase

class MyTestCase(TestCase):
    def create_app(self):
        app.config['TESTING'] = True
        app.config['TEMPLATES_AUTO_RELOAD'] = True
        return app

    def test_index_route(self):
        response = self.client.get('/')
        self.assert200(response)
        self.assertTemplateUsed('index.html')

    def test_get_planet_info_invalid_planet(self):
        planet = 'Pluto'
        expected_info = 'Unknown planet.'
        result = get_planet_info(planet)
        self.assertEqual(result, expected_info)

    def test_get_planet_info_valid_planet(self):
        planet = 'Mercury'
        expected_info = 'The smallest and fastest planet in the Solar System.'
        result = get_planet_info(planet)
        self.assertEqual(result, expected_info)

    def test_index_valid_planet(self):
        planet = 'Venus'
        response = self.client.post('/', data={'planet': planet})
        self.assert200(response)
        self.assertEqual(response.data.decode()[:15], '<!DOCTYPE html>')

    def test_index_missing_planet(self):
        response = self.client.post('/')
        self.assert200(response)
        self.assertEqual(response.data.decode(), '<h2>Please enter a planet name.</h2>')

    def test_index_empty_planet(self):
        response = self.client.post('/', data={'planet': ''})
        self.assert200(response)
        self.assertEqual(response.data.decode(), '<h2>Please enter a planet name.</h2>')

    def test_index_active_content_planet(self):
        planet = "<script ...>"
        response = self.client.post('/', data={'planet': planet})
        self.assert200(response)
        self.assertEqual(response.data.decode(), '<h2>Blocked</h2></p>')

if __name__ == '__main__':
    unittest.main()