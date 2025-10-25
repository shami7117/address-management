// ============================================
// app/api/admin/contact-reasons/[id]/route.ts
// ============================================

import { createServerClient } from "@supabase/ssr";
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth-helpers';

// Helper function to create Supabase client
async function createSupabaseClient() {
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
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params first
    const { id } = await params;
    
    // Verify admin access
    const authResult = await verifyAdmin(request);
    
    if (!authResult.authorized) {
      return authResult.response;
    }

    const supabase = await createSupabaseClient();

    // Parse request body
    const body = await request.json();
    const { label, description } = body;

    // Validate at least one field is provided
    if (!label && description === undefined) {
      return NextResponse.json(
        { error: 'At least one field (label or description) must be provided' },
        { status: 400 }
      );
    }

    // Validate label if provided
    if (label !== undefined && (typeof label !== 'string' || label.trim().length === 0)) {
      return NextResponse.json(
        { error: 'Label must be a non-empty string' },
        { status: 400 }
      );
    }

    // If updating label, check uniqueness
    if (label) {
      const { data: existing, error: checkError } = await supabase
        .from('contact_reasons')
        .select('id')
        .eq('label', label.trim())
        .neq('id', id)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing label:', checkError);
        return NextResponse.json(
          { error: 'Failed to validate label uniqueness' },
          { status: 500 }
        );
      }

      if (existing) {
        return NextResponse.json(
          { error: 'A contact reason with this label already exists' },
          { status: 409 }
        );
      }
    }

    // Build update object
    const updateData: any = {};
    if (label !== undefined) updateData.label = label.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;

    // Update contact reason
    const { data, error: updateError } = await supabase
      .from('contact_reasons')
      .update(updateData)
      .eq('id', id)
      .select('id, label, description, created_at')
      .single();

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Contact reason not found' },
          { status: 404 }
        );
      }
      console.error('Error updating contact reason:', updateError);
      return NextResponse.json(
        { error: 'Failed to update contact reason' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params first
    const { id } = await params;
    
    // Verify admin access
    const authResult = await verifyAdmin(request);
    
    if (!authResult.authorized) {
      return authResult.response;
    }

    const supabase = await createSupabaseClient();

    // Delete contact reason (cascade will handle contact_page_member_reasons)
    const { error: deleteError } = await supabase
      .from('contact_reasons')
      .delete()
      .eq('id', id);

    if (deleteError) {
      if (deleteError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Contact reason not found' },
          { status: 404 }
        );
      }
      console.error('Error deleting contact reason:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete contact reason' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Contact reason deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}