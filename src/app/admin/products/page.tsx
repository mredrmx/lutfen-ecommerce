"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  featured: boolean;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ 
    name: "", 
    description: "", 
    price: 0, 
    stock: 0, 
    imageUrl: "", 
    featured: false 
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        throw new Error("Ürünler yüklenirken bir hata oluştu.");
      }
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      setError("Ürünler yüklenirken bir hata oluştu.");
      setTimeout(() => setError(""), 3000);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === "number" ? Number(e.target.value) : 
                  e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : 
                  e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); setSuccess("");
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/admin/products?id=${editingId}` : "/api/admin/products";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        const data = await res.json();
        throw new Error(data.error || "Bir hata oluştu.");
      }
      
      setSuccess(editingId ? "Ürün güncellendi." : "Ürün eklendi.");
      setTimeout(() => setSuccess(""), 3000);
      setForm({ name: "", description: "", price: 0, stock: 0, imageUrl: "", featured: false });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setForm(product);
    setEditingId(product.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        throw new Error("Silme işlemi başarısız oldu.");
      }
      fetchProducts();
    } catch (err) {
      setError("Silme işlemi başarısız oldu.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const toggleFeatured = async (id: number, currentFeatured: boolean) => {
    try {
      const product = products.find(p => p.id === id);
      if (!product) return;
      
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, featured: !currentFeatured }),
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        throw new Error("Güncelleme başarısız oldu.");
      }
      
      fetchProducts();
    } catch (err) {
      setError("Öne çıkarma durumu güncellenemedi.");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-300">Ürün Yönetimi</h2>
          <Link href="/admin" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm md:text-base">
            Admin Paneline Dön
          </Link>
        </div>
        
        <form className="space-y-4 mb-6 md:mb-8" onSubmit={handleSubmit}>
          <input 
            name="name" 
            type="text" 
            placeholder="Ürün Adı" 
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base" 
            required 
            value={form.name} 
            onChange={handleChange} 
          />
          <textarea 
            name="description" 
            placeholder="Açıklama" 
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base" 
            required 
            value={form.description} 
            onChange={handleChange} 
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              name="price" 
              type="number" 
              placeholder="Fiyat" 
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base" 
              required 
              value={form.price} 
              onChange={handleChange} 
            />
            <input 
              name="stock" 
              type="number" 
              placeholder="Stok" 
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base" 
              required 
              value={form.stock} 
              onChange={handleChange} 
            />
            <div className="flex items-center space-x-2">
              <input 
                name="featured" 
                type="checkbox" 
                id="featured"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                checked={form.featured} 
                onChange={handleChange} 
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Öne Çıkan
              </label>
            </div>
          </div>
          <input 
            name="imageUrl" 
            type="text" 
            placeholder="Görsel URL" 
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base" 
            required 
            value={form.imageUrl} 
            onChange={handleChange} 
          />
          <button 
            type="submit" 
            className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-md text-sm md:text-base" 
            disabled={loading}
          >
            {loading ? (editingId ? "Güncelleniyor..." : "Ekleniyor...") : (editingId ? "Güncelle" : "Ekle")}
          </button>
        </form>
        
        {error && <div className="w-full py-2 px-4 rounded-lg bg-red-100 text-red-700 text-center mb-4 text-sm md:text-base">{error}</div>}
        {success && <div className="w-full py-2 px-4 rounded-lg bg-green-100 text-green-700 text-center mb-4 text-sm md:text-base">{success}</div>}
        
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-blue-50 dark:bg-blue-900">
              <tr>
                <th className="px-2 md:px-4 py-2 text-xs md:text-sm">Ad</th>
                <th className="px-2 md:px-4 py-2 text-xs md:text-sm">Fiyat</th>
                <th className="px-2 md:px-4 py-2 text-xs md:text-sm">Stok</th>
                <th className="px-2 md:px-4 py-2 text-xs md:text-sm">Öne Çıkan</th>
                <th className="px-2 md:px-4 py-2 text-xs md:text-sm">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="px-2 md:px-4 py-2 text-xs md:text-sm">{p.name}</td>
                  <td className="px-2 md:px-4 py-2 text-xs md:text-sm">₺{p.price}</td>
                  <td className="px-2 md:px-4 py-2 text-xs md:text-sm">{p.stock}</td>
                  <td className="px-2 md:px-4 py-2">
                    <button 
                      onClick={() => toggleFeatured(p.id, p.featured)}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        p.featured 
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {p.featured ? 'Evet' : 'Hayır'}
                    </button>
                  </td>
                  <td className="px-2 md:px-4 py-2">
                    <div className="flex flex-col sm:flex-row gap-1">
                      <button 
                        className="rounded-lg px-2 md:px-3 py-1 md:py-1.5 bg-blue-500 text-white hover:bg-blue-600 transition text-xs md:text-sm" 
                        onClick={() => handleEdit(p)}
                      >
                        Düzenle
                      </button>
                      <button 
                        className="rounded-lg px-2 md:px-3 py-1 md:py-1.5 bg-red-500 text-white hover:bg-red-600 transition text-xs md:text-sm" 
                        onClick={() => handleDelete(p.id)}
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 