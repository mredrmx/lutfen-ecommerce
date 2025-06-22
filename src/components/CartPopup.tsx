"use client";
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

// Gerekli ikonlar
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);
const MinusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
);

export default function CartPopup() {
  const { isCartOpen, toggleCart, cartItems, addToCart, removeFromCart, getCartTotal } = useCart();
  const FREE_SHIPPING_THRESHOLD = 1000;
  const total = getCartTotal();
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - total;

  return (
    <>
      {/* Arka plan overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleCart}
      />
      {/* Sepet paneli */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold">Sepetim</h2>
                <button onClick={toggleCart} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <XIcon className="w-6 h-6" />
                </button>
            </header>
            
            {/* Kargo Barı */}
            {cartItems.length > 0 && (
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 text-sm">
                    {remainingForFreeShipping > 0 ? (
                        <p>
                            <span className="font-bold">₺{remainingForFreeShipping.toFixed(2)}</span> daha harcayın ve ücretsiz gönderi kazanın!
                        </p>
                    ) : (
                        <p className="font-bold text-green-600">Ücretsiz gönderiye hak kazandınız!</p>
                    )}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}></div>
                    </div>
                </div>
            )}
            
            {/* Ürün Listesi */}
            <main className="flex-1 overflow-y-auto p-4">
                {cartItems.length === 0 ? (
                    <div className="text-center mt-20">
                        <p className="text-gray-500 mb-4">Sepetinizde ürün bulunmamaktadır.</p>
                        <button onClick={toggleCart} className="px-6 py-3 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors">
                            Alışverişe Devam Et
                        </button>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {cartItems.map(item => (
                            <li key={item.id} className="flex gap-4">
                                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                                <div className="flex-1">
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p className="text-gray-500 text-sm">₺{item.price.toFixed(2)}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <button onClick={() => removeFromCart(item.id)} className="p-1 border rounded-full"><MinusIcon className="w-4 h-4" /></button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => addToCart(item)} className="p-1 border rounded-full"><PlusIcon className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <p className="font-semibold">₺{(item.price * item.quantity).toFixed(2)}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
            
            {/* Footer */}
            {cartItems.length > 0 && (
                <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Toplam</span>
                        <span className="text-xl font-bold">₺{total.toFixed(2)}</span>
                    </div>
                    <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
                        Siparişi Tamamla
                    </button>
                </footer>
            )}
        </div>
      </div>
    </>
  );
} 