import unittest
import code as c

class TestOnlineStore(unittest.TestCase):

    # Example 1 - shows a valid and successful payment for a tv
    def test_1(self):
        tv = c.Item(type='product', description='tv', amount=1000.00, quantity=1)
        payment = c.Item(type='payment', description='invoice_1', amount=1000.00, quantity=1)
        order_1 = c.Order(id='1', items=[payment, tv])
        self.assertEqual(c.validorder(order_1),'Order ID: 1 - Full payment received!')

    # Example 2 - successfully detects payment imbalance as tv was never paid
    def test_2(self):
        tv = c.Item(type='product', description='tv',amount=1000.00, quantity=1)
        order_2 = c.Order(id='2', items=[tv])
        self.assertEqual(c.validorder(order_2),'Order ID: 2 - Payment imbalance: $-1000.00')

    # Example 3 - successfully reimburses client for a tv they have returned so payment imbalance exists
    def test_3(self):
        tv = c.Item(type='product', description='tv',amount=1000.00, quantity=1)
        payment = c.Item(type='payment', description='invoice_3',amount=1000.00, quantity=1)
        reimbursement = c.Item(type='payment', description='reimbursement_3', amount=-1000.00, quantity=1)
        order_3 = c.Order(id='3', items=[payment, tv, reimbursement])
        self.assertEqual(c.validorder(order_3),'Order ID: 3 - Payment imbalance: $-1000.00')

    # Example 4 - successfully handles decimal places
    def test_4(self):
        smaller_item = c.Item(type='product', description='cable',amount=5.99, quantity=1)
        order_4 = c.Order(id='4', items=[smaller_item])
        self.assertEqual(c.validorder(order_4),'Order ID: 4 - Payment imbalance: $-5.99')

if __name__ == '__main__':
    unittest.main()
