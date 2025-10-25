// app/api/admin/contact-pages/route.ts
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

// Helper to generate slug
function generateSlug(customerName: string, areaCode: string): string {
  const cleanName = customerName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${cleanName}-${areaCode}`;
}

// GET /api/admin/contact-pages - List all contact pages (public)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: pages, error } = await supabase
      .from('contact_pages')
      .select('id, customer_name, area_code, slug, is_published, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ pages }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/admin/contact-pages - Create new contact page (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authCheck = await verifyAdmin(request);
    if (!authCheck.authorized) {
      return authCheck.response;
    }

    const supabase = await createClient();
    const body = await request.json();
    const { customer_name, area_code, brand_color, intro_text, logo_url } = body;

    // Validation
    if (!customer_name || !area_code) {
      return NextResponse.json(
        { error: 'customer_name and area_code are required' },
        { status: 400 }
      );
    }

    // Validate area_code format (4-5 digits)
    if (!/^\d{4,5}$/.test(area_code)) {
      return NextResponse.json(
        { error: 'area_code must be 4-5 digits' },
        { status: 400 }
      );
    }

    // Check area_code uniqueness
    const { data: existing } = await supabase
      .from('contact_pages')
      .select('id')
      .eq('area_code', area_code)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'area_code must be unique' },
        { status: 409 }
      );
    }

    // Generate slug
    const slug = generateSlug(customer_name, area_code);

    // Insert new contact page
    const { data: newPage, error: insertError } = await supabase
      .from('contact_pages')
      .insert({
        customer_name,
        area_code,
        slug,
        brand_color: brand_color || null,
        intro_text: intro_text || null,
        logo_url: logo_url || null,
        is_published: false,
      })
      .select('id, customer_name, area_code, slug, is_published, created_at, updated_at')
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ page: newPage }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}