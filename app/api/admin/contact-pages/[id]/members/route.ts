// app/api/admin/contact-pages/[id]/members/route.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth-helpers';
import { NextRequest } from 'next/server';

// Helper to create Supabase client
async function createClient() {
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
            // Ignore if called from Server Component
          }
        },
      },
    }
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await params first
  const { id } = await params;
  
  const supabase = await createClient();
  const authCheck = await verifyAdmin(request);

  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const { data: members, error } = await supabase
      .from('contact_page_members')
      .select(`
        id,
        contact_id,
        role,
        order_index,
        contacts (
          id,
          name,
          title,
          email,
          phone,
          photo_url
        )
      `)
      .eq('page_id', id)
      .order('order_index', { ascending: true });

    if (error) throw error;

    // Fetch reasons for each member
    const memberIds = members.map(m => m.id);
    const { data: reasonsData, error: reasonsError } = await supabase
      .from('contact_page_member_reasons')
      .select(`
        member_id,
        contact_reasons (
          id,
          label
        )
      `)
      .in('member_id', memberIds);

    if (reasonsError) throw reasonsError;

    // Group reasons by member_id
    const reasonsByMember = reasonsData.reduce((acc, item: any) => {
      if (!acc[item.member_id]) acc[item.member_id] = [];
      acc[item.member_id].push({
        id: item.contact_reasons.id,
        label: item.contact_reasons.label
      });
      return acc;
    }, {} as Record<string, any[]>);

    console.log("Reasons by member:", reasonsByMember);

    // Format response
    const formatted = members.map(member => {
      const contact = Array.isArray(member.contacts) ? member.contacts[0] : member.contacts;
      return {
        id: member.id,
        contact_id: member.contact_id,
        name: contact?.name ?? null,
        title: contact?.title ?? null,
        email: contact?.email ?? null,
        phone: contact?.phone ?? null,
        photo_url: contact?.photo_url ?? null,
        role: member.role,
        order_index: member.order_index,
        reasons: reasonsByMember[member.id] || []
      };
    });

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.log("Error fetching members:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await params first
  const { id } = await params;
  
  const supabase = await createClient();
  const authCheck = await verifyAdmin(request);

  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const body = await request.json();
    const { contact_id, role, order_index } = body;

    // Check if contact already exists on this page
    const { data: existing } = await supabase
      .from('contact_page_members')
      .select('id')
      .eq('page_id', id)
      .eq('contact_id', contact_id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Contact already added' },
        { status: 409 }
      );
    }

    // Add member
    const { data: member, error: insertError } = await supabase
      .from('contact_page_members')
      .insert({
        page_id: id,
        contact_id,
        role,
        order_index
      })
      .select(`
        id,
        contact_id,
        role,
        order_index,
        contacts (
          id,
          name,
          title,
          email,
          phone,
          photo_url
        )
      `)
      .single();

    if (insertError) throw insertError;

    // member.contacts is returned as an array (relation). Normalize safely.
    const contact = Array.isArray(member.contacts) ? member.contacts[0] : member.contacts;
    
    // Format response
    const formatted = {
      id: member.id,
      contact_id: member.contact_id,
      name: contact?.name ?? null,
      title: contact?.title ?? null,
      email: contact?.email ?? null,
      phone: contact?.phone ?? null,
      photo_url: contact?.photo_url ?? null,
      role: member.role,
      order_index: member.order_index,
      reasons: []
    };

    return NextResponse.json(formatted, { status: 201 });
  } catch (error: any) {
    console.log("Error adding member:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await params first
  const { id } = await params;
  
  const supabase = await createClient();
  const authCheck = await verifyAdmin(request);

  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const body = await request.json();
    const { contact_id, role, order_index, reasons } = body;

    // Update member
    const { data: member, error: updateError } = await supabase
      .from('contact_page_members')
      .update({
        role,
        order_index
      })
      .eq('id', id)
      .select(`
        id,
        contact_id,
        role,
        order_index,
        contacts (
          id,
          name,
          title,
          email,
          phone,
          photo_url
        )
      `)
      .single();

    if (updateError) throw updateError;

    // Update reasons if provided
    if (reasons !== undefined) {
      // Delete existing reasons
      await supabase
        .from('contact_page_member_reasons')
        .delete()
        .eq('member_id', id);

      // Insert new reasons
      if (reasons.length > 0) {
        const reasonsToInsert = reasons.map((reasonId: string) => ({
          member_id: id,
          reason_id: reasonId
        }));

        await supabase
          .from('contact_page_member_reasons')
          .insert(reasonsToInsert);
      }
    }

    // Fetch updated reasons
    const { data: reasonsData } = await supabase
      .from('contact_page_member_reasons')
      .select(`
        contact_reasons (
          id,
          label
        )
      `)
      .eq('member_id', id);

    const formattedReasons = reasonsData?.map((r: any) => ({
      id: r.contact_reasons.id,
      label: r.contact_reasons.label
    })) || [];

    // member.contacts is returned as an array (relation). Normalize safely.
    const contact = Array.isArray(member.contacts) ? member.contacts[0] : member.contacts;
    
    // Format response
    const formatted = {
      id: member.id,
      contact_id: member.contact_id,
      name: contact?.name ?? null,
      title: contact?.title ?? null,
      email: contact?.email ?? null,
      phone: contact?.phone ?? null,
      photo_url: contact?.photo_url ?? null,
      role: member.role,
      order_index: member.order_index,
      reasons: formattedReasons
    };

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.log("Error updating member:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}