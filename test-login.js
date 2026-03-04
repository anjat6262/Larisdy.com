// Simple login test

function login(username, password) {
    const validUsername = "admin";
    const validPassword = "12345";

    if (!username || !password) {
        return "Username dan password tidak boleh kosong";
    }

    if (username === validUsername && password === validPassword) {
        return "Login berhasil";
    }

    return "Username atau password salah";
}


// ===== TEST CASE =====

console.log("Test 1: Username kosong");
console.assert(login("", "12345") === "Username dan password tidak boleh kosong");

console.log("Test 2: Password kosong");
console.assert(login("admin", "") === "Username dan password tidak boleh kosong");

console.log("Test 3: Username salah");
console.assert(login("user", "12345") === "Username atau password salah");

console.log("Test 4: Password salah");
console.assert(login("admin", "11111") === "Username atau password salah");

console.log("Test 5: Login benar");
console.assert(login("admin", "12345") === "Login berhasil");

console.log("Semua test selesai!");