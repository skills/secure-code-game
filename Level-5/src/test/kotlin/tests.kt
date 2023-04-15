import org.junit.Assert.*
import org.junit.Test

class TestTaxPayer {
    // verifies that hash and verification are matching each other for SHA
    @Test
    fun test1() {
        val rd = RandomGenerator()
        val sha256 = SHA256Hasher()
        val passVer = rd.generateSalt().let { sha256.passwordHash("abc", it) }
            .let { sha256.passwordVerification("abc", it) }
        assertTrue(passVer)
    }

    // verifies that hash and verification are matching each other for MD5
    @Test
    fun test2() {
        val md5 = MD5Hasher()
        val md5Hash = md5.passwordVerification("abc", md5.passwordHash("abc"))
        assertTrue(md5Hash)
    }
}
