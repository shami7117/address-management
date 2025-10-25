// app/api/admin/contact-pages/[id]/publish/route.ts
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

// PATCH /api/admin/contact-pages/[id]/publish - Toggle publish status (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params before using
    const { id } = await params;

    // Verify admin authentication
    const authCheck = await verifyAdmin(request);
    if (!authCheck.authorized) {
      return authCheck.response;
    }

    const supabase = await createClient();

    // Get current page
    const { data: currentPage, error: fetchError } = await supabase
      .from('contact_pages')
      .select('id, slug, is_published')
      .eq('id', id)
      .single();

    if (fetchError || !currentPage) {
      return NextResponse.json({ error: 'Contact page not found' }, { status: 404 });
    }

    const newPublishStatus = !currentPage.is_published;

    // If publishing, check slug uniqueness among published pages
    if (newPublishStatus) {
      const { data: conflictingPages, error: conflictError } = await supabase
        .from('contact_pages')
        .select('id')
        .eq('slug', currentPage.slug)
        .eq('is_published', true)
        .neq('id', id);

      if (conflictError) {
        return NextResponse.json({ error: conflictError.message }, { status: 500 });
      }

      if (conflictingPages && conflictingPages.length > 0) {
        return NextResponse.json(
          { error: 'Cannot publish: slug is already in use by another published page' },
          { status: 409 }
        );
      }
    }

    // Toggle publish status
    const { data: updatedPage, error: updateError } = await supabase
      .from('contact_pages')
      .update({
        is_published: newPublishStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id, customer_name, area_code, slug, is_published, created_at, updated_at')
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ page: updatedPage }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}