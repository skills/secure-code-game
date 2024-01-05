from collections import namedtuple
from decimal import Decimal

Order = namedtuple('Order', 'id, items')
Item = namedtuple('Item', 'type, description, amount, quantity')

MAX_ITEM_AMOUNT = 100000 # maximum price of item in the shop
MAX_QUANTITY = 100 # maximum quantity of an item in the shop
MIN_QUANTITY = 0 # minimum quantity of an item in the shop
MAX_TOTAL = 1e6 # maximum total amount accepted for an order

def validorder(order):
    payments = Decimal('0')
    expenses = Decimal('0')

    for item in order.items:
        if item.type == 'payment':
            # Sets a reasonable min & max value for the invoice amounts
            if -MAX_ITEM_AMOUNT <= item.amount <= MAX_ITEM_AMOUNT:
                payments += Decimal(str(item.amount))
        elif item.type == 'product':
            if type(item.quantity) is int and MIN_QUANTITY < item.quantity <= MAX_QUANTITY and MIN_QUANTITY < item.amount <= MAX_ITEM_AMOUNT:
                expenses += Decimal(str(item.amount)) * item.quantity
        else:
            return "Invalid item type: %s" % item.type
    
    if abs(payments) > MAX_TOTAL or expenses > MAX_TOTAL:
        return "Total amount payable for an order exceeded"

    if payments != expenses:
        return "Order ID: %s - Payment imbalance: $%0.2f" % (order.id, payments - expenses)
    else:
        return "Order ID: %s - Full payment received!" % order.id

# Solution explanation:

# A floating-point underflow vulnerability.

# In hack.py, the attacker tricked the system by supplying an extremely high
# amount as a fake payment, immediately followed by a payment reversal.
# The exploit passes a huge number, causing an underflow while subtracting the
# cost of purchased items, resulting in a zero net.

# It's a good practice to limit your system input to an acceptable range instead
# of accepting any value.

# We also need to protect from a scenario where the attacker sends a huge number
# of items, resulting in a huge net. We can do this by limiting all variables
# to reasonable values.

# In addition, using floating-point data types for calculations involving financial
# values causes unexpected rounding and comparison errors as it cannot represent
# decimal numbers with the precision we expect.

# For example, running `0.1 + 0.2` in the Python interpreter gives `0.30000000000000004`
# instead of 0.3.

# The solution to this is to use the Decimal type for calculations that should work
# in the same way "as the arithmetic that people learn at school."
# Learn more by reading Python's official documentation on Decimal:
# (https://docs.python.org/3/library/decimal.html).

# It is also necessary to convert the floating point values to string first before passing
# it to the Decimal constructor. If the floating point value is passed to the Decimal
# constructor, the rounded value is stored instead.

# Compare the following examples from the interpreter:
# >>> Decimal(0.3)
# Decimal('0.299999999999999988897769753748434595763683319091796875')
# >>> Decimal('0.3')
# Decimal('0.3')

# Input validation should be expanded to also check data types besides testing allowed range
# of values. This specific bug, caused by using a non-integer quantity, might occur due to
# insufficient attention to requirements engineering. While in certain contexts is acceptable
# to buy a non-integer amount of an item (e.g. buy a fractional share), in the context of our
# online shop we falsely placed trust to users for buying a positive integer of items only,
# without malicious intend.


# Contribute new levels to the game in 3 simple steps!
# Read our Contribution Guideline at github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md