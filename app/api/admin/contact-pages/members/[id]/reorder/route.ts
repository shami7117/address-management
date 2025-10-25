// app/api/admin/contact-pages/members/reorder/route.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth-helpers';
import { NextRequest } from 'next/server';

export async function PATCH(request: NextRequest) {
  const cookieStore = await cookies();
  
  // Create Supabase client with @supabase/ssr
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
  
  // Verify admin authentication
  const authCheck = await verifyAdmin(request);
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const body = await request.json();
    const { order } = body;
    console.log("Reorder request body:", body);
    
    // Validate the order array
    if (!Array.isArray(order) || order.length === 0) {
      return NextResponse.json(
        { error: 'Invalid order data' },
        { status: 400 }
      );
    }

    // Update each member's order_index
    const updates = order.map((item: { member_id: string; order_index: number }) =>
      supabase
        .from('contact_page_members')
        .update({ order_index: item.order_index })
        .eq('id', item.member_id)
    );

    const results = await Promise.all(updates);
    
    // Check if any updates failed
    const errors = results.filter(result => result.error);
    if (errors.length > 0) {
      console.error("Some updates failed:", errors);
      return NextResponse.json(
        { error: 'Some updates failed', details: errors },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error reordering members:", error);
    return NextResponse.json(
      { error: error.message || 'Failed to reorder members' },
      { status: 500 }
    );
  }
}