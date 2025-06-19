"use client";
import React, { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data.products || []);
  };

  useEffect(() => { fetchProducts(); }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const found = prev.find((item) => item.product.id === product.id);
      if (found) {
        return prev.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleOrder = async () => {
    setError(""); setSuccess("");
    setLoading(true);
    if (!token) { setError("Sipariş için giriş yapmalısınız."); setTimeout(() => setError(""), 3000); setLoading(false); return; }
    if (cart.length === 0) { setError("Sepetiniz boş."); setTimeout(() => setError(""), 3000); setLoading(false); return; }
    const items = cart.map((item) => ({ productId: item.product.id, quantity: item.quantity, price: item.product.price }));
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ items }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Bir hata oluştu.");
      setTimeout(() => setError(""), 3000);
    } else {
      setSuccess("Siparişiniz oluşturuldu!");
      setTimeout(() => setSuccess(""), 3000);
      setCart([]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        <h2 className="text-3xl font-bold mb-8 text-blue-700 dark:text-blue-300 text-center">Ürünler</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {products.map((p) => (
            <div key={p.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow p-6 flex flex-col items-center border border-gray-100 dark:border-gray-700">
              <img src={p.imageUrl} alt={p.name} className="h-40 object-cover w-full rounded-xl bg-gray-100 dark:bg-gray-700 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 text-center">{p.name}</h3>
              <p className="text-gray-500 dark:text-gray-300 text-sm mb-2 text-center">{p.description}</p>
              <div className="flex justify-between items-center w-full mt-2 mb-4">
                <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">{p.price} ₺</span>
                <span className="text-xs">Stok: {p.stock}</span>
              </div>
              <button className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-md mt-auto" onClick={() => addToCart(p)} disabled={p.stock === 0}>Sepete Ekle</button>
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-8">
          <h3 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">Sepetim</h3>
          {cart.length === 0 ? <div>Sepetiniz boş.</div> : (
            <ul className="mb-4">
              {cart.map((item) => (
                <li key={item.product.id} className="flex justify-between items-center mb-2">
                  <span>{item.product.name} x{item.quantity}</span>
                  <button className="rounded-lg px-3 py-1.5 bg-red-500 text-white hover:bg-red-600 transition" onClick={() => removeFromCart(item.product.id)}>Kaldır</button>
                </li>
              ))}
            </ul>
          )}
          <button className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors shadow-md" onClick={handleOrder} disabled={cart.length === 0 || loading}>{loading ? "Sipariş Veriliyor..." : "Satın Al"}</button>
          {error && <div className="w-full py-2 px-4 rounded-lg bg-red-100 text-red-700 text-center mt-2">{error}</div>}
          {success && <div className="w-full py-2 px-4 rounded-lg bg-green-100 text-green-700 text-center mt-2">{success}</div>}
        </div>
      </div>
    </div>
  );
} 