"use client";
import React from 'react';
import AccountLayout from '@/components/AccountLayout';

const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

export default function WishlistPage() {
  return (
    <AccountLayout>
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">İstek Listem</h1>
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <HeartIcon className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">İstek Listeniz Boş</h2>
        <p className="text-gray-500 mt-2">Beğendiğiniz ürünleri kalp ikonuna tıklayarak listenize ekleyebilirsiniz.</p>
      </div>
    </AccountLayout>
  );
} 