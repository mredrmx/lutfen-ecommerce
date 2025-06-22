"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext'; // Auth context'i import et

// Bu simgeleri daha sonra ekleyeceğiz
const MessageSquareIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);


type User = { id: number; name: string; surname: string; email: string };
type Message = { id: number; senderId: number; receiverId: number; content: string; createdAt: string };
type CurrentUser = { id: number; email: string; role: string } | null;


export default function ChatPopup() {
  const { user } = useAuth(); // Kullanıcı bilgisini context'ten al
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Sadece token'ı al
    const t = localStorage.getItem('token');
    setToken(t);
  }, [user]); // user değiştiğinde token'ı tekrar al

  const fetchUsers = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/messages/users", { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (!res.ok) throw new Error("Kullanıcılar yüklenemedi");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu.");
    }
  };

  const fetchMessages = async (userId: number) => {
    if (!token) return;
    try {
      // TODO: Belirli bir kullanıcıyla olan mesajları getirecek API endpoint'i gerekiyor.
      // Şimdilik tüm mesajları getiriyoruz.
      const res = await fetch("/api/messages", { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (!res.ok) throw new Error("Mesajlar yüklenemedi");
      const data = await res.json();
      // Gelen mesajları ilgili kullanıcıya göre filtrele
      const filteredMessages = data.messages.filter(
        (m: Message) => (m.senderId === user?.id && m.receiverId === userId) || (m.senderId === userId && m.receiverId === user?.id)
      );
      setMessages(filteredMessages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu.");
    }
  };
  
  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    fetchMessages(user.id);
  };
  
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedUser || !content.trim()) return;

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          receiverId: selectedUser.id, 
          content: content 
        }),
      });
      
      if (!res.ok) throw new Error("Mesaj gönderilemedi");

      setContent('');
      fetchMessages(selectedUser.id); // Mesajları yenile
    } catch (err) {
        setError(err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu.");
    }
  };

  useEffect(() => {
    if (isOpen && user) { // Sadece kullanıcı varsa ve pencere açıksa çalıştır
      fetchUsers();
    }
  }, [isOpen, user]);

  if (!user) return null; // Kullanıcı yoksa bileşeni render etme

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        aria-label="Mesajları Aç"
      >
        <MessageSquareIcon className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700">
          <header className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
            {selectedUser ? (
               <button onClick={() => setSelectedUser(null)} className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                 &lt; Geri
               </button>
            ) : (
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Kullanıcılar</h3>
            )}
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
              <XIcon className="h-5 w-5" />
            </button>
          </header>

          <main className="flex-1 overflow-y-auto p-2">
            {!selectedUser ? (
              // Kullanıcı Listesi
              <ul>
                {users.map(user => (
                  <li key={user.id} onClick={() => handleUserSelect(user)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer">
                    {user.name} {user.surname}
                  </li>
                ))}
              </ul>
            ) : (
              // Mesajlaşma Ekranı
              <div className="flex flex-col space-y-2">
                 {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs px-3 py-2 rounded-lg ${msg.senderId === user.id ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100'}`}>
                           {msg.content}
                        </div>
                    </div>
                 ))}
              </div>
            )}
          </main>

          {selectedUser && (
            <footer className="p-2 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={sendMessage} className="flex items-center">
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Mesaj yaz..."
                  className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none"
                />
                <button type="submit" className="ml-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                  <SendIcon className="h-5 w-5" />
                </button>
              </form>
            </footer>
          )}
        </div>
      )}
    </div>
  );
} 