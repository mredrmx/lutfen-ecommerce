import React from 'react';

const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 p-4 md:p-8">
      <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
        <div className="text-center">
            <HeartIcon className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <h1 className="text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-300 mb-4">
                Favori Listem
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
                Bu özellik şu anda geliştirme aşamasındadır. Yakında favori ürünlerinizi buraya ekleyebileceksiniz!
            </p>
        </div>
        {/* Gelecekte buraya favori ürünlerin listesi gelecek */}
      </div>
    </div>
  );
} 