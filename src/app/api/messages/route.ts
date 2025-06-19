import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "ekinler_bas_vermeden_kor_buzagı_topallamazmıs";

function getUserId(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) return null;
  let token = auth;
  if (token.startsWith("Bearer ")) token = token.replace("Bearer ", "");
  try {
    const user = jwt.verify(token, JWT_SECRET) as { id: number };
    return user.id;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  const messages = await prisma.message.findMany({
    where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    include: { sender: true, receiver: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ messages });
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  const { receiverId, content } = await req.json();
  if (!receiverId || !content) {
    return NextResponse.json({ error: "Tüm alanlar zorunludur." }, { status: 400 });
  }
  const message = await prisma.message.create({
    data: { senderId: userId, receiverId, content },
    include: { sender: true, receiver: true },
  });
  return NextResponse.json({ message });
} 