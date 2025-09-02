import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)','/sign-up(.*)',"/sync-user"])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params. negative lookahead skip these static or next.js internals.
    //  Bascially do no run the middleware for these routes/files.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    // anything with /api or /trpc run middleware for them even if they look like static files.
    '/(api|trpc)(.*)',
  ],
};