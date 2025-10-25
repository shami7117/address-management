// ====================================
// app/api/admin/contacts/[id]/route.ts
// PUT /api/admin/contacts/[id] - Update contact
// DELETE /api/admin/contacts/[id] - Permanent delete contact with cascade
// ====================================

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth-helpers";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await params
  const { id } = await params;

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
    const { name, title, email, phone, photo_url, active } = body;

    // Validate email if provided
    if (email && !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate phone if provided
    if (phone && !PHONE_REGEX.test(phone)) {
      return NextResponse.json(
        { error: "Invalid phone format" },
        { status: 400 }
      );
    }

    // Build update object with only provided fields
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updateData.name = name;
    if (title !== undefined) updateData.title = title;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (photo_url !== undefined) updateData.photo_url = photo_url;
    if (active !== undefined) updateData.active = active;

    const { data, error } = await supabase
      .from("contacts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await params
  const { id } = await params;

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
    // First, check if contact exists
    const { data: contact, error: fetchError } = await supabase
      .from("contacts")
      .select("id, name")
      .eq("id", id)
      .single();

    if (fetchError || !contact) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }

    // Delete related data in child tables
    // Adjust table names based on your schema
    
    // Example: Delete from contact_departments (if exists)
    await supabase
      .from("contact_departments")
      .delete()
      .eq("contact_id", id);

    // Example: Delete from contact_locations (if exists)
    await supabase
      .from("contact_locations")
      .delete()
      .eq("contact_id", id);

    // Example: Delete from any other related tables
    // await supabase
    //   .from("contact_projects")
    //   .delete()
    //   .eq("contact_id", id);

    // Finally, permanently delete the contact
    const { error: deleteError } = await supabase
      .from("contacts")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json(
        { error: `Failed to delete contact: ${deleteError.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        message: "Contact and all related data permanently deleted",
        deletedContact: contact.name
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the contact" },
      { status: 500 }
    );
  }
}