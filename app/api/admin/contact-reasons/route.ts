// ============================================
// app/api/admin/contact-reasons/route.ts
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

export async function GET() {
  try {
    const supabase = await createSupabaseClient();

    // Fetch all contact reasons ordered by created_at desc
    const { data, error } = await supabase
      .from('contact_reasons')
      .select('id, label, description, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contact reasons:', error);
      return NextResponse.json(
        { error: 'Failed to fetch contact reasons' },
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

export async function POST(request: NextRequest) {
  try {
    // Verify admin access using the helper
    const authResult = await verifyAdmin(request);
    
    if (!authResult.authorized) {
      return authResult.response;
    }

    const supabase = await createSupabaseClient();

    // Parse request body
    const body = await request.json();
    const { label, description } = body;

    // Validate required fields
    if (!label || typeof label !== 'string' || label.trim().length === 0) {
      return NextResponse.json(
        { error: 'Label is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Check if label already exists
    const { data: existing, error: checkError } = await supabase
      .from('contact_reasons')
      .select('id')
      .eq('label', label.trim())
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

    // Insert new contact reason
    const { data, error: insertError } = await supabase
      .from('contact_reasons')
      .insert({
        label: label.trim(),
        description: description?.trim() || null,
      })
      .select('id, label, description, created_at')
      .single();

    if (insertError) {
      console.error('Error creating contact reason:', insertError);
      return NextResponse.json(
        { error: 'Failed to create contact reason' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}