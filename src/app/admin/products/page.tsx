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
  brand: string;
  category: string;
  colors: string;
  sizes: string;
  images: string;
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
    brand: "",
    category: "",
    colors: "",
    sizes: "",
    images: "",
    featured: false 
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categories = ["Spor", "Günlük", "Resmi", "Casual", "Outdoor"];
  const brands = ["Nike", "Adidas", "Puma", "Reebok", "New Balance", "Converse", "Vans", "Skechers"];

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      setForm({ 
        name: "", 
        description: "", 
        price: 0, 
        stock: 0, 
        imageUrl: "", 
        brand: "",
        category: "",
        colors: "",
        sizes: "",
        images: "",
        featured: false 
      });
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
          <h2 className="text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-300">Ayakkabı Ürün Yönetimi</h2>
          <Link href="/admin" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm md:text-base">
            Admin Paneline Dön
          </Link>
        </div>
        
        <form className="space-y-4 mb-6 md:mb-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              name="name" 
              type="text" 
              placeholder="Ürün Adı" 
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base" 
              required 
              value={form.name} 
              onChange={handleChange} 
            />
            <select
              name="brand"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base"
              required
              value={form.brand}
              onChange={handleChange}
            >
              <option value="">Marka Seçin</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          
          <textarea 
            name="description" 
            placeholder="Açıklama" 
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base" 
            required 
            value={form.description} 
            onChange={handleChange} 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <select
              name="category"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base"
              required
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Kategori Seçin</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              name="imageUrl" 
              type="text" 
              placeholder="Ana Görsel URL" 
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base" 
              required 
              value={form.imageUrl} 
              onChange={handleChange} 
            />
            <input 
              name="images" 
              type="text" 
              placeholder="Ek Görseller (JSON array)" 
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base" 
              value={form.images} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              name="colors" 
              type="text" 
              placeholder="Renkler (JSON array: ['Kırmızı', 'Mavi'])" 
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base" 
              value={form.colors} 
              onChange={handleChange} 
            />
            <input 
              name="sizes" 
              type="text" 
              placeholder="Boyutlar (JSON array: ['36', '37', '38'])" 
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base" 
              value={form.sizes} 
              onChange={handleChange} 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
          >
            {loading ? "İşleniyor..." : (editingId ? "Güncelle" : "Ekle")}
          </button>
        </form>

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/20 border border-green-400 text-green-700 dark:text-green-400 rounded-lg">
            {success}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2">Görsel</th>
                <th className="text-left py-3 px-2">Ad</th>
                <th className="text-left py-3 px-2">Marka</th>
                <th className="text-left py-3 px-2">Kategori</th>
                <th className="text-left py-3 px-2">Fiyat</th>
                <th className="text-left py-3 px-2">Stok</th>
                <th className="text-left py-3 px-2">Öne Çıkan</th>
                <th className="text-left py-3 px-2">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-2">
                    <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded" />
                  </td>
                  <td className="py-3 px-2 font-medium">{product.name}</td>
                  <td className="py-3 px-2">{product.brand}</td>
                  <td className="py-3 px-2">{product.category}</td>
                  <td className="py-3 px-2">{product.price} ₺</td>
                  <td className="py-3 px-2">{product.stock}</td>
                  <td className="py-3 px-2">
                    <button
                      onClick={() => toggleFeatured(product.id, product.featured)}
                      className={`px-2 py-1 rounded text-xs ${
                        product.featured
                          ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {product.featured ? "Evet" : "Hayır"}
                    </button>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
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