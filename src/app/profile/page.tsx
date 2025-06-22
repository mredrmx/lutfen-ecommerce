"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AccountLayout from '@/components/AccountLayout';

// Ikonlar
const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
);
const PackageIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 9.4a4.5 4.5 0 1 0 0-8.8 4.5 4.5 0 0 0 0 8.8z"/><path d="M12 2a9 9 0 0 0-9 9c0 5 4 10 9 10s9-5 9-10c0-5-4-9-9-9zm0 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/></svg>
);
const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const LogOutIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ name: "", surname: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
    if (user) {
      setForm({ name: user.name || "", surname: user.surname || "", email: user.email || "" });
    }
  }, [user, authLoading, router]);

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
      setError("Oturum bulunamadı. Lütfen tekrar giriş yapın.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/profile/api", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: form.name, surname: form.surname }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Profil güncellenirken bir hata oluştu.");
      }
      setSuccess("Profil bilgileriniz başarıyla güncellendi.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AccountLayout>
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Kişisel Bilgiler</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            E-posta
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            disabled
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ad
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
          <div>
            <label htmlFor="surname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Soyad
            </label>
            <input
              id="surname"
              name="surname"
              type="text"
              value={form.surname}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
        </div>

        {error && <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">{error}</div>}
        {success && <div className="p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm">{success}</div>}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-wait"
          >
            {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
          </button>
        </div>
      </form>

      <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8">
        <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">Tehlikeli Alan</h2>
        <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-lg border border-red-200 dark:border-red-800/50">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Hesabı Sil</h3>
          <p className="text-red-600 dark:text-red-300 mt-2 mb-4 text-sm">
            Hesabınızı silme talebi gönderdiğinizde bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecektir.
          </p>
          <button className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors text-sm">
            Hesabı Silme Talebi Gönder
          </button>
        </div>
      </div>
    </AccountLayout>
  );
} 