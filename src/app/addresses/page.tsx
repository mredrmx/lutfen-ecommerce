"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import AddressPanel from "@/components/AddressPanel";
import AccountLayout from "@/components/AccountLayout";

// Tiplerimizi tanımlayalım
export type Address = {
  id: number;
  title: string;
  recipientName: string;
  recipientSurname: string;
  phone: string;
  city: string;
  district: string;
  neighborhood: string;
  fullAddress: string;
};

// İkonlar
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
const EditIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;


export default function AddressesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const fetchAddresses = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch("/api/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Adresler yüklenemedi.");
      const data = await res.json();
      setAddresses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      router.push("/login?returnUrl=/addresses");
    } else {
      fetchAddresses();
    }
  }, [user, router, fetchAddresses]);

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsPanelOpen(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsPanelOpen(true);
  };

  const handlePanelCloseAction = () => {
    setIsPanelOpen(false);
    setEditingAddress(null);
  };
  
  const handleSaveAction = () => {
    handlePanelCloseAction();
    fetchAddresses(); // Listeyi yenile
  };

  return (
    <>
      <AccountLayout>
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Adreslerim</h1>
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Yeni Adres Ekle</span>
            </button>
        </div>
        
        {loading && <p>Yükleniyor...</p>}
        
        {!loading && addresses.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <p className="text-gray-500">Kayıtlı adresiniz bulunmamaktadır.</p>
          </div>
        )}

        {!loading && addresses.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div key={address.id} className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 rounded-lg p-5 flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <HomeIcon className="w-8 h-8 mt-1 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div>
                    <h2 className="font-bold text-lg text-gray-900 dark:text-white">{address.title}</h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">{address.recipientName} {address.recipientSurname}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{address.fullAddress}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{address.neighborhood}, {address.district}, {address.city}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{address.phone}</p>
                  </div>
                </div>
                <button onClick={() => handleEdit(address)} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">
                  <EditIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </AccountLayout>
      <AddressPanel
        isOpen={isPanelOpen}
        onCloseAction={handlePanelCloseAction}
        onSaveAction={handleSaveAction}
        address={editingAddress}
      />
    </>
  );
} 