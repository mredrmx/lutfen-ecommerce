"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  featured?: boolean;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) {
          throw new Error("Ürünler yüklenirken bir hata oluştu");
        }
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        setError("Ürünler yüklenirken bir hata oluştu");
        console.error("Ürün yükleme hatası:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Ürünler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  const featuredProducts = products.filter(p => p.featured).slice(0, 6);
  const regularProducts = products.filter(p => !p.featured).slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950">
      <div className="container mx-auto py-8 md:py-12 px-4">
        <header className="mb-8 md:mb-12 text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-blue-700 dark:text-blue-300 tracking-tight">
            Lütfen E-Ticaret'e Hoş Geldiniz
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6 md:mb-8 px-4">
            En yeni teknolojik ürünler burada!
          </p>
          <Link 
            href="/products" 
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tüm Ürünleri Görüntüle
          </Link>
        </header>

        {/* Öne Çıkan Ürünler */}
        {featuredProducts.length > 0 && (
          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-800 dark:text-gray-200 px-4">
              Öne Çıkan Ürünler
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow p-4 md:p-6 flex flex-col items-center border border-gray-100 dark:border-gray-700 relative"
                >
                  <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Öne Çıkan
                  </div>
                  <div className="w-20 h-20 md:w-24 md:h-24 mb-3 md:mb-4 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-xl"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="text-gray-400 text-2xl md:text-4xl hidden">📦</div>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-300 text-xs md:text-sm mb-3 text-center line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between w-full mb-3 md:mb-4">
                    <span className="text-base md:text-lg font-bold text-blue-600 dark:text-blue-400">
                      ₺{product.price}
                    </span>
                    <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                      Stok: {product.stock}
                    </span>
                  </div>
                  <button className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-md text-sm md:text-base">
                    Sepete Ekle
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Diğer Ürünler */}
        {regularProducts.length > 0 && (
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-800 dark:text-gray-200 px-4">
              Diğer Ürünler
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {regularProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow p-4 md:p-6 flex flex-col items-center border border-gray-100 dark:border-gray-700"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 mb-3 md:mb-4 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-xl"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="text-gray-400 text-2xl md:text-4xl hidden">📦</div>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-300 text-xs md:text-sm mb-3 text-center line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between w-full mb-3 md:mb-4">
                    <span className="text-base md:text-lg font-bold text-blue-600 dark:text-blue-400">
                      ₺{product.price}
                    </span>
                    <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                      Stok: {product.stock}
                    </span>
                  </div>
                  <button className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-md text-sm md:text-base">
                    Sepete Ekle
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {products.length === 0 && (
          <div className="text-center py-8 md:py-12 px-4">
            <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg mb-4">
              Henüz ürün bulunmuyor.
            </p>
            <Link 
              href="/admin/products" 
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              İlk Ürünü Ekle
            </Link>
          </div>
        )}

        <footer className="mt-12 md:mt-16 text-center text-gray-400 text-sm px-4">
          © {new Date().getFullYear()} Lütfen E-Ticaret
        </footer>
      </div>
    </div>
  );
}
