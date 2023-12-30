import unittest
import os
import code as c

class TestTaxPayer(unittest.TestCase):

    # Example 1 - path traversal exploited on get_prof_picture
    def test_1(self):
        # creates tax payer object with dummy username and password
        test_obj = c.TaxPayer('username_test', 'password_test')
        # user input to the profile picture
        input = './../../../../../etc/passwd'
        # the output of the function upon processing user input
        output = test_obj.get_prof_picture(input)

        self.assertIsNone(output)

    # Example 2 - path traversal exploited on get_tax_form_attachment
    def test_2(self):
        # creates tax payer object with dummy username and password
        test_obj = c.TaxPayer('username_test', 'password_test')
        # gets base directory
        base_dir = os.path.dirname(os.path.abspath(__file__))
        # user input to the tax form attachment
        file_path = './../../../../../etc/passwd'
        # complete path for input
        input = base_dir + file_path
        # the output of the function upon processing user input
        output = test_obj.get_tax_form_attachment(input)

        self.assertIsNone(output)

if __name__ == '__main__':
    unittest.main()