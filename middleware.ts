import { NextRequest, NextResponse } from "next/server";

const authentifiedRoutes = ["/", "/profile"];

export default function middleware(req: NextRequest) {
  const role = req.cookies.get("role")?.value;

  if (req.nextUrl.pathname.endsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/"));
  }
  if (
    authentifiedRoutes.some((route) => req.nextUrl.pathname.endsWith(route)) &&
    role !== "ADMIN" &&
    role !== "USER"
  ) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }
  return NextResponse.next();
}
