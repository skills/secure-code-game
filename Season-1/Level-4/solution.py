import sqlite3

# Please note: The following code is NOT expected to run and it's provided for explanation only

# Vulnerable: this code will allow an attacker to insert the "DROP TABLE" SQL command into the query
# and delete all users from the database.
con = sqlite3.connect('example.db')
user_input = "Mary'); DROP TABLE Users;--"
sql_stmt = "INSERT INTO Users (user) VALUES ('" + user_input + "');"
con.executescript(sql_stmt)

# Secure through Parameterized Statements
con = sqlite3.connect('example.db')
user_input = "Mary'); DROP TABLE Users;--"
# The secure way to query a database is
con.execute("INSERT INTO Users (user) VALUES (?)", (user_input,))

# Solution explanation:

# The methodology used above to protect against SQL injection is the usage of parameterized
# statements. They protect against user input tampering with the query logic
# by using '?' as user input placeholders.

# In the example above, the user input, as wrong as it is, will be inserted into the database
# as a new user, but the DROP TABLE command will not be executed.

# code.py has 5 methods namely:
# (1) get_stock_info
# (2) get_stock_price
# (3) update_stock_price
# (4) exec_multi_query
# (5) exec_user_script

# All methods are vulnerable!

# Some are also suffering from bad design.
# We believe that methods 1, 2, and 3 have a more security-friendly design compared
# to methods 4 and 5.

# This is because methods 4 and 5, by design, provide attackers with the chance of
# arbitrary script execution.

# We believe that security plays an important role and methods like 4 and 5 should be
# avoided fully.

# We, therefore, propose in our model solution to completely remove them instead of
# trying to secure them in their existing form. A better approach would be to design
# them from the beginning, like methods 1, 2, and 3, so that user input could be a
# placeholder in pre-existing logic, instead of giving users the power of directly
# injecting logic.

# More details:
# One protection available to prevent SQL injection is the use of prepared statements,
# a database feature executing repeated queries. The protection stems from
# the fact that queries are no longer executed dynamically.

# The user input will be passed to a template placeholder, which means
# that even if someone manages to pass unsanitized data to a query, the injection
# will not be in position to modify the databases' query template. Therefore no SQL
# injection will occur.

# Widely-used web frameworks such as Ruby on Rails and Django offer built-in
# protection to help prevent SQL injection, but that shouldn't stop you from
# following good practices. Contextually, be careful when handling user input
# by planning for the worst and never trusting the user.

# The GitHub Security Lab covered this flaw in one episode of Security Bites,
# its series on secure programming: https://youtu.be/VE6c57Tk5gM

# We also covered this flaw in a blog post about OWASP's Top 10 proactive controls:
# https://github.blog/2021-12-06-write-more-secure-code-owasp-top-10-proactive-controls/