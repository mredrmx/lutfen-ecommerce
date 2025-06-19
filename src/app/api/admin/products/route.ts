import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "ekinler_bas_vermeden_kor_buzagı_topallamazmıs";

function isAdmin(req: NextRequest) {
  const auth = req.headers.get("authorization") || req.cookies.get("token")?.value;
  if (!auth) return false;
  let token = auth;
  if (token.startsWith("Bearer ")) token = token.replace("Bearer ", "");
  try {
    const user = jwt.verify(token, JWT_SECRET) as { role: string };
    return user.role === "admin";
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json(
      { error: "Ürünler yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  try {
    const { name, description, price, stock, imageUrl, featured } = await req.json();
    if (!name || !description || !price || !stock || !imageUrl) {
      return NextResponse.json({ error: "Tüm alanlar zorunludur." }, { status: 400 });
    }
    const product = await prisma.product.create({ 
      data: { 
        name, 
        description, 
        price: Number(price), 
        stock: Number(stock), 
        imageUrl,
        featured: Boolean(featured)
      } 
    });
    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json(
      { error: "Ürün eklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    const { name, description, price, stock, imageUrl, featured } = await req.json();
    if (!id || !name || !description || !price || !stock || !imageUrl) {
      return NextResponse.json({ error: "Tüm alanlar zorunludur." }, { status: 400 });
    }
    const product = await prisma.product.update({ 
      where: { id }, 
      data: { 
        name, 
        description, 
        price: Number(price), 
        stock: Number(stock), 
        imageUrl,
        featured: Boolean(featured)
      } 
    });
    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json(
      { error: "Ürün güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "ID zorunlu." }, { status: 400 });
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Ürün silinirken bir hata oluştu." },
      { status: 500 }
    );
  }
} 