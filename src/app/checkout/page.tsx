"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// İkonlar
const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

interface Address {
  id: number;
  title: string;
  recipientName: string;
  recipientSurname: string;
  phone: string;
  city: string;
  district: string;
  neighborhood: string;
  fullAddress: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  imageUrl?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login?returnUrl=/checkout");
      return;
    }
    // Adresleri çek
    const fetchAddresses = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("/api/addresses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Adresler yüklenemedi.");
        const data = await res.json();
        setAddresses(data);
        if (data.length > 0) setSelectedAddressId(data[0].id);
      } catch (err) {
        setError("Adresler yüklenemedi.");
      }
    };
    fetchAddresses();
    // Sepeti localStorage'dan çek
    const cart = localStorage.getItem("cart");
    if (cart) setCartItems(JSON.parse(cart));
  }, [user, router]);

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
  };

  const handleOrder = async () => {
    if (!selectedAddressId) {
      setError("Lütfen bir adres seçin.");
      return;
    }
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            color: item.color,
            size: item.size,
          })),
          addressId: selectedAddressId,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Sipariş oluşturulamadı.");
      }
      setSuccess(true);
      localStorage.removeItem("cart");
      setTimeout(() => router.push("/orders"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-10 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-900 dark:text-white">Ödeme & Sipariş Tamamlama</h1>
      
      {error && (
        <div className="mb-4 md:mb-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 md:mb-6 p-4 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg">
          Siparişiniz başarıyla oluşturuldu!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Sol Taraf - Adres Seçimi */}
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">Teslimat Adresi</h2>
            <a 
              href="/addresses" 
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              Adres Ekle
            </a>
          </div>
          
          {addresses.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <HomeIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">Kayıtlı adresiniz bulunmamaktadır.</p>
              <a 
                href="/addresses" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Adres Ekle
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    selectedAddressId === address.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                  onClick={() => setSelectedAddressId(address.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {selectedAddressId === address.id ? (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <CheckIcon className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <HomeIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">{address.title}</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-1">
                        {address.recipientName} {address.recipientSurname}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                        {address.fullAddress}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {address.neighborhood}, {address.district}, {address.city}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                        📞 {address.phone}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sağ Taraf - Sepet Özeti */}
        <div className="space-y-4 md:space-y-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">Sipariş Özeti</h2>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">Sepetiniz boş.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">Ürünler</h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center gap-4">
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0" 
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.quantity} x ₺{Number(item.price).toFixed(2)}
                      </p>
                      {(item.size || item.color) && (
                        <div className="text-xs text-gray-400 mt-1">
                          {item.size && <span className="mr-2">Beden: {item.size}</span>}
                          {item.color && <span>Renk: {item.color}</span>}
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      ₺{((Number(item.price) || 0) * (Number(item.quantity) || 0)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex justify-between items-center text-lg font-bold text-gray-900 dark:text-white">
                  <span>Toplam</span>
                  <span>₺{getCartTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Siparişi Tamamla Butonu */}
          <button
            onClick={handleOrder}
            disabled={loading || !selectedAddressId || cartItems.length === 0}
            className="w-full py-3 md:py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base md:text-lg"
          >
            {loading ? "Sipariş oluşturuluyor..." : "Siparişi Tamamla"}
          </button>
        </div>
      </div>
    </div>
  );
} 