import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  // "/username(.*)",
  // "/dashboard(.*)",
  // "/sets(.*)",
  // "/trade(.*)",
  // "/notifications(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

// export { auth as middleware } from "./app/api/auth/authConfig";
