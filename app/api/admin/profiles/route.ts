// ====================================
// app/api/admin/profiles/route.ts
// ====================================
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { verifyAdmin } from "@/lib/auth-helpers";
import { createClient } from "@supabase/supabase-js";


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



export async function GET(request: NextRequest) {
  // Verify admin access
  const authCheck = await verifyAdmin(request);
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
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
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    // Get profiles from database
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, full_name, role, avatar_url, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching profiles:", error);
      return NextResponse.json(
        { error: "Failed to fetch profiles" },
        { status: 500 }
      );
    }

    // Get all users from Supabase Auth to fetch emails
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      console.error("Error fetching auth users:", authError);
      return NextResponse.json(
        { error: "Failed to fetch user emails" },
        { status: 500 }
      );
    }

    // Create a map of user IDs to emails
    const emailMap = new Map(
      authUsers.users.map(user => [user.id, user.email])
    );

    // Combine profile data with emails from auth
    const profilesWithEmails = profiles.map(profile => ({
      id: profile.id,
      full_name: profile.full_name,
      email: emailMap.get(profile.id) || '',
      role: profile.role,
      avatar_url: profile.avatar_url,
      created_at: profile.created_at,
    }));

    return NextResponse.json({ profiles: profilesWithEmails }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}