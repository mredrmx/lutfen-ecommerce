"use client";
import React, { useState, useEffect } from 'react';
import type { Address } from '@/app/addresses/page';
import Combobox from '@/components/ui/Combobox';
// import addressDataRaw from '@/lib/data/turkey-address.json'; // HATALI IMPORT KALDIRILDI

// Yeni, daha kapsamlı veri yapısı için tipler
interface Neighborhood {
  name: string;
  code: string;
}

interface District {
  name: string;
  neighborhoods: Neighborhood[];
}

interface County {
  name: string;
  districts: District[];
}

interface Province {
  name: string;
  counties: County[];
}

interface AddressData {
    provinces: Province[];
}

// const addressData: City[] = addressDataRaw as City[]; // Bu satır da kaldırıldı

type AddressPanelProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  onSaveAction: () => void;
  address: Address | null;
};

const XIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;

export default function AddressPanel({ isOpen, onCloseAction, onSaveAction, address }: AddressPanelProps) {
  const [addressData, setAddressData] = useState<Province[]>([]);
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    title: '', recipientName: '', recipientSurname: '', phone: '', city: '', district: '', neighborhood: '', fullAddress: ''
  });
  const [districts, setDistricts] = useState<string[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Adres verisini public klasöründen çek
  useEffect(() => {
    fetch('/turkey-address.json')
      .then(res => res.json())
      .then((data) => {
        // Hem dizi hem de {provinces: [...]} nesnesi için destek
        if (Array.isArray(data)) {
          setAddressData(data);
        } else if (data && Array.isArray(data.provinces)) {
          setAddressData(data.provinces);
        } else {
          setError("Adres verisi beklenen formatta değil.");
        }
      })
      .catch(err => {
        console.error("Adres verisi yüklenemedi:", err);
        setError("Adres verileri yüklenemedi. Lütfen daha sonra tekrar deneyin.");
      });
  }, []);

  // Adres düzenlenirken veya panel açıldığında formu ve seçim kutularını doldur
  useEffect(() => {
    if (isOpen && addressData.length > 0) {
      if (address) {
        setFormData(address);
        
        const provinceData = addressData.find(p => p.name === address.city);
        if (provinceData) {
            const countyList = provinceData.counties.map(c => c.name);
            setDistricts(countyList);

            const countyData = provinceData.counties.find(c => c.name === address.district);
            if (countyData) {
                const neighborhoodList = countyData.districts.flatMap(d => d.neighborhoods.map(n => n.name));
                setNeighborhoods(neighborhoodList.sort((a, b) => a.localeCompare(b, 'tr')));
            } else {
                setNeighborhoods([]);
            }
        } else {
            setDistricts([]);
            setNeighborhoods([]);
        }
      } else {
        // Yeni adres için formu sıfırla
        setFormData({ title: '', recipientName: '', recipientSurname: '', phone: '', city: '', district: '', neighborhood: '', fullAddress: '' });
        setDistricts([]);
        setNeighborhoods([]);
      }
    }
  }, [isOpen, address, addressData]);

  const handleComboboxChange = (name: 'city' | 'district' | 'neighborhood', value: string) => {
    if (name === "city") {
      setFormData(prev => ({ ...prev, city: value, district: '', neighborhood: '' }));
      const provinceData = addressData.find(p => p.name === value);
      setDistricts(provinceData?.counties.map(c => c.name) || []);
      setNeighborhoods([]);
    } else if (name === "district") {
      setFormData(prev => ({ ...prev, district: value, neighborhood: '' }));
      const provinceData = addressData.find(p => p.name === formData.city);
      const countyData = provinceData?.counties.find(c => c.name === value);
      if (countyData) {
        const neighborhoodList = countyData.districts.flatMap(d => d.neighborhoods.map(n => n.name));
        setNeighborhoods(neighborhoodList.sort((a, b) => a.localeCompare(b, 'tr')));
      } else {
        setNeighborhoods([]);
      }
    } else if (name === "neighborhood") {
        setFormData(prev => ({ ...prev, neighborhood: value }));
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = localStorage.getItem("token");
    const url = address ? `/api/addresses/${address.id}` : '/api/addresses';
    const method = address ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'İşlem başarısız.');
      }
      onSaveAction();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onCloseAction} />
      <div className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{address ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}</h2>
            <button onClick={onCloseAction} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><XIcon className="w-6 h-6" /></button>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="recipientName" placeholder="Ad" value={formData.recipientName} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <input name="recipientSurname" placeholder="Soyad" value={formData.recipientSurname} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <input name="phone" placeholder="Telefon" value={formData.phone} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <input name="title" placeholder="Adres Başlığı (örn: Ev, İş)" value={formData.title} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"/>

              <Combobox
                items={addressData.map(p => p.name)}
                value={formData.city}
                onChange={(value) => handleComboboxChange('city', value)}
                placeholder={addressData.length > 0 ? "Şehir ara veya seç" : "Yükleniyor..."}
                disabled={addressData.length === 0}
              />
              
              <Combobox
                items={districts}
                value={formData.district}
                onChange={(value) => handleComboboxChange('district', value)}
                placeholder="İlçe ara veya seç"
                disabled={!formData.city || districts.length === 0}
              />

              <Combobox
                items={neighborhoods}
                value={formData.neighborhood}
                onChange={(value) => handleComboboxChange('neighborhood', value)}
                placeholder="Mahalle/Köy ara veya seç"
                disabled={!formData.district || neighborhoods.length === 0}
              />

              <textarea name="fullAddress" placeholder="Açık Adres (Sokak, Bina No, Daire No vb.)" value={formData.fullAddress} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3}/>
              
              {error && <p className="text-red-500">{error}</p>}

              <button type="submit" disabled={loading} className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400">
                {loading ? 'Kaydediliyor...' : 'Adresi Kaydet'}
              </button>
            </form>
          </main>
        </div>
      </div>
    </>
  );
}
