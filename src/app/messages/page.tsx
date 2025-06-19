"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = { id: number; name: string; surname: string; email: string };
type Message = { id: number; sender: User; receiver: User; content: string; createdAt: string };

export default function MessagesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [form, setForm] = useState({ receiverId: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("token");
      console.log("Token kontrolü:", t ? "Token var" : "Token yok");
      if (t) {
        console.log("Token bulundu, geçerliliği kontrol ediliyor...");
        // Token'ın geçerliliğini kontrol et
        try {
          const payload = JSON.parse(atob(t.split('.')[1]));
          const now = Math.floor(Date.now() / 1000);
          console.log("Token süresi:", payload.exp, "Şu an:", now);
          if (payload.exp < now) {
            console.log("Token süresi dolmuş, siliniyor");
            localStorage.removeItem("token");
            router.push("/login?returnUrl=/messages");
            return;
          }
          console.log("Token geçerli, mesajlar yükleniyor");
          setToken(t);
        } catch (error) {
          console.log("Token decode hatası:", error);
          localStorage.removeItem("token");
          router.push("/login?returnUrl=/messages");
        }
      } else {
        console.log("Token bulunamadı, login sayfasına yönlendiriliyor");
        router.push("/login?returnUrl=/messages");
      }
    }
  }, [router]);

  useEffect(() => {
    if (!token) return;
    fetchUsers();
    fetchMessages();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/messages/users", { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          router.push("/login?returnUrl=/messages");
          return;
        }
        throw new Error("Kullanıcılar yüklenemedi");
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Kullanıcılar yükleme hatası:", err);
      setError("Kullanıcılar yüklenirken bir hata oluştu");
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages", { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          router.push("/login?returnUrl=/messages");
          return;
        }
        throw new Error("Mesajlar yüklenemedi");
      }
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Mesajlar yükleme hatası:", err);
      setError("Mesajlar yüklenirken bir hata oluştu");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
      router.push("/login?returnUrl=/messages");
      return;
    }

    setLoading(true);
    setError(""); 
    setSuccess("");
    
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          receiverId: Number(form.receiverId), 
          content: form.content 
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          router.push("/login?returnUrl=/messages");
          return;
        }
        setError(data.error || "Bir hata oluştu.");
        setTimeout(() => setError(""), 3000);
      } else {
        setSuccess("Mesaj gönderildi.");
        setTimeout(() => setSuccess(""), 3000);
        setForm({ receiverId: "", content: "" });
        fetchMessages();
      }
    } catch (err) {
      console.error("Mesaj gönderme hatası:", err);
      setError("Mesaj gönderilirken bir hata oluştu");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 p-4 md:p-8">
      <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-700 dark:text-blue-300 text-center">Mesajlarım</h2>
        
        <form className="space-y-4 mb-6 md:mb-8" onSubmit={handleSubmit}>
          <select 
            name="receiverId" 
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base" 
            required 
            value={form.receiverId} 
            onChange={handleChange}
          >
            <option value="">Kime mesaj göndereceksiniz?</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} {u.surname} ({u.email})
              </option>
            ))}
          </select>
          
          <textarea 
            name="content" 
            placeholder="Mesajınız" 
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base" 
            required 
            value={form.content} 
            onChange={handleChange} 
          />
          
          <button 
            type="submit" 
            className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-md text-sm md:text-base" 
            disabled={loading}
          >
            {loading ? "Gönderiliyor..." : "Gönder"}
          </button>
        </form>
        
        {error && (
          <div className="w-full py-2 px-4 rounded-lg bg-red-100 text-red-700 text-center mb-4 text-sm md:text-base">
            {error}
          </div>
        )}
        
        {success && (
          <div className="w-full py-2 px-4 rounded-lg bg-green-100 text-green-700 text-center mb-4 text-sm md:text-base">
            {success}
          </div>
        )}
        
        <div className="overflow-y-auto max-h-96 space-y-4">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm md:text-base">
              Henüz mesajınız yok.
            </p>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.sender.id === users[0]?.id ? "items-end" : "items-start"}`}>
                <div className="text-xs text-gray-500 mb-1">
                  {m.sender.name} {m.sender.surname} 
                  <span className="ml-1">({new Date(m.createdAt).toLocaleString()})</span>
                </div>
                <div className={`px-4 py-2 rounded-lg shadow text-sm md:text-base ${
                  m.sender.id === users[0]?.id 
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100" 
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                }`}>
                  {m.content}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 