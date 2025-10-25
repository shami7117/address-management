
// ====================================
// app/api/admin/contacts/route.ts
// GET /api/admin/contacts - List all contacts
// POST /api/admin/contacts - Create new contact
// ====================================

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth-helpers";

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Phone validation regex (flexible for international formats)
const PHONE_REGEX = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;

export async function GET(request: NextRequest) {
  // Verify admin access
  const authResult = await verifyAdmin(request);
  if (!authResult.authorized) {
    return authResult.response;
  }

  const cookieStore = await cookies();
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
          } catch {}
        },
      },
    }
  );

  // Get query params
  const { searchParams } = new URL(request.url);
  const activeFilter = searchParams.get("active");

  // Build query
  let query = supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  // Apply active filter if provided
  if (activeFilter === "true") {
    query = query.eq("active", true);
  } else if (activeFilter === "false") {
    query = query.eq("active", false);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: NextRequest) {
  // Verify admin access
  const authResult = await verifyAdmin(request);
  if (!authResult.authorized) {
    return authResult.response;
  }

  const cookieStore = await cookies();
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
          } catch {}
        },
      },
    }
  );

  try {
    const body = await request.json();
    const { name, title, email, phone, photo_url, active = true } = body;

    // Validate required fields
    if (!name || !title || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields: name, title, email, phone" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate phone format
    if (!PHONE_REGEX.test(phone)) {
      return NextResponse.json(
        { error: "Invalid phone format" },
        { status: 400 }
      );
    }

    // Insert new contact
    const { data, error } = await supabase
      .from("contacts")
      .insert([
        {
          name,
          title,
          email,
          phone,
          photo_url: photo_url || null,
          active,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}