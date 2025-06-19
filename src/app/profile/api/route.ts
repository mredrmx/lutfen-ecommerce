import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "ekinler_bas_vermeden_kor_buzagı_topallamazmıs";

function getUserFromToken(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) return null;
  const token = auth.replace("Bearer ", "");
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: string };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const userData = getUserFromToken(req);
  if (!userData) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: userData.id },
    select: { id: true, name: true, surname: true, email: true, role: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
  }
  return NextResponse.json({ user });
}

export async function PUT(req: NextRequest) {
  const userData = getUserFromToken(req);
  if (!userData) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
  const { name, surname, email } = await req.json();
  if (!name || !surname || !email) {
    return NextResponse.json({ error: "Tüm alanlar zorunludur." }, { status: 400 });
  }
  const user = await prisma.user.update({
    where: { id: userData.id },
    data: { name, surname, email },
    select: { id: true, name: true, surname: true, email: true, role: true },
  });
  return NextResponse.json({ user });
} 