import unittest
import code as c

class TestOnlineStore(unittest.TestCase):

    # Example 1 - shows a valid and successful payment for a tv
    def test_1(self):
        tv_item = c.Item(type='product', description='tv', amount=1000.00, quantity=1)
        payment = c.Item(type='payment', description='invoice_1', amount=1000.00, quantity=1)
        order_1 = c.Order(id='1', items=[payment, tv_item])
        self.assertEqual(c.validorder(order_1), 'Order ID: 1 - Full payment received!')

    # Example 2 - successfully detects payment imbalance as tv was never paid
    def test_2(self):
        tv_item = c.Item(type='product', description='tv', amount=1000.00, quantity=1)
        order_2 = c.Order(id='2', items=[tv_item])
        self.assertEqual(c.validorder(order_2), 'Order ID: 2 - Payment imbalance: $-1000.00')

    # Example 3 - successfully reimburses client for a return so payment imbalance exists
    def test_3(self):
        tv_item = c.Item(type='product', description='tv', amount=1000.00, quantity=1)
        payment = c.Item(type='payment', description='invoice_3', amount=1000.00, quantity=1)
        payback = c.Item(type='payment', description='payback_3', amount=-1000.00, quantity=1)
        order_3 = c.Order(id='3', items=[payment, tv_item, payback])
        self.assertEqual(c.validorder(order_3), 'Order ID: 3 - Payment imbalance: $-1000.00')

    # Example 4 - handles invalid input such as placing an invalid order for 1.5 device
    def test_4(self):
        tv = c.Item(type='product', description='tv', amount=1000, quantity=1.5)
        order_1 = c.Order(id='1', items=[tv])
        try:
            c.validorder(order_1)
        except:
            self.fail("Invalid order detected")

    # Example 5 - handles an invalid item type called 'service'
    def test_5(self):
        service = c.Item(type='service', description='order shipment', amount=100, quantity=1)
        order_1 = c.Order(id='1', items=[service])
        self.assertEqual(c.validorder(order_1), 'Invalid item type: service')

if __name__ == '__main__':
    unittest.main()