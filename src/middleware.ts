import { NextRequest, NextResponse } from "next/server";

const adminRoutes = ["/admin", "/admin/products", "/admin/orders"];
const adminApiRoutes = ["/api/admin", "/api/admin/products", "/api/admin/orders"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isApiRoute = pathname.startsWith("/api/");
  
  // Admin rotaları kontrolü
  if (adminRoutes.some(route => pathname.startsWith(route)) || 
      adminApiRoutes.some(route => pathname.startsWith(route))) {
    
    // Token'ı farklı kaynaklardan al
    let token = req.headers.get("authorization");
    if (token && token.startsWith("Bearer ")) {
      token = token.replace("Bearer ", "");
    } else {
      // Cookie'den token al
      const cookieToken = req.cookies.get("token")?.value;
      if (cookieToken) {
        token = cookieToken;
      }
    }
    
    // Sadece token varlığını kontrol et, doğrulama client-side yapılacak
    if (!token) {
      if (isApiRoute) {
        return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
      }
      const url = new URL("/login", req.url);
      url.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(url);
    }
    
    // Token varsa devam et, doğrulama client-side yapılacak
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
}; 