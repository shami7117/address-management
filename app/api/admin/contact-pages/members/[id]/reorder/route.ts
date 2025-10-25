// app/api/admin/contact-pages/members/reorder/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

async function verifyAdmin(supabase: any) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { authorized: false, error: 'Unauthorized' };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || profile?.role !== 'admin') {
    return { authorized: false, error: 'Admin access required' };
  }

  return { authorized: true, userId: user.id };
}

// app/api/admin/contact-pages/members/reorder/route.ts
export async function PATCH(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const auth = await verifyAdmin(supabase);

  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { order } = body;

    // Update each member's order_index
    const updates = order.map((item: { id: string; order_index: number }) =>
      supabase
        .from('contact_page_members')
        .update({ order_index: item.order_index })
        .eq('id', item.id)
    );

    await Promise.all(updates);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}