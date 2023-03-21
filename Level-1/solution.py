from collections import namedtuple

Order = namedtuple('Order', 'id, items')
Item = namedtuple('Item', 'type, description, amount, quantity')

MAX_ITEM_AMOUNT = 100000 # maximum price of item in the shop
MAX_QUANTITY = 100 # maximum quantity of an item in the shop
MAX_TOTAL = 1e6 # maximum total amount accepted for an order

def validorder(order):
    net = 0

    for item in order.items:
        if item.type == 'payment':
            # sets a reasonable min & max value for the invoice amounts
            if item.amount > -1*MAX_ITEM_AMOUNT and item.amount < MAX_ITEM_AMOUNT:
                net += item.amount
        elif item.type == 'product':
            if item.quantity > 0 and item.quantity <= MAX_QUANTITY and item.amount > 0 and item.amount <= MAX_ITEM_AMOUNT:
                net -= item.amount * item.quantity
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
'''
