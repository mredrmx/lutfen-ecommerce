"use client";
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Tipleri tanımlayalım
type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
};

type CartItem = Product & {
  quantity: number;
};

// Context'in state ve fonksiyon tipleri
interface ICartContext {
  cartItems: CartItem[];
  isCartOpen: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  toggleCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

// Context'i oluşturalım (başlangıç değeri undefined)
const CartContext = createContext<ICartContext | undefined>(undefined);

// Provider bileşeni
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sayfa ilk yüklendiğinde localStorage'dan sepeti yükle
  useEffect(() => {
    try {
      const localData = localStorage.getItem('cart');
      if (localData) {
        setCartItems(JSON.parse(localData));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
    }
  }, []);

  // Sepet her değiştiğinde localStorage'ı güncelle
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // Ürün zaten sepetteyse, miktarını artır
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Ürün sepette değilse, yeni bir item olarak ekle
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === productId);
        if (existingItem?.quantity === 1) {
            // Miktar 1 ise, ürünü sepetten tamamen çıkar
            return prevItems.filter(item => item.id !== productId);
        }
        // Miktar 1'den fazlaysa, miktarını azalt
        return prevItems.map(item =>
            item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
    });
  };
  
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, isCartOpen, toggleCart, addToCart, removeFromCart, getCartTotal, getItemCount }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook: Context'i daha kolay kullanmak için
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 