// app/api/admin/users/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    // ✅ Await cookies first
    const cookieStore = await cookies()
    
    // ✅ Create a client that can read cookies properly
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
        },
        // cookies: {
        //   getAll() {
        //     return cookieStore.getAll()
        //   },
        //   setAll(cookiesToSet:any) {
        //     try {
        //       cookiesToSet.forEach(( name:any, value:any, options:any ) =>
        //         cookieStore.set(name, value, options)
        //       )
        //     } catch {
        //       // Handle errors if needed
        //     }
        //   },
        //   removeAll() {
        //     try {
        //       cookieStore.getAll().forEach(({ name }) => cookieStore.delete(name))
        //     } catch {
        //       // Handle errors if needed
        //     }
        //   },
        // },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { email, password, full_name, role, avatar_url } = await req.json()

    if (!email || !password || !full_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 1. Create user in auth.users
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const newUser = data.user

    // 2. Create profile row
    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      id: newUser.id,
      full_name,
      role: role && ["admin", "user"].includes(role) ? role : "user",
      avatar_url: avatar_url ?? null,
    })

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, userId: newUser.id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}