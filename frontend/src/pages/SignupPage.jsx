import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../api/axios";

function SignupPage() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

      const response = await api.post(
        "/auth/signup",
        formData
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4"
      >

        <h1 className="text-3xl font-bold text-center">
          Signup
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500"
          >
            Login
          </Link>
        </p>

      </form>

    </div>
  );
}

export default SignupPage;