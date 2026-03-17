import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword(){

  const [email,setEmail] = useState("");
  const [newPassword,setNewPassword] = useState("");

  const navigate = useNavigate();

  const handleReset = (e)=>{
    e.preventDefault();

    const savedEmail = localStorage.getItem("userEmail") || "admin@example.com";

    if(email !== savedEmail){
      alert("Email not found");
      return;
    }

    localStorage.setItem("userPassword",newPassword);

    alert("Password reset successful!");

    navigate("/login");
  };

  return(

    <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",background:"#f0f0f0"}}>

      <form onSubmit={handleReset} style={{
        padding:40,
        background:"white",
        borderRadius:12,
        width:320,
        display:"flex",
        flexDirection:"column",
        gap:15
      }}>

        <h2 style={{textAlign:"center"}}>Reset Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e)=>setNewPassword(e.target.value)}
          required
        />

        <button type="submit">Reset Password</button>

      </form>

    </div>

  );
}