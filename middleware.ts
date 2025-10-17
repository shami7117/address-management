// ============================================================================
// middleware.ts - FIXED VERSION with proper error handling
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
  
  console.log("User in Middleware:", user?.id);

  let role: string | null = null;

  // ✅ Fetch role from profiles table with proper error handling
  if (user) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    console.log("Profile Query Result:", { profile, error });

    if (error) {
      console.error("Error fetching profile:", error);
      
      // If profile doesn't exist, create one with default role
      if (error.code === 'PGRST116') {
        console.log("Profile not found, creating default profile...");
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({ id: user.id, role: 'user' })
          .select('role')
          .single();
        
        if (!insertError && newProfile) {
          role = newProfile.role;
          console.log("Created new profile with role:", role);
        } else {
          console.error("Error creating profile:", insertError);
          // Default to 'user' role if creation fails
          role = 'user';
        }
      }
    } else if (profile) {
      role = profile.role;
      console.log("User Role from profiles:", role);
    } else {
      // No error but no profile - shouldn't happen, default to user
      console.warn("No profile found but no error returned");
      role = 'user';
    }
  }

  const path = request.nextUrl.pathname;

  // Define routes
  const isAuthRoute = path === '/login' || path === '/signup' || path === '/forgot-password';
  const isAdminRoute = path.startsWith('/admin');
  const isUserRoute = path.startsWith('/user');
  const isLogsRoute = path.startsWith('/logs');

  // Allow access to unauthorized page
  if (path === '/unauthorized') {
    return response;
  }

  // Redirect logged-in users away from auth pages
  if (user && isAuthRoute) {
    const redirectUrl = role === 'admin' ? new URL('/admin', request.url) : new URL('/user', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Protect admin routes
  if (isAdminRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Protect user and logs routes
  if (isUserRoute || isLogsRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (role !== 'user' && role !== 'admin') {
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