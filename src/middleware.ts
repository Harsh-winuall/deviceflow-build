import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });
  const { pathname } = req?.nextUrl;

  const userRoutes = [
    "/profile",
    "/team",
    "/team/(.*)",
    "/devices",
    "/devices/(.*)",
  ];

  const commonRoutes = ["/", "/terms-and-conditions"];

  const adminRoutes = [
    "/onboarding",
    "/teams",
    "/teams/(.*)",
    "/assets",
    "/assets/(.*)",
    "/settings",
    "/people",
    "/people/(.*)",
    "/org-chart",
    "/store",
    "/store/(.*)",
    "/store/view-all",
    "/store/cart",
    "/store/cart/checkout",
  ];

  // If already logged in redirect to home page
  // if (token && pathname === "/login") {
  //   const home = new URL("/", req.url);
  //   return NextResponse.redirect(home);
  // }

  if (pathname === "/login") {
    return NextResponse.next();
  }

  // if (!token && pathname !== "/") {
  //   const home = new URL("/", req.url);
  //   return NextResponse.redirect(home);
  // }

  // Check for token and role-based restrictions
  if (
    new RegExp(
      `^(${[...commonRoutes, ...adminRoutes, ...userRoutes].join("|")})$`
    ).test(pathname)
  ) {
    // If token is missing, redirect to login
    // 1:- Employee, 2:- admin, 3:- upper management, 4:- founder
    // if (token) {
    //   // Check for admin route protection
    //   if (
    //     adminRoutes.some((route) => new RegExp(`^${route}$`).test(pathname))
    //   ) {
    //     if (![2, 3, 4].includes(token.role!)) {
    //       const home = new URL("/error", req.url);
    //       return NextResponse.redirect(home);
    //     }
    //   }

    //   // Check for user route protection
    //   if (userRoutes.some((route) => new RegExp(`^${route}$`).test(pathname))) {
    //     if ([2, 3, 4].includes(token.role!)) {
    //       const home = new URL("/error", req.url);
    //       return NextResponse.redirect(home);
    //     }
    //   }
    // }
    if (token) {
      const isAdmin = [2, 3, 4].includes(token?.role);
      const isEmployee = token?.role === 1;

      const isAdminRoute = adminRoutes.some((route) =>
        new RegExp(`^${route}$`).test(pathname)
      );

      const isUserRoute = userRoutes.some((route) =>
        new RegExp(`^${route}$`).test(pathname)
      );

      if (isAdminRoute && !isAdmin) {
        return NextResponse.redirect(new URL("/error", req.url));
      }

      if (isUserRoute && !isEmployee) {
        return NextResponse.redirect(new URL("/error", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!login$).*)",
    "/onboarding",
    "/assets",
    "/assets/:path*",
    "/team",
    "/team/:path*",
    "/teams",
    "/teams/:path*",
    "/devices",
    "/devices/:path*",
    "/people",
    "/people/:path*",
    "/settings",
    "/onboarding",
    "/store",
    "/store/:path*",
    "/store/cart",
    "/store/view-all",
    "/store/cart/checkout",
    "/org-chart",
    "/profile",
    "/((?!api|_next/static|assets|_next/image|.*\\.png$).*)", // Protect all other routes
    "/terms-and-conditions"
  ],
};
