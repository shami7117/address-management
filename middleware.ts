// ============================================================================
// middleware.ts - SIMPLIFIED VERSION for proper logout and route protection
// ============================================================================
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Get user from auth
  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  
  // console.log('=== MIDDLEWARE DEBUG ===');
  // console.log('Path:', path);
  // console.log('User ID:', user?.id);
  // console.log('Auth cookies:', request.cookies.getAll().filter(c => c.name.includes('sb')));
  // console.log('==================');

  // Define routes
  const isAuthRoute = path === '/login' || path === '/signup' || path === '/forgot-password' || path === '/reset-password';
  const isAdminRoute = path.startsWith('/admin');
  const isUserRoute = path.startsWith('/user');
  const isLogsRoute = path.startsWith('/logs');
  const isProtectedRoute = isAdminRoute || isUserRoute || isLogsRoute;

  // Allow unauthorized page
  if (path === '/unauthorized') {
    return response;
  }

  // ✅ If user is NOT logged in
  if (!user) {
    // Allow auth routes (login, signup, etc.)
    if (isAuthRoute) {
      return response;
    }
    
    // Block all protected routes - redirect to login
    if (isProtectedRoute) {
      console.log(`Blocking ${path} - user not authenticated`);
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Allow public routes
    return response;
  }

  // ✅ If user IS logged in
  if (user) {
    // Fetch user role from profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    let role = 'user'; // default role

    if (!error && profile) {
      role = profile.role;
    } else if (error?.code === 'PGRST116') {
      // Profile doesn't exist - create one
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert({ id: user.id, role: 'user', full_name: '' })
        .select('role')
        .single();
      
      if (newProfile) {
        role = newProfile.role;
      }
    }

    // Redirect logged-in users away from auth pages
    if (isAuthRoute) {
      const redirectUrl = role === 'admin' ? new URL('/admin', request.url) : new URL('/user', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Check admin route access
    if (isAdminRoute && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Allow user and logs routes for both admin and user roles
    if ((isUserRoute || isLogsRoute) && role !== 'user' && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};