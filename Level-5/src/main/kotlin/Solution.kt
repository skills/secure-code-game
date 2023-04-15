import java.security.SecureRandom
import org.mindrot.jbcrypt.BCrypt

class Solution {
    /*
    * The Random class in Kotlin (and in Java) generates pseudorandom numbers using a deterministic algorithm, which means that given the same initial state (also known as seed), it will always produce the same sequence of numbers. This is fine for many purposes, such as simulations or games, but it is not suitable for security-sensitive applications, such as generating cryptographic keys, passwords, or session tokens.
    * Attackers could potentially predict or reproduce the same sequence of random values if they know the seed value, which could compromise the security of the system. This is where the SecureRandom class comes in: it uses a cryptographically secure pseudorandom number generator (CSPRNG) that is designed to be resistant to statistical attacks and prediction, and its seed is generated from secure sources, such as the operating system's entropy pool.
    * The SecureRandom class is specifically designed for security-critical applications, where it is crucial to have unpredictable and unbiased random values. It provides a stronger level of security than the Random class, and it is recommended for all cryptographic operations, such as key generation, signature generation, and password hashing.
    * Therefore, it is better to use SecureRandom instead of Random in security-critical applications to ensure the confidentiality, integrity, and availability of the system.
    * */
    fun generateToken(length: Int = 8, alphabet: String = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"): String {
        val random = SecureRandom()
        val token = StringBuilder(length)
        for (i in 0 until length) {
            token.append(alphabet[random.nextInt(alphabet.length)])
        }
        return token.toString()
    }

    /* You don't need to reinvent the wheel! The use of the generated salt created by the lib almost always will be more
    * secure than yours! And look at the code, cleaner no?
    */
    fun generateSalt(var0: Int = 12, var1: SecureRandom = SecureRandom()) { BCrypt.gensalt() }
}
/*
Here are the main problems:
Use of insecure hashing algorithms:
The MD5Hasher class uses the MD5 algorithm for hashing passwords, which is considered insecure due to its vulnerability to collision and pre-image attacks.
It's no longer recommended for password storage or any cryptographic applications.
Instead, use a more secure hashing algorithm like bcrypt, scrypt, or Argon2.

Static keys in the code:
The PRIVATE_KEY, PUBLIC_KEY, and SECRET_KEY constants are hardcoded into the code.
This is a poor practice, as it can lead to unintentional exposure of these secrets if the source code becomes accessible to unauthorized parties.
It's better to store secrets in separate configuration files or use environment variables that can be set during deployment.

Inconsistent hashing methods:
The code contains both an SHA256Hasher class (which uses bcrypt) and an MD5Hasher class.
It's best to use a single, secure hashing method consistently throughout your application, like bcrypt, to avoid potential confusion and security issues.

Weak random token generation:
The generateToken function in the RandomGenerator class uses the kotlin.random.Random class, which is not cryptographically secure.
For secure random number generation, consider using java.security.SecureRandom.

Inefficient Base64 encoding implementation:
The RandomGenerator class has a custom implementation of Base64 encoding, which might not be efficient or secure. It's better to use standard libraries like java.util.Base64 for encoding and decoding Base64 strings.

Unnecessary complexity in the RandomGenerator class:
The generateSalt function in the RandomGenerator class generates a salt for bcrypt hashing. However, the BCrypt library can generate a salt automatically when hashing a password. You can simplify the code by using the library's built-in salt generation.
 */

