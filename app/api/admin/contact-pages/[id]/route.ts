// app/api/admin/contact-pages/[id]/route.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth-helpers';

// Helper to create Supabase client
async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
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
            // Ignore if called from Server Component
          }
        },
      },
    }
  );
}

// ✅ GET /api/admin/contact-pages/[id] - Get single contact page (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify admin authentication
    const authCheck = await verifyAdmin(request);
    if (!authCheck.authorized) {
      return authCheck.response;
    }

    const supabase = await createClient();

    // Fetch single contact page
    const { data: page, error } = await supabase
      .from('contact_pages')
      .select(`
        id,
        customer_name,
        area_code,
        slug,
        brand_color,
        intro_text,
        logo_url,
        is_published,
        created_at,
        updated_at
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Contact page not found' }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ page }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/admin/contact-pages/[id] - Update contact page (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const authCheck = await verifyAdmin(request);
    if (!authCheck.authorized) {
      return authCheck.response;
    }

    const supabase = await createClient();
    const body = await request.json();
    const { customer_name, brand_color, intro_text, logo_url, is_published } = body;

    const updates: any = {};
    if (customer_name !== undefined) updates.customer_name = customer_name;
    if (brand_color !== undefined) updates.brand_color = brand_color;
    if (intro_text !== undefined) updates.intro_text = intro_text;
    if (logo_url !== undefined) updates.logo_url = logo_url;
    if (is_published !== undefined) updates.is_published = is_published;
    updates.updated_at = new Date().toISOString();

    if (Object.keys(updates).length === 1) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const { data: updatedPage, error: updateError } = await supabase
      .from('contact_pages')
      .update(updates)
      .eq('id', id)
      .select('id, customer_name, area_code, slug, is_published, created_at, updated_at')
      .single();

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Contact page not found' }, { status: 404 });
      }
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ page: updatedPage }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/contact-pages/[id] - Delete contact page (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const authCheck = await verifyAdmin(request);
    if (!authCheck.authorized) {
      return authCheck.response;
    }

    const supabase = await createClient();

    const { error: deleteError } = await supabase
      .from('contact_pages')
      .delete()
      .eq('id', id);

    if (deleteError) {
      if (deleteError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Contact page not found' }, { status: 404 });
      }
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Contact page deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
