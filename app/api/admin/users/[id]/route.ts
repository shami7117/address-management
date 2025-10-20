// ====================================
// app/api/admin/users/[id]/route.ts
// ====================================
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdmin } from "@/lib/auth-helpers";

// PUT - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify admin access
  const authCheck = await verifyAdmin(request);
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { full_name, role, avatar_url } = body;

    console.log("========== UPDATE USER REQUEST ==========");
    console.log("Target User ID:", id);
    console.log("Request Body:", body);

    // Create admin client with service role - IMPORTANT: Use createClient, not createServerClient
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log("Service Role Key exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

    // Prepare update data
    const updateData: any = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (role !== undefined) {
      if (!["user", "admin"].includes(role)) {
        return NextResponse.json(
          { error: "Invalid role. Must be 'user' or 'admin'" },
          { status: 400 }
        );
      }
      updateData.role = role;
    }
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

    console.log("Prepared Update Data:", updateData);

    if (Object.keys(updateData).length === 0) {
      console.log("No fields to update");
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    // Check if user exists
    console.log("Checking if user exists...");
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    console.log("Existing User:", existingUser);
    console.log("Fetch Error:", fetchError);

    if (fetchError || !existingUser) {
      console.error("User not found:", fetchError);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update profile - Add .select() to return updated data
    console.log("Attempting to update profile...");
    
    const { data: updateResult, error: profileError, status, statusText } = await supabaseAdmin
      .from("profiles")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    console.log("Update Status:", status, statusText);
    console.log("Update Result:", updateResult);
    console.log("Profile Error:", profileError);

    if (profileError) {
      console.error("Error updating profile:", profileError);
      return NextResponse.json(
        { error: "Failed to update user", details: profileError.message },
        { status: 500 }
      );
    }

    if (!updateResult) {
      console.error("Update returned no data - possible RLS issue");
      
      // Try to fetch again to confirm
      const { data: checkUser } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();
      
      console.log("Re-fetched user after update:", checkUser);
      
      return NextResponse.json(
        { 
          error: "Update may have failed - no data returned",
          user: checkUser,
          note: "Check database triggers and RLS policies"
        },
        { status: 500 }
      );
    }

    console.log("========== UPDATE SUCCESSFUL ==========");
    console.log("Before:", existingUser);
    console.log("After:", updateResult);
    console.log("Changes:", {
      full_name: { old: existingUser.full_name, new: updateResult.full_name },
      role: { old: existingUser.role, new: updateResult.role },
      avatar_url: { old: existingUser.avatar_url, new: updateResult.avatar_url }
    });

    return NextResponse.json(
      {
        message: "User updated successfully",
        user: updateResult,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("========== UNEXPECTED ERROR ==========");
    console.error("Error:", error);
    console.error("Error Stack:", error instanceof Error ? error.stack : "No stack trace");
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// DELETE - Permanently delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify admin access
  const authCheck = await verifyAdmin(request);
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const { id } = await params;
    
    console.log("========== DELETE USER REQUEST ==========");
    console.log("Target User ID:", id);
    
    // Create admin client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Delete from profiles table
    console.log("Deleting from profiles table...");
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("id", id);

    console.log("Profile Delete Error:", profileError);

    if (profileError) {
      console.error("Error deleting profile:", profileError);
      return NextResponse.json(
        { error: "Failed to delete user profile", details: profileError.message },
        { status: 500 }
      );
    }

    // Delete from authentication
    console.log("Deleting from auth...");
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);

    console.log("Auth Delete Error:", authError);

    if (authError) {
      console.error("Error deleting auth user:", authError);
      return NextResponse.json(
        { error: "Failed to delete user authentication", details: authError.message },
        { status: 500 }
      );
    }

    console.log("========== DELETE SUCCESSFUL ==========");

    return NextResponse.json(
      {
        message: "User permanently deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("========== UNEXPECTED ERROR ==========");
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}