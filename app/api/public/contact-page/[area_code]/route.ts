// app/api/public/contact-page/[area_code]/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
  req: Request,
  { params }: { params: Promise<{ area_code: string }> }
) {
  try {
    const { area_code } = await params

    // ✅ Step 1: Fetch contact page details
    const { data: page, error: pageError } = await supabase
      .from("contact_pages")
      .select("*")
      .eq("area_code", area_code)
      .eq("is_published", true)
      .maybeSingle()

    

    if (pageError || !page) {
      return NextResponse.json({ error: "Contact page not found" }, { status: 404 })
    }

    // ✅ Step 2: Fetch members for this page
    const { data: members, error: membersError } = await supabase
      .from("contact_page_members")
      .select(
        `
        id,
        contact_id,
        role,
        order_index,
        contacts (
          name,
          title,
          email,
          phone,
          photo_url
        ),
        contact_page_member_reasons (
          reason_id,
          contact_reasons (
            label
          )
        )
        `
      )
      .eq("page_id", page.id)
      .order("order_index", { ascending: true })

    if (membersError) {
      return NextResponse.json({ error: membersError.message }, { status: 500 })
    }

   // ✅ Step 3: Format data for frontend
    const formattedMembers = members.map((m: any) => {
      const contact = Array.isArray(m.contacts) ? m.contacts[0] : m.contacts
      
      return {
        id: m.id,
        role: m.role,
        name: contact?.name ?? "",
        title: contact?.title ?? "",
        email: contact?.email ?? "",
        phone: contact?.phone ?? "",
        photo_url: contact?.photo_url ?? null,
        reasons:
          m.contact_page_member_reasons?.map(
            (r: any) => r.contact_reasons?.label
          ) || [],
      }
    })

    // ✅ Step 4: Build final response
    const response = {
      id: page.id,
      customer_name: page.customer_name,
      area_code: page.area_code,
      brand_color: page.brand_color ?? "#2563eb",
      intro_text: page.intro_text ?? "",
      logo_url: page.logo_url ?? null,
      is_published: page.is_published,
      members: formattedMembers,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (err: any) {
    console.error("Error fetching public contact page:", err)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}