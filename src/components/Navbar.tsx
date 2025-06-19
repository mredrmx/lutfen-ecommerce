"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";

type UserInfo = { id: number; email: string; role: string } | null;

export default function Navbar() {
  const [user, setUser] = useState<UserInfo>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === "undefined") return;
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }
      try {
        // Sadece decode et
        const decoded = jwt.decode(token) as UserInfo;
        setUser(decoded);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    const interval = setInterval(checkAuth, 60000);
    return () => {
      window.removeEventListener("storage", checkAuth);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Cookie'den de token'ı temizle
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.dispatchEvent(new Event("storage"));
    window.location.href = "/login";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="backdrop-blur bg-white/80 dark:bg-gray-900/80 shadow-lg rounded-b-2xl mb-6 md:mb-10 transition-all">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        <Link href="/" className="font-bold text-xl md:text-2xl text-blue-700 dark:text-blue-300 tracking-tight hover:opacity-80 transition">Lütfen E-Ticaret</Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-2">
          <Link href="/products" className="rounded-lg px-3 py-1.5 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 transition">Ürünler</Link>
          {user && <Link href="/orders" className="rounded-lg px-3 py-1.5 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 transition">Siparişlerim</Link>}
          {user && <Link href="/messages" className="rounded-lg px-3 py-1.5 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 transition">Mesajlar</Link>}
          {user && <Link href="/profile" className="rounded-lg px-3 py-1.5 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 transition">Profil</Link>}
          {user?.role === "admin" && <Link href="/admin" className="rounded-lg px-3 py-1.5 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950 transition">Admin</Link>}
          {!user && <Link href="/login" className="rounded-lg px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 transition">Giriş</Link>}
          {!user && <Link href="/register" className="rounded-lg px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 transition">Kayıt Ol</Link>}
          {user && <button onClick={handleLogout} className="rounded-lg px-3 py-1.5 bg-red-500 text-white hover:bg-red-600 transition">Çıkış</button>}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-2xl">
          <div className="px-4 py-3 space-y-2">
            <Link 
              href="/products" 
              className="block rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Ürünler
            </Link>
            {user && (
              <Link 
                href="/orders" 
                className="block rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Siparişlerim
              </Link>
            )}
            {user && (
              <Link 
                href="/messages" 
                className="block rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Mesajlar
              </Link>
            )}
            {user && (
              <Link 
                href="/profile" 
                className="block rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Profil
              </Link>
            )}
            {user?.role === "admin" && (
              <Link 
                href="/admin" 
                className="block rounded-lg px-3 py-2 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            {!user && (
              <Link 
                href="/login" 
                className="block rounded-lg px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Giriş
              </Link>
            )}
            {!user && (
              <Link 
                href="/register" 
                className="block rounded-lg px-3 py-2 bg-green-600 text-white hover:bg-green-700 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Kayıt Ol
              </Link>
            )}
            {user && (
              <button 
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }} 
                className="w-full text-left rounded-lg px-3 py-2 bg-red-500 text-white hover:bg-red-600 transition"
              >
                Çıkış
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 