"use client";
import React, { useEffect, useState } from "react";

type Order = {
  id: number;
  status: string;
  createdAt: string;
  items: { id: number; product: { name: string }; quantity: number; price: number }[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchOrders = async () => {
    if (!token) return;
    const res = await fetch("/api/orders", { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (res.ok) setOrders(data.orders || []);
    else setError(data.error || "Bir hata oluştu.");
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
        <h2 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-300 text-center">Siparişlerim</h2>
        {error && <div className="w-full py-2 px-4 rounded-lg bg-red-100 text-red-700 text-center mb-2">{error}</div>}
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-blue-50 dark:bg-blue-900">
              <tr>
                <th className="px-4 py-2">Ürünler</th>
                <th className="px-4 py-2">Durum</th>
                <th className="px-4 py-2">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="px-4 py-2">
                    {o.items.map((item) => (
                      <div key={item.id}>
                        {item.product.name} x{item.quantity} <span className="text-xs">({item.price} ₺)</span>
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-2">{o.status}</td>
                  <td className="px-4 py-2">{new Date(o.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 