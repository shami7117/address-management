// ====================================
// app/api/admin/contacts/[id]/toggle/route.ts
// PATCH /api/admin/contacts/[id]/toggle - Toggle active status
// ====================================

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth-helpers";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await params first
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

  // Get current contact
  const { data: currentContact, error: fetchError } = await supabase
    .from("contacts")
    .select("active")
    .eq("id", id)
    .single();

  if (fetchError || !currentContact) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  // Toggle active status
  const { data, error } = await supabase
    .from("contacts")
    .update({
      active: !currentContact.active,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}