"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  brand: string;
  category: string;
  colors: string;
  sizes: string;
  images: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const router = useRouter();

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data.products || []);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); // Ürün detayına gitmeyi engelle
    addToCart(product, 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-blue-700 dark:text-blue-300 text-center">Tüm Ürünler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {products.map((p) => (
            <div 
              key={p.id} 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center border border-gray-100 dark:border-gray-700 cursor-pointer transform hover:scale-105"
              onClick={() => handleProductClick(p.id)}
            >
              <img src={p.imageUrl} alt={p.name} className="h-40 object-cover w-full rounded-xl bg-gray-100 dark:bg-gray-700 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 text-center">{p.name}</h3>
              <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm mb-2">{p.brand}</p>
              <p className="text-gray-500 dark:text-gray-300 text-sm mb-2 text-center line-clamp-2">{p.description}</p>
              <div className="flex justify-between items-center w-full mt-2 mb-4">
                <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">{p.price} ₺</span>
                <span className="text-xs">Stok: {p.stock}</span>
              </div>
              <button 
                className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-md mt-auto" 
                onClick={(e) => handleAddToCart(e, p)}
                disabled={p.stock === 0}
              >
                Sepete Ekle
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 