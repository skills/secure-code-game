# /////////////////////////////////////////////////////////////////////////
# ///                      		RUN TESTS                      			///
# /// _________________________________________________________________ ///
# ///                                                      			    ///
# ///               This file contains passing tests.					///
# ///       															///
# ///	 Run them by opening a terminal and running the following:      ///
# ///    $ python3 Season-2/Level-3/tests.py                            ///
# ///																	///
# ///   Note: first you have to run code.py following the instructions  ///
# ///   on top of the file so that the environment variables align but  ///
# ///   it's not necessary to run both files in parallel as the tests   ///
# ///   initialize a new environment, similar to code.py                ///
# ///                                                                	///
# /////////////////////////////////////////////////////////////////////////

from code import app, get_planet_info
import unittest
from flask import Flask
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
        expected_info = 'No information found for Pluto.'
        result = get_planet_info(planet)
        self.assertEqual(result, expected_info)

    def test_get_planet_info_valid_planet(self):
        planet = 'Mercury'
        expected_info = 'The smallest and fastest planet in the Solar System.'
        result = get_planet_info(planet)
        self.assertEqual(result, expected_info)

    def test_get_planet_info_endpoint_valid_planet(self):
        planet = 'Venus'
        response = self.client.get(f'/getPlanetInfo?planet={planet}')
        self.assert200(response)
        self.assertEqual(response.data.decode(), f'<h2>Planet Details:</h2><p>{get_planet_info(planet)}</p>')

if __name__ == '__main__':
    unittest.main()