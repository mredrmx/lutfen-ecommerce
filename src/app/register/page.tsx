"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Şifreler eşleşmiyor");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Kayıt başarısız");
      }

      setError("");
      router.push("/login?message=Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt başarısız");
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 md:p-8">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-300 mb-2">
            Kayıt Ol
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
            Yeni hesap oluşturun
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ad Soyad
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base"
              placeholder="Ad Soyad"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              E-posta
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base"
              placeholder="ornek@email.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Şifre
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Şifre Tekrar
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm md:text-base text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors shadow-md text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
          </button>
        </form>

        <div className="mt-6 md:mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
            Zaten hesabınız var mı?{" "}
            <Link
              href="/login"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Giriş yapın
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 