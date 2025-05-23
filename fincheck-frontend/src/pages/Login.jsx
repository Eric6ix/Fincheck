import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return setError("Please fill in all the fields.");
    }

    try {
      const response = await axios.post("/auth/login", { email, password });
      const { token } = response.data;
      const { name } = response.data.user;
      localStorage.setItem("token", token);
      alert(`Welcome ${name}`)
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Login - FinCheck
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <a
            href="/"
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
