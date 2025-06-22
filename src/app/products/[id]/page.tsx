"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const productId = params.id as string;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
          setSelectedImage(data.product.imageUrl);
        } else {
          router.push("/products");
        }
      } catch (error) {
        console.error("Ürün yüklenirken hata:", error);
        router.push("/products");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, router]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!selectedSize) {
      alert("Lütfen bir boyut seçin");
      return;
    }
    
    if (!selectedColor) {
      alert("Lütfen bir renk seçin");
      return;
    }

    addToCart(product, 1, selectedColor, selectedSize);
  };

  const colors = product ? JSON.parse(product.colors || "[]") : [];
  const sizes = product ? JSON.parse(product.sizes || "[]") : [];
  const images = product ? JSON.parse(product.images || "[]") : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 flex items-center justify-center">
        <div className="text-2xl text-blue-600 dark:text-blue-400">Yükleniyor...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 flex items-center justify-center">
        <div className="text-2xl text-red-600 dark:text-red-400">Ürün bulunamadı</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-4 md:mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <button 
                onClick={() => router.push("/products")}
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                Ürünler
              </button>
            </li>
            <li>/</li>
            <li className="text-gray-900 dark:text-white truncate">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
          {/* Ürün Görselleri */}
          <div className="space-y-4">
            {/* Ana Görsel */}
            <div className="aspect-square bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <img 
                src={selectedImage} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Küçük Görseller */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                <div 
                  className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${
                    selectedImage === product.imageUrl 
                      ? "border-blue-600" 
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                  onClick={() => setSelectedImage(product.imageUrl)}
                >
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                {images.map((image: string, index: number) => (
                  <div 
                    key={index}
                    className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${
                      selectedImage === image 
                        ? "border-blue-600" 
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ürün Bilgileri */}
          <div className="space-y-4 md:space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h1>
              <p className="text-base md:text-lg text-blue-600 dark:text-blue-400 font-semibold mb-2">
                {product.brand}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {product.category}
              </p>
            </div>

            <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
              {product.price} ₺
            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>

            {/* Renk Seçimi */}
            {colors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Renk Seçin
                </h3>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        selectedColor === color
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Boyut Seçimi */}
            {sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Boyut Seçin
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 rounded-lg border-2 transition-colors ${
                        selectedSize === size
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stok Durumu */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Stok Durumu: <span className="font-semibold">{product.stock} adet</span>
            </div>

            {/* Sepete Ekle Butonu */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors ${
                product.stock === 0
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              {product.stock === 0 ? "Stokta Yok" : "Sepete Ekle"}
            </button>

            {/* Ürün Özellikleri */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Ürün Özellikleri
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Marka:</span>
                  <span className="font-medium">{product.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Kategori:</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Mevcut Renkler:</span>
                  <span className="font-medium">{colors.join(", ") || "Belirtilmemiş"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Mevcut Boyutlar:</span>
                  <span className="font-medium">{sizes.join(", ") || "Belirtilmemiş"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 