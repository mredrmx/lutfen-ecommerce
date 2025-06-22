import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "ekinler_bas_vermeden_kor_buzagı_topallamazmıs";

async function getUserId(req: NextRequest) {
  // Önce Authorization header'ından token al
  const auth = req.headers.get("authorization");
  let token: string | null = auth;
  if (token && token.startsWith("Bearer ")) token = token.replace("Bearer ", "");
  
  // Eğer Authorization header'ında yoksa cookie'den al
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get('token')?.value || null;
  }
  
  if (!token) return null;
  
  try {
    const user = jwt.verify(token, JWT_SECRET) as { id: number };
    return user.id;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  const users = await prisma.user.findMany({
    where: { id: { not: userId } },
    select: { id: true, name: true, surname: true, email: true },
  });
  return NextResponse.json({ users });
} 