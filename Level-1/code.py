                                                  '''
                                                  ////////////////////////////////////////////////////////////
                                                  ///                                                      ///
                                                  ///   In the 'validorder' function, the bug is caused by /// 
                                                  ///   checking if the net amount is equal to 0 instead   ///
                                                  ///   of using a tolerance value due to the limitations  ///
                                                  ///   of floating-point arithmetic.                      ///
                                                  ///                                                      ///
                                                  ///   Replacing if net != 0: by if abs(net) > 1e-6:      ///
                                                  ////////////////////////////////////////////////////////////
                                                  '''
 

from collections import namedtuple

Order = namedtuple('Order', 'id, items')
Item = namedtuple('Item', 'type, description, amount, quantity')

def validorder(order: Order):
    net = 0
    
    for item in order.items:
        if item.type == 'payment':
            net += item.amount
        elif item.type == 'product':
            net -= item.amount * item.quantity
        else:
            return("Invalid item type: %s" % item.type)
    
    if abs(net) > 1e-6:
        return("Order ID: %s - Payment imbalance: $%0.2f" % (order.id, net))
    else:
        return("Order ID: %s - Full payment received!" % order.id)
