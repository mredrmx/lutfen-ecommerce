"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

type OrderItem = {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    name: string;
  };
};

type Order = {
  id: number;
  userId: number;
  status: string;
  createdAt: string;
  user: {
    name: string;
    surname: string;
    email: string;
  };
  items: OrderItem[];
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        throw new Error("Siparişler yüklenirken bir hata oluştu.");
      }
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError("Siparişler yüklenirken bir hata oluştu.");
      setTimeout(() => setError(""), 3000);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders?id=${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        throw new Error("Durum güncellenirken bir hata oluştu.");
      }

      setSuccess("Sipariş durumu güncellendi.");
      setTimeout(() => setSuccess(""), 3000);
      fetchOrders();
    } catch (err) {
      setError("Durum güncellenirken bir hata oluştu.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Onaylandı": return "bg-green-100 text-green-800";
      case "Gönderildi": return "bg-blue-100 text-blue-800";
      case "İptal Edildi": return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300">Sipariş Yönetimi</h1>
          <Link href="/admin" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
            Admin Paneline Dön
          </Link>
        </div>

        {error && <div className="w-full py-2 px-4 rounded-lg bg-red-100 text-red-700 text-center mb-4">{error}</div>}
        {success && <div className="w-full py-2 px-4 rounded-lg bg-green-100 text-green-700 text-center mb-4">{success}</div>}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sipariş No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Müşteri</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ürünler</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Toplam</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <div>{order.user.name} {order.user.surname}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{order.user.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      <ul>
                        {order.items.map((item) => (
                          <li key={item.id}>
                            {item.product.name} x {item.quantity} ({item.price} ₺)
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {order.items.reduce((total, item) => total + item.price * item.quantity, 0)} ₺
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="Beklemede">Beklemede</option>
                        <option value="Onaylandı">Onaylandı</option>
                        <option value="Gönderildi">Gönderildi</option>
                        <option value="İptal Edildi">İptal Edildi</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 