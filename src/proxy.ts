import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/pos",
    "/pos/:path*",
    "/inventory",
    "/inventory/:path*",
    "/invoices",
    "/invoices/:path*",
    "/analytics",
    "/analytics/:path*",
    "/shops",
    "/shops/:path*",
    "/staff",
    "/staff/:path*",
    "/settings",
    "/settings/:path*",
    "/subscription",
    "/subscription/:path*",
  ],
};
