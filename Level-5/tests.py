import unittest
import code as c

class TestTaxPayer(unittest.TestCase): 
  
    # verifies that hash and verification are matching each other for SHA
    def test_1(self):
        rd = c.Random_generator()
        sha256 = c.SHA256_hasher()
        pass_ver = sha256.password_verification("abc", sha256.password_hash("abc",rd.generate_salt()))
        self.assertEqual(pass_ver, True)

    # verifies that hash and verification are matching each other for MD5
    def test_2(self):
        md5 = c.MD5_hasher()
        md5_hash = md5.password_verification("abc", md5.password_hash("abc"))
        self.assertEqual(md5_hash, True)
        
if __name__ == '__main__':    
    unittest.main()