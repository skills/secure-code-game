import unittest
import code as c

class TestOnlineStore(unittest.TestCase):

    # Tricks the system and walks away with 1 television, despite valid payment & reimbursement
    def test_5(self):
        tv = c.Item(type='product', description='tv', amount=1000.00, quantity=1)
        payment = c.Item(type='payment', description='invoice_5', amount=1e19, quantity=1)
        reimbursement = c.Item(type='payment', description='reimbursement_5', amount=-1e19, quantity=1)
        order_5 = c.Order(id='5', items=[payment, tv, reimbursement])
        self.assertEqual(c.validorder(order_5), 'Order ID: 5 - Payment imbalance: $-1000.00')

    # Valid payments that should add up correctly, but do not
    def test_6(self):
        small_item = c.Item(type='product', description='accessory', amount=3.3, quantity=1)
        payment_1 = c.Item(type='payment', description='invoice_6_1', amount=1.1, quantity=1)
        payment_2 = c.Item(type='payment', description='invoice_6_2', amount=2.2, quantity=1)
        order_6 = c.Order(id='6', items=[small_item, payment_1, payment_2])
        self.assertEqual(c.validorder(order_6),'Order ID: 6 - Full payment received!')


if __name__ == '__main__':
    unittest.main()
