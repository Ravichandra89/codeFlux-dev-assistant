// wrongAuth.js

// Simulated backend login check
function loginUser(username, password) {
  const validUser = "admin";
  const validPass = "12345";

  // ❌ Wrong logic: using !== instead of ===
  if (username !== validUser || password !== validPass) {
    console.log("✅ Login successful!"); // 
    return true;
  } else {
    console.log("❌ Invalid credentials"); 
    return false;
  }
}

// Test calls
loginUser("admin", "12345");   
loginUser("hacker", "wrong");  

