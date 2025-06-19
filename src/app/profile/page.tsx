"use client";
import React, { useEffect, useState } from "react";

export default function ProfilePage() {
  const [form, setForm] = useState({ name: "", surname: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("/profile/api", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setForm({ name: data.user.name, surname: data.user.surname, email: data.user.email });
        }
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Oturum bulunamadı.");
      setTimeout(() => setError(""), 3000);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/profile/api", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Bir hata oluştu.");
        setTimeout(() => setError(""), 3000);
      } else {
        setSuccess("Profil güncellendi.");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      setError("Bir hata oluştu.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-center text-blue-700 dark:text-blue-300 mb-6">Profilim</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input name="name" type="text" placeholder="Ad" className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.name} onChange={handleChange} />
          <input name="surname" type="text" placeholder="Soyad" className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.surname} onChange={handleChange} />
          <input name="email" type="email" placeholder="E-posta" className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.email} onChange={handleChange} />
          <button type="submit" className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-md" disabled={loading}>{loading ? "Güncelleniyor..." : "Güncelle"}</button>
        </form>
        {error && <div className="w-full py-2 px-4 rounded-lg bg-red-100 text-red-700 text-center mt-2">{error}</div>}
        {success && <div className="w-full py-2 px-4 rounded-lg bg-green-100 text-green-700 text-center mt-2">{success}</div>}
      </div>
    </div>
  );
} 