import unittest
import code as c

class TestOnlineStore(unittest.TestCase):

    # Tricks the system and walks away with 1 television, despite valid payment & reimbursement
    def test_4(self):
        tv = c.Item(type='product', description='tv', amount=1000.00, quantity=1)
        payment = c.Item(type='payment', description='invoice_4', amount=1e19, quantity=1)
        reimbursement = c.Item(type='payment', description='reimbursement_4', amount=-1e19, quantity=1)
        order_4 = c.Order(id='4', items=[payment, tv, reimbursement])
        self.assertEqual(c.validorder(order_4), 'Order ID: 4 - Payment imbalance: $-1000.00')

if __name__ == '__main__':
    unittest.main()