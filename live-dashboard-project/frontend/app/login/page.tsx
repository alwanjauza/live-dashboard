"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("alwan");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8081/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login gagal!");
      }

      const { token } = await response.json();

      localStorage.setItem("authToken", token);

      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-8 bg-gray-900 text-white'>
      <div className='w-full max-w-sm bg-gray-800 p-8 rounded-lg shadow-lg'>
        <h1 className='text-3xl font-bold mb-6 text-center'>Login Dashboard</h1>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block mb-2 text-sm font-medium text-gray-300'>
              Username
            </label>
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500'
              required
            />
          </div>
          <div className='mb-6'>
            <label className='block mb-2 text-sm font-medium text-gray-300'>
              Password
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500'
              required
            />
          </div>
          {error && (
            <p className='text-red-500 text-center text-sm mb-4'>{error}</p>
          )}
          <button
            type='submit'
            className='w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-bold transition-colors'
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
