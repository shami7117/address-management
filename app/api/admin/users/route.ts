// ====================================
// app/api/admin/users/route.ts
// ====================================
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdmin } from "@/lib/auth-helpers";
import { sendWelcomeEmail } from "@/lib/email";

// Create admin client with service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // This is the key change!
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: NextRequest) {
  // Verify admin access
  const authCheck = await verifyAdmin(request);
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const body = await request.json();
    const { email, password, full_name, role, avatar_url } = body;

    // Validate required fields
    if (!email || !password || !full_name || !role) {
      return NextResponse.json(
        { error: "Missing required fields: email, password, full_name, role" },
        { status: 400 }
      );
    }

    // Validate role
    if (!["user", "admin"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be 'user' or 'admin'" },
        { status: 400 }
      );
    }

    // Create user in Supabase Auth using admin client
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name,
        },
      });

    if (authError || !authData.user) {
      console.error("Error creating auth user:", authError);
      return NextResponse.json(
        { error: authError?.message || "Failed to create user" },
        { status: 500 }
      );
    }

    // Insert profile record using admin client
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: authData.user.id,
        // email,
        full_name,
        role,
        avatar_url: avatar_url || null,
        // active: true,
      })
      .select()
      .single();

    if (profileError) {
      console.error("Error creating profile:", profileError);
      
      // Rollback: Delete the auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      
      return NextResponse.json(
        { error: "Failed to create user profile" },
        { status: 500 }
      );
    }

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, full_name, password).then((result) => {
      if (!result.success) {
        console.error("Failed to send welcome email to:", email);
      } else {
        console.log("Welcome email sent successfully to:", email);
      }
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: profileData.id,
          email: profileData.email,
          full_name: profileData.full_name,
          role: profileData.role,
          avatar_url: profileData.avatar_url,
          created_at: profileData.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}