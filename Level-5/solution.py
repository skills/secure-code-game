import binascii
import secrets
import hashlib
import os
import bcrypt

class Random_generator:

    # generates a random token using the secrets library for true randomness
    def generate_token(self, length=8, alphabet=(
    '0123456789'
    'abcdefghijklmnopqrstuvwxyz'
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    )):
        return ''.join(secrets.choice(alphabet) for i in range(length))

    # generates salt using the bcrypt library which is a safe implementation
    def generate_salt(self, rounds=12):
        return bcrypt.gensalt(rounds)

class SHA256_hasher:

    # produces the password hash by combining password + salt because hashing
    def password_hash(self, password, salt):
        password = binascii.hexlify(hashlib.sha256(password.encode()).digest())
        password_hash = bcrypt.hashpw(password, salt)
        return password_hash.decode('ascii')

    # verifies that the hashed password reverses to the plain text version on verification
    def password_verification(self, password, password_hash):
        password = binascii.hexlify(hashlib.sha256(password.encode()).digest())
        password_hash = password_hash.encode('ascii')
        return bcrypt.checkpw(password, password_hash)

# a collection of sensitive secrets necessary for the software to operate
PRIVATE_KEY = os.environ.get('PRIVATE_KEY')
PUBLIC_KEY = os.environ.get('PUBLIC_KEY')
SECRET_KEY = os.environ.get('SECRET_KEY')
PASSWORD_HASHER = 'SHA256_hasher'

"""
Some mistakes are basic, like choosing a cryptographically-broken algorithm
or committing secret keys directly in your source code.

You are more likely to fall for something more advanced, like using functions that seem random
but produce a weak randomness.

The code suffers from:
- reinventing the wheel by generating salt manually instead of calling gensalt()
- not utilizing the full range of possible salt values
- using the random module instead of the secrets module

Notice that we used the “random” module, which is designed for modeling and simulation, 
not for security or cryptography.

A good practice is to use modules specifically designed and, most importantly,
confirmed by the security community as secure for cryptography-related use cases.

To fix the code, we used the “secrets” module, which provides access to the most secure source of 
randomness on my operating system. I also used functions for generating secure tokens and hard-to-guess 
URLs. 

Other python modules approved and recommended by the security community include argon2 and pbkdf2.
"""
