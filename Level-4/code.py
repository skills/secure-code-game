import sqlite3

class DB_CRUD_ops:
    
    def __init__(self):
        self.conn = sqlite3.connect('stocks.db')
    
    def get_stock_info(self, symbol):
        # Use parameterized queries to prevent SQL injection attacks
        cursor = self.conn.execute("SELECT * FROM stocks WHERE symbol = ?", (symbol,))
        result = cursor.fetchone()
        return f"[METHOD EXECUTED] get_stock_info\n[QUERY] SELECT * FROM stocks WHERE symbol = '{symbol}'\n[RESULT] {result}"
    
    def get_stock_price(self, symbol):
        # Use parameterized queries to prevent SQL injection attacks
        cursor = self.conn.execute("SELECT price FROM stocks WHERE symbol = ?", (symbol,))
        result = cursor.fetchone()
        return f"[METHOD EXECUTED] get_stock_price\n[QUERY] SELECT price FROM stocks WHERE symbol = '{symbol}'\n[RESULT] {result}\n"
    
    def update_stock_price(self, symbol, new_price):
        # Use parameterized queries to prevent SQL injection attacks
        self.conn.execute("UPDATE stocks SET price = ? WHERE symbol = ?", (new_price, symbol))
        self.conn.commit()
        return f"[METHOD EXECUTED] update_stock_price\n[QUERY] UPDATE stocks SET price = '{new_price}' WHERE symbol = '{symbol}'\n"
    
    def exec_multi_query(self, query):
        # Prevent multiple queries by only allowing SELECT statements
        if "SELECT" not in query:
            return "ERROR: Only SELECT statements are allowed for multi-query execution."
        
        cursor = self.conn.execute(query)
        result = ""
        for row in cursor:
            result += str(row) + " "
        return f"[METHOD EXECUTED] exec_multi_query\n[QUERY]{query}\n[RESULT] {result}"
    
    def exec_user_script(self, query):
        # Prevent execution of arbitrary user scripts
        return "ERROR: User scripts are not allowed for execution."
