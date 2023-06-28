from collections import namedtuple
from decimal import Decimal

Order = namedtuple('Order', 'id, items')
Item = namedtuple('Item', 'type, description, amount, quantity')

MAX_ITEM_AMOUNT = 100000 # maximum price of item in the shop
MAX_QUANTITY = 100 # maximum quantity of an item in the shop
MAX_TOTAL = 1e6 # maximum total amount accepted for an order

def validorder(order):
    net = Decimal('0')

    for item in order.items:
        if item.type == 'payment':
            # sets a reasonable min & max value for the invoice amounts
            if item.amount > -1*MAX_ITEM_AMOUNT and item.amount < MAX_ITEM_AMOUNT:
                net += Decimal(str(item.amount))
        elif item.type == 'product':
            if item.quantity > 0 and item.quantity <= MAX_QUANTITY and item.amount > 0 and item.amount <= MAX_ITEM_AMOUNT:
                net -= Decimal(str(item.amount)) * item.quantity
            if net > MAX_TOTAL or net < -1*MAX_TOTAL:
                return("Total amount exceeded")
        else:
            return("Invalid item type: %s" % item.type)
 
    if net != 0:
        return("Order ID: %s - Payment imbalance: $%0.2f" % (order.id, net))
    else:
        return("Order ID: %s - Full payment received!" % order.id)

'''
A floating-point underflow vulnerability.

In hack.py, the attacker tricked the system by supplying an extremely high 
amount as a fake payment, immediately followed by a payment reversal.
The exploit passes a huge number, causing an underflow while subtracting the cost of purchased items, resulting in a zero net.

It's a good practice to limit your system input to an acceptable range instead
of accepting any value.

We also need to protect from a scenario where the attacker sends a huge number
of items, resulting in a huge net. We can do this by limiting all variables
to reasonable values.

In addition, using floating-point data types for calculations involving financial values causes unexpected rounding and comparison
errors as it cannot represent decimal numbers with the precision we expect.
For example, running `0.1 + 0.2` in the Python interpreter gives `0.30000000000000004` instead of 0.3.

The solution to this is to use the Decimal type for calculations that should work in the same way "as the arithmetic that people learn at school."
-- excerpt from Python's documentation on Decimal (https://docs.python.org/3/library/decimal.html).

It is also necessary to convert the floating point values to string first before passing it to the Decimal constructor.
If the floating point value is passed to the Decimal constructor, the rounded value is stored instead.

Compare the following examples from the interpreter:
>>> Decimal(0.3)
Decimal('0.299999999999999988897769753748434595763683319091796875')
>>> Decimal('0.3')
Decimal('0.3')


Contribute new levels to the game in 3 simple steps! 
Read our Contribution Guideline at github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md
'''
