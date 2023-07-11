import unittest
from flask import Flask
from flask_testing import TestCase
from code import app, get_planet_info

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
 
    def test_get_planet_info_endpoint_no_planet(self):
        response = self.client.get('/getPlanetInfo')
        self.assert400(response)
        self.assertEqual(response.json, {'error': 'No planet name provided.'})
    
 

if __name__ == '__main__':
    unittest.main()
 