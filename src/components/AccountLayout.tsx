"use client";
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

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


const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-600 text-white font-semibold shadow-md'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      {children}
    </Link>
  );
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 p-4 md:p-8">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sol Kenar Çubuğu */}
                    <aside className="md:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg h-fit">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Hesabım</h2>
                        <nav className="space-y-2">
                            <NavLink href="/profile"><UserIcon className="w-5 h-5" /><span>Kişisel Bilgiler</span></NavLink>
                            <NavLink href="/wishlist"><HeartIcon className="w-5 h-5" /><span>İstek Listem</span></NavLink>
                            <NavLink href="/orders"><PackageIcon className="w-5 h-5" /><span>Siparişlerim</span></NavLink>
                            <NavLink href="/addresses"><HomeIcon className="w-5 h-5" /><span>Adreslerim</span></NavLink>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <LogOutIcon className="w-5 h-5" />
                                <span>Çıkış Yap</span>
                            </button>
                        </nav>
                    </aside>

                    {/* Sağ İçerik */}
                    <main className="md:col-span-3 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
} 