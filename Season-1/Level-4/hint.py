import sqlite3

# Vulnerable
con = sqlite3.connect('users.db')
user_input = "Mary"
sql_stmt = "INSERT INTO Users (user) VALUES ('" + user_input + "');"
con.executescript(sql_stmt)

"""
The above code is vulnerable to SQL injection because user_input is
passed unsanitized to the query logic. This makes the query logic
prone to being tampered. Consider the following input:

user_input = "Mary'); DROP TABLE Users;--"

which will result to the following query:

"INSERT INTO Users (user) VALUES ('Mary'); DROP TABLE Users;--');"

Now that you know what's wrong with the code, can you fix it?


Contribute new levels to the game in 3 simple steps! 
Read our Contribution Guideline at github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md
"""