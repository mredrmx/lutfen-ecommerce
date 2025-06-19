"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

type UserInfo = { id: number; email: string; role: string } | null;

type Product = {
  id: number;
  name: string;
  featured: boolean;
};

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo>(null);
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login?returnUrl=/admin");
        return;
      }
      
      try {
        const decoded = jwt.decode(token) as UserInfo;
        if (!decoded || decoded.role !== "admin") {
          router.push("/");
          return;
        }
        setUser(decoded);
      } catch (error) {
        router.push("/login?returnUrl=/admin");
        return;
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchFeaturedProducts();
    }
  }, [user]);

  const fetchFeaturedProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        const featured = data.products?.filter((p: Product) => p.featured) || [];
        setFeaturedProducts(featured);
      }
    } catch (error) {
      console.error("Öne çıkan ürünler yüklenemedi:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold text-blue-700 dark:text-blue-300 text-center mb-8 md:mb-12">Admin Paneli</h1>
        
        {/* Öne Çıkan Ürünler Özeti */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 md:p-6 mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-300 mb-3 md:mb-4">Öne Çıkan Ürünler</h2>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="font-medium text-gray-800 dark:text-gray-200 text-sm md:text-base">{product.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Henüz öne çıkan ürün yok.</p>
          )}
          <div className="mt-3 md:mt-4">
            <Link 
              href="/admin/products" 
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm md:text-base"
            >
              Ürünleri Yönet
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Ürün Yönetimi Kartı */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 md:p-8 hover:shadow-xl transition-shadow">
            <h2 className="text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-300 mb-3 md:mb-4">Ürün Yönetimi</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base mb-4 md:mb-6">
              Ürünleri ekleyin, düzenleyin veya silin. Her ürün için ad, açıklama, 
              fiyat, stok ve görsel URL bilgilerini yönetin. Öne çıkan ürünleri belirleyin.
            </p>
            <Link 
              href="/admin/products" 
              className="inline-block w-full text-center py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors text-sm md:text-base"
            >
              Ürünleri Yönet
            </Link>
          </div>

          {/* Sipariş Yönetimi Kartı */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 md:p-8 hover:shadow-xl transition-shadow">
            <h2 className="text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-300 mb-3 md:mb-4">Sipariş Yönetimi</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base mb-4 md:mb-6">
              Kullanıcı siparişlerini görüntüleyin ve durumlarını güncelleyin. 
              Siparişleri onaylayın, gönderin veya iptal edin.
            </p>
            <Link 
              href="/admin/orders" 
              className="inline-block w-full text-center py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors text-sm md:text-base"
            >
              Siparişleri Yönet
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 