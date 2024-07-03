from collections import namedtuple

Order = namedtuple('Order', 'id, items')
Item = namedtuple('Item', 'type, description, amount, quantity')

# Define a constant for the total payable limit
TOTAL_PAYABLE_LIMIT = 10**6  # Adjust this limit as needed

def validorder(order: Order):
    net = 0
    total_amount = 0  # To track the total payable amount

    for item in order.items:
        try:
            amount = float(item.amount)
            quantity = int(item.quantity)
        except ValueError:
            return "Invalid amount or quantity for item: %s" % item.description
        
        if item.type == 'payment':
            net += amount
        elif item.type == 'product':
            net -= amount * quantity
            total_amount += amount * quantity
        else:
            return "Invalid item type: %s" % item.type

        # Check for underflow/overflow
        if abs(net) > TOTAL_PAYABLE_LIMIT:
            return "Order ID: %s - Payment imbalance: $%0.2f" % (order.id, net)

    # Check if the total payable amount exceeds the limit
    if total_amount > TOTAL_PAYABLE_LIMIT:
        return "Total amount payable for an order exceeded"

    if net != 0:
        return "Order ID: %s - Payment imbalance: $%0.2f" % (order.id, net)
    else:
        return "Order ID: %s - Full payment received!" % order.id
