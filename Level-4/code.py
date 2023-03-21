import sqlite3
import os
from flask import Flask, request

### Unrelated to the exercise -- Starts here -- Please ignore
app = Flask(__name__)
@app.route("/")
def source():
    DB_CRUD_ops().get_stock_info(request.args["input"])
    DB_CRUD_ops().get_stock_price(request.args["input"])
    DB_CRUD_ops().update_stock_price(request.args["input"])
    DB_CRUD_ops().exec_multi_query(request.args["input"])
    DB_CRUD_ops().exec_user_script(request.args["input"])
### Unrelated to the exercise -- Ends here -- Please ignore

class Connect(object):

    # helper function creating database with the connection
    def create_connection(self, path):
        connection = None
        try:
            connection = sqlite3.connect(path)
        except sqlite3.Error as e:
            print(f"ERROR: {e}")
        return connection
    
class Create(object):
    
    def __init__(self):
        con = Connect()
        try:
            # creates a dummy database inside the folder of this challenge
            path = os.path.dirname(os.path.abspath(__file__))
            db_path = os.path.join(path, 'level-3.db')
            db_con = con.create_connection(db_path)
            cur = db_con.cursor()
            
            # checks if tables already exist, which will happen when re-running code
            table_fetch = cur.execute(
                '''
                SELECT name 
                FROM sqlite_master 
                WHERE type='table'AND name='stocks';
                ''').fetchall()
 
            # if tables do not exist, create them to instert dummy data
            if table_fetch == []:
                cur.execute(
                    '''
                    CREATE TABLE stocks
                    (date text, symbol text, price real)
                    ''')
                
                # inserts dummy data to the 'stocks' table, representing average price on date
                cur.execute(
                    "INSERT INTO stocks VALUES ('2022-01-06', 'MSFT', 300.00)")
                db_con.commit()
            
        except sqlite3.Error as e:
            print(f"ERROR: {e}")
            
        finally:
            db_con.close()

class DB_CRUD_ops(object):
    
    # retrieves all info about a stock symbol from the stocks table
    # Example: get_stock_info('MSFT') will result into executing
    # SELECT * FROM stocks WHERE symbol = 'MSFT'
    def get_stock_info(self, stock_symbol):
        # building database from scratch as it is more suitable for the purpose of the lab
        db = Create()
        con = Connect()
        try:
            path = os.path.dirname(os.path.abspath(__file__))
            db_path = os.path.join(path, 'level-3.db')
            db_con = con.create_connection(db_path)
            cur = db_con.cursor() 
            
            res = "[METHOD EXECUTED] get_stock_info\n"
            query = "SELECT * FROM stocks WHERE symbol = '{0}'".format(stock_symbol)
            res += "[QUERY] " + query + "\n"
            
            # a block list or restricted characters that should not be presented in user-supplied input
            restricted_chars = ";%&^!#-"
            # checks if input contains characters from the block list
            has_restricted_char = any([char in query for char in restricted_chars])
            # checks if input contains a wrong number of single quotes against SQL injection
            correct_number_of_single_quotes = query.count("'") == 2
            
            # performs the checks for good cyber security and safe software against SQL injection
            if has_restricted_char or not correct_number_of_single_quotes:
                # in case you want to sanitize user input, please uncomment the following 2 lines
                # sanitized_query = query.translate({ord(char):None for char in restricted_chars})
                # res += "[SANITIZED_QUERY]" + sanitized_query + "\n"
                res += "CONFIRM THAT THE ABOVE QUERY IS NOT MALICIOUS TO EXECUTE"
            else:
                cur.execute(query)
                
                query_outcome = cur.fetchall()
                for result in query_outcome:
                    res += "[RESULT] " + str(result)
            return res
        
        except sqlite3.Error as e:
            print(f"ERROR: {e}")
            
        finally:
            db_con.close()
            
    # retrieves the price of a stock symbol from the stocks table
    # Example: get_stock_price('MSFT') will result into executing
    # SELECT price FROM stocks WHERE symbol = 'MSFT' 
    def get_stock_price(self, stock_symbol):
        # building database from scratch as it is more suitable for the purpose of the lab
        db = Create()
        con = Connect()
        try:
            path = os.path.dirname(os.path.abspath(__file__))
            db_path = os.path.join(path, 'level-3.db')
            db_con = con.create_connection(db_path)
            cur = db_con.cursor()
            
            res = "[METHOD EXECUTED] get_stock_price\n"
            query = "SELECT price FROM stocks WHERE symbol = '" + stock_symbol + "'"
            res += "[QUERY] " + query + "\n"
            if ';' in query:
                res += "[SCRIPT EXECUTION]\n"
                cur.executescript(query)
            else:
                cur.execute(query)
                query_outcome = cur.fetchall()
                for result in query_outcome:
                    res += "[RESULT] " + str(result) + "\n"
            return res
                
        except sqlite3.Error as e:
            print(f"ERROR: {e}")
            
        finally:
            db_con.close()

    # updates stock price
    def update_stock_price(self, stock_symbol, price):
        # building database from scratch as it is more suitable for the purpose of the lab
        db = Create()
        con = Connect()
        try:
            path = os.path.dirname(os.path.abspath(__file__))
            db_path = os.path.join(path, 'level-3.db')
            db_con = con.create_connection(db_path)
            cur = db_con.cursor()
            
            if not isinstance(price, float):
                raise Exception("ERROR: stock price provided is not a float")
            
            res = "[METHOD EXECUTED] update_stock_price\n"
            # UPDATE stocks SET price = 310.0 WHERE symbol = 'MSFT'
            query = "UPDATE stocks SET price = '%d' WHERE symbol = '%s'" % (price, stock_symbol)
            res += "[QUERY] " + query + "\n"
            
            cur.execute(query)
            db_con.commit()
            query_outcome = cur.fetchall()
            for result in query_outcome:
                res += "[RESULT] " + result
            return res
            
        except sqlite3.Error as e:
            print(f"ERROR: {e}")
            
        finally:
            db_con.close()

    # executes multiple queries
    # Example: SELECT price FROM stocks WHERE symbol = 'MSFT'; SELECT * FROM stocks WHERE symbol = 'MSFT'
    # Example: UPDATE stocks SET price = 310.0 WHERE symbol = 'MSFT'
    def exec_multi_query(self, query):
        # building database from scratch as it is more suitable for the purpose of the lab
        db = Create()
        con = Connect()
        try:
            path = os.path.dirname(os.path.abspath(__file__))
            db_path = os.path.join(path, 'level-3.db')
            db_con = con.create_connection(db_path)
            cur = db_con.cursor()
            
            res = "[METHOD EXECUTED] exec_multi_query\n"
            for query in filter(None, query.split(';')):
                res += "[QUERY]" + query + "\n"
                query = query.strip()
                cur.execute(query)
                db_con.commit()
                
                query_outcome = cur.fetchall()
                for result in query_outcome:
                    res += "[RESULT] " + str(result) + " "
            return res
            
        except sqlite3.Error as e:
            print(f"ERROR: {e}")
            
        finally:
            db_con.close()  

    # executes any query or multiple queries as defined from the user in the form of script
    # Example: SELECT price FROM stocks WHERE symbol = 'MSFT'; SELECT * FROM stocks WHERE symbol = 'MSFT' 
    def exec_user_script(self, query):
        # building database from scratch as it is more suitable for the purpose of the lab
        db = Create()
        con = Connect()
        try:
            path = os.path.dirname(os.path.abspath(__file__))
            db_path = os.path.join(path, 'level-3.db')
            db_con = con.create_connection(db_path)
            cur = db_con.cursor()
            
            res = "[METHOD EXECUTED] exec_user_script\n"
            res += "[QUERY] " + query + "\n"
            if ';' in query:
                res += "[SCRIPT EXECUTION]"
                cur.executescript(query)
                db_con.commit()
            else:
                cur.execute(query)
                db_con.commit()
                query_outcome = cur.fetchall()
                for result in query_outcome:
                    res += "[RESULT] " + str(result)
            return res    
            
        except sqlite3.Error as e:
            print(f"ERROR: {e}")
            
        finally:
            db_con.close()