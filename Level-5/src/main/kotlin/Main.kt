import org.mindrot.jbcrypt.BCrypt
import java.security.MessageDigest
import java.security.SecureRandom
import kotlin.experimental.and
import kotlin.random.Random


class RandomGenerator {
    fun generateToken(length: Int = 8, alphabet: String = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"): String {
        return (1..length)
            .map { alphabet[Random.nextInt(0, alphabet.length)] }
            .joinToString("")
    }
    private val base64Code = charArrayOf(
        '.','/','A','B','C','D','E','F','G','H',
        'I','J','K','L','M','N','O','P','Q','R',
        'S','T','U','V','W','X','Y','Z','a','b',
        'c','d','e','f','g','h','i','j','k','l',
        'm','n','o','p','q','r','s','t','u','v',
        'w','x','y','z','0','1','2','3','4','5',
        '6','7','8','9'
    )

    @Throws(java.lang.IllegalArgumentException::class)
    private fun encodeBase64(var0: ByteArray, var1: Int): String {
        var var2 = 0
        val var3 = java.lang.StringBuilder()
        return if (var1 > 0 && var1 <= var0.size) {
            while (var2 < var1) {
                var var4 = var0[var2++].toInt() and 255
                var3.append(base64Code[var4 shr 2 and 63])
                var4 = var4 and 3 shl 4
                if (var2 >= var1) {
                    var3.append(base64Code[var4 and 63])
                    break
                }
                var var5 = var0[var2++].toInt() and 255
                var4 = var4 or (var5 shr 4 and 15)
                var3.append(base64Code[var4 and 63])
                var4 = var5 and 15 shl 2
                if (var2 >= var1) {
                    var3.append(base64Code[var4 and 63])
                    break
                }
                var5 = var0[var2++].toInt() and 255
                var4 = var4 or (var5 shr 6 and 3)
                var3.append(base64Code[var4 and 63])
                var3.append(base64Code[var5 and 63])
            }
            var3.toString()
        } else {
            throw java.lang.IllegalArgumentException("Invalid len")
        }
    }

    fun generateSalt(var0: Int = 12, var1: SecureRandom = SecureRandom()): String {
        val var2 = StringBuilder()
        val var3 = ByteArray(16)
        var1.nextBytes(var3)
        var2.append("$2a$")

        if (var0 < 10) {
            var2.append("0")
        }

        var2.append(var0.toString())
        var2.append("$")
        var2.append(encodeBase64(var3, var3.size))

        return var2.toString()
    }
}

class SHA256Hasher {
    fun passwordHash(password: String, salt: String): String {
        return BCrypt.hashpw(password, salt)
    }

    fun passwordVerification(password: String, passwordHash: String): Boolean {
        return BCrypt.checkpw(password, passwordHash)
    }
}

class MD5Hasher {

    // same as above but using a different algorithm to hash which is MD5
    fun passwordHash(password: String): String {
        return MessageDigest.getInstance("MD5")
            .digest(password.toByteArray())
            .joinToString("") { String.format("%02x", it and 0xff.toByte()) }
    }

    fun passwordVerification(password: String, passwordHash: String): Boolean {
        val hashedPassword = passwordHash(password)
        return hashedPassword.equals(passwordHash, ignoreCase = true)
    }
}

const val PRIVATE_KEY = "my-secret-key"
const val PUBLIC_KEY = "my-public-key"
const val SECRET_KEY = "TjWnZr4u7x!A%D*G-KaPdSgVkXp2s5v8"
const val PASSWORD_HASHER = "MD5Hasher"