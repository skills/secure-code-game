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

class TestDatabase(unittest.TestCase): 
  
    # tests for correct retrieval of stock info given a symbol
    def test_1(self):
        op = c.DB_CRUD_ops()
        expected_output = "[METHOD EXECUTED] get_stock_info\n[QUERY] SELECT * FROM stocks WHERE symbol = 'MSFT'\n[RESULT] ('2022-01-06', 'MSFT', 300.0)"
        actual_output = op.get_stock_info('MSFT')
        self.assertEqual(actual_output, expected_output)

    # tests for correct defense against SQLi in the case where a user passes more than one query or restricted characters
    def test_2(self):
        op = c.DB_CRUD_ops()
        expected_output = "[METHOD EXECUTED] get_stock_info\n[QUERY] SELECT * FROM stocks WHERE symbol = 'MSFT'; UPDATE stocks SET price = '500' WHERE symbol = 'MSFT'--'\nCONFIRM THAT THE ABOVE QUERY IS NOT MALICIOUS TO EXECUTE"
        actual_output = op.get_stock_info("MSFT'; UPDATE stocks SET price = '500' WHERE symbol = 'MSFT'--")
        self.assertEqual(actual_output, expected_output)

    # tests for correct retrieval of stock price
    def test_3(self):
        op = c.DB_CRUD_ops()
        expected_output = "[METHOD EXECUTED] get_stock_price\n[QUERY] SELECT price FROM stocks WHERE symbol = 'MSFT'\n[RESULT] (300.0,)\n"
        actual_output = op.get_stock_price('MSFT')
        self.assertEqual(actual_output, expected_output)

    # tests for correct update of stock price given symbol and updated price
    def test_4(self):
        op = c.DB_CRUD_ops()
        expected_output = "[METHOD EXECUTED] update_stock_price\n[QUERY] UPDATE stocks SET price = '300' WHERE symbol = 'MSFT'\n"
        actual_output = op.update_stock_price('MSFT', 300.0)
        self.assertEqual(actual_output, expected_output)
    
    # tests for correct execution of multiple queries
    def test_5(self):
        op = c.DB_CRUD_ops()
        query_1 = "[METHOD EXECUTED] exec_multi_query\n[QUERY]SELECT price FROM stocks WHERE symbol = 'MSFT'\n[RESULT] (300.0,) "
        query_2 = "[QUERY] SELECT * FROM stocks WHERE symbol = 'MSFT'\n[RESULT] ('2022-01-06', 'MSFT', 300.0) "
        expected_output = query_1 + query_2
        actual_output = op.exec_multi_query("SELECT price FROM stocks WHERE symbol = 'MSFT'; SELECT * FROM stocks WHERE symbol = 'MSFT'")
        self.assertEqual(actual_output, expected_output)
    
    # tests for correct execution of user script
    def test_6(self):
        op = c.DB_CRUD_ops()
        expected_output = "[METHOD EXECUTED] exec_user_script\n[QUERY] SELECT price FROM stocks WHERE symbol = 'MSFT'\n[RESULT] (300.0,)"
        actual_output = op.exec_user_script("SELECT price FROM stocks WHERE symbol = 'MSFT'")
        self.assertEqual(actual_output, expected_output) 
        
if __name__ == '__main__':    
    unittest.main()