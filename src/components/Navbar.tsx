"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

type UserInfo = { id: number; email: string; role: string } | null;

// İkonlarımızı tanımlayalım
const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const ShoppingCartIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
);

export default function Navbar() {
  const { toggleCart, getItemCount } = useCart();
  const { user } = useAuth();
  const itemCount = getItemCount();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.dispatchEvent(new Event("storage"));
    setIsAccountMenuOpen(false);
    window.location.href = "/";
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleAccountMenu = () => setIsAccountMenuOpen(!isAccountMenuOpen);

  return (
    <nav className="backdrop-blur bg-white/80 dark:bg-gray-900/80 shadow-lg transition-all sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        <Link href="/" className="font-bold text-xl md:text-2xl text-blue-700 dark:text-blue-300 tracking-tight hover:opacity-80 transition">Lütfen E-Ticaret</Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/products" className="rounded-lg px-3 py-1.5 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 transition">Ürünler</Link>
          {user?.role === "admin" && <Link href="/admin" className="rounded-lg px-3 py-1.5 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950 transition">Admin</Link>}

          {/* Account Dropdown */}
          <div className="relative" ref={accountMenuRef}>
            <button onClick={toggleAccountMenu} className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 transition border border-gray-300 dark:border-gray-600">
                <UserIcon className="h-5 w-5"/>
                <span>Hesap</span>
            </button>
            {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 py-1">
                    {user ? (
                        <>
                            <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Hesabım</Link>
                            <Link href="/wishlist" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Listem</Link>
                            <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 dark:text-ray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Siparişlerim</Link>
                            <Link href="/addresses" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Adreslerim</Link>
                            <div className="border-t my-1 border-gray-200 dark:border-gray-600"></div>
                            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">Çıkış</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Giriş</Link>
                            <Link href="/register" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Kayıt Ol</Link>
                        </>
                    )}
                </div>
            )}
          </div>
          <button onClick={toggleCart} className="relative p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition">
            <ShoppingCartIcon className="h-6 w-6 text-gray-700 dark:text-gray-200"/>
            {itemCount > 0 && (
                <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                    {itemCount}
                </span>
            )}
          </button>
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
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="px-4 py-3 space-y-2">
            {/* Mobil menü içeriği de yeni tasarıma göre güncellenmeli */}
            <Link href="/products" className="block rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 transition" onClick={() => setIsMenuOpen(false)}>Ürünler</Link>
            {user ? (
                <>
                    <Link href="/profile" className="block rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 transition" onClick={() => setIsMenuOpen(false)}>Hesabım</Link>
                    <Link href="/orders" className="block rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 transition" onClick={() => setIsMenuOpen(false)}>Siparişlerim</Link>
                    <button onClick={handleLogout} className="w-full text-left rounded-lg px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 transition">Çıkış</button>
                </>
            ) : (
                <>
                    <Link href="/login" className="block rounded-lg px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 transition" onClick={() => setIsMenuOpen(false)}>Giriş</Link>
                    <Link href="/register" className="block rounded-lg px-3 py-2 bg-green-100 text-green-700 hover:bg-green-200 transition" onClick={() => setIsMenuOpen(false)}>Kayıt Ol</Link>
                </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 