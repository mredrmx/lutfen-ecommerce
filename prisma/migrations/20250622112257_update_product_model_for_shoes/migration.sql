/*
  Warnings:

  - Added the required column `brand` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `colors` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `images` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sizes` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "stock" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "brand" TEXT NOT NULL DEFAULT 'Genel',
    "category" TEXT NOT NULL DEFAULT 'Günlük',
    "colors" TEXT NOT NULL DEFAULT '[]',
    "sizes" TEXT NOT NULL DEFAULT '[]',
    "images" TEXT NOT NULL DEFAULT '[]',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("createdAt", "description", "featured", "id", "imageUrl", "name", "price", "stock", "updatedAt", "brand", "category", "colors", "sizes", "images") SELECT "createdAt", "description", "featured", "id", "imageUrl", "name", "price", "stock", "updatedAt", 'Genel', 'Günlük', '[]', '[]', '[]' FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
