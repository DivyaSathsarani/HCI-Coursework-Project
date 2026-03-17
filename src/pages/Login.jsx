// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleLogin = (e) => {
  e.preventDefault();

  const savedPassword = localStorage.getItem("userPassword") || "123456";
  const savedEmail = localStorage.getItem("userEmail") || "admin@example.com";

  // save email in localStorage
  localStorage.setItem("userEmail", savedEmail);

  if (email === savedEmail && password === savedPassword) {
    localStorage.setItem("loggedIn", "true");
    navigate("/designer");
  } else {
    alert("Invalid email or password");
  }
};

  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",background:"#f0f0f0"}}>

      <form onSubmit={handleLogin} style={{
        padding:40,
        background:"white",
        borderRadius:12,
        width:320,
        display:"flex",
        flexDirection:"column",
        gap:15
      }}>

        <h2 style={{textAlign:"center"}}>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        <Link to="/forgot-password" style={{textAlign:"center"}}>
          Forgot Password?
        </Link>

      </form>
    </div>
  );
}