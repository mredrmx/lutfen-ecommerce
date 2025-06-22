"use client";
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Tipleri tanımlayalım
type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  brand?: string;
  category?: string;
  selectedSize?: string;
  selectedColor?: string;
};

export interface CartItem extends Product {
  quantity: number;
  color?: string;
  size?: string;
}

// Context'in state ve fonksiyon tipleri
interface ICartContext {
  cartItems: CartItem[];
  isCartOpen: boolean;
  addToCart: (product: Product, quantity: number, color?: string, size?: string) => void;
  removeFromCart: (productId: number, color?: string, size?: string) => void;
  clearCart: () => void;
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

  const addToCart = (product: Product, quantity: number, color?: string, size?: string) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => 
        item.id === product.id && 
        item.color === color && 
        item.size === size
      );
      
      if (existingItem) {
        // Ürün zaten sepetteyse, miktarını artır
        return prevItems.map(item =>
          item.id === product.id && 
          item.color === color && 
          item.size === size
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      // Ürün sepette değilse, yeni bir item olarak ekle
      return [...prevItems, { ...product, quantity, color, size }];
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const removeFromCart = (productId: number, color?: string, size?: string) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => 
        item.id === productId && 
        item.color === color && 
        item.size === size
      );
      
      if (existingItem?.quantity === 1) {
        // Miktar 1 ise, ürünü sepetten tamamen çıkar
        return prevItems.filter(item => 
          !(item.id === productId && 
            item.color === color && 
            item.size === size)
        );
      }
      // Miktar 1'den fazlaysa, miktarını azalt
      return prevItems.map(item =>
        item.id === productId && 
        item.color === color && 
        item.size === size
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      );
    });
  };
  
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, isCartOpen, toggleCart, addToCart, removeFromCart, getCartTotal, getItemCount, clearCart }}>
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