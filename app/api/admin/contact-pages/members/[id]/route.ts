import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth-helpers';
import { NextRequest } from 'next/server';

// Frontend role values
type FrontendRole = 'sales' | 'operations' | 'daily';

// Database role values
const ALLOWED_DB_ROLES = ['sales_contract', 'operations_service', 'daily_contact'] as const;
type DatabaseRole = typeof ALLOWED_DB_ROLES[number];

// Map frontend roles to database roles
const ROLE_MAPPING: Record<FrontendRole, DatabaseRole> = {
  'sales': 'sales_contract',
  'operations': 'operations_service',
  'daily': 'daily_contact'
};

// Reverse map for response (database to frontend)
const REVERSE_ROLE_MAPPING: Record<DatabaseRole, FrontendRole> = {
  'sales_contract': 'sales',
  'operations_service': 'operations',
  'daily_contact': 'daily'
};

// app/api/admin/contact-pages/members/[id]/route.ts
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await params first
  const { id } = await params;
  
  const supabase = createRouteHandlerClient({ cookies });
  const authCheck = await verifyAdmin(request);

  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const body = await request.json();
    const { role, order_index } = body;

    // Validate and map role if provided
    if (role !== undefined) {
      if (!['sales', 'operations', 'daily'].includes(role)) {
        return NextResponse.json({ 
          error: `Invalid role. Allowed values: sales, operations, daily` 
        }, { status: 400 });
      }
    }

    const updateData: any = {};
    if (role !== undefined) {
      // Map frontend role to database role
      updateData.role = ROLE_MAPPING[role as FrontendRole];
    }
    if (order_index !== undefined) updateData.order_index = order_index;

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ 
        error: 'No valid fields to update' 
      }, { status: 400 });
    }

    const { data: member, error } = await supabase
      .from('contact_page_members')
      .update(updateData)
      .eq('id', id)
      .select(`
        id,
        contact_id,
        role,
        order_index,
        page_id,
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

    if (error) throw error;
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Fetch reasons
    const { data: reasonsData } = await supabase
      .from('contact_page_member_reasons')
      .select(`
        contact_reasons (
          id,
          label
        )
      `)
      .eq('member_id', id);

    const reasons = reasonsData?.map((r: any) => ({
      id: r.contact_reasons?.id,
      label: r.contact_reasons?.label
    })) || [];

    // member.contacts is returned as an array (relation). Normalize safely.
    const contact = Array.isArray(member.contacts) ? member.contacts[0] : member.contacts;

    const formatted = {
      id: member.id,
      contact_id: member.contact_id,
      name: contact?.name ?? null,
      title: contact?.title ?? null,
      email: contact?.email ?? null,
      phone: contact?.phone ?? null,
      photo_url: contact?.photo_url ?? null,
      // Map database role back to frontend format
      role: REVERSE_ROLE_MAPPING[member.role as DatabaseRole],
      order_index: member.order_index,
      reasons,
    };

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error('Error updating member:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await params first
  const { id } = await params;
  
  const supabase = createRouteHandlerClient({ cookies });
  const authCheck = await verifyAdmin(request);

  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    // Delete related reasons first
    await supabase
      .from('contact_page_member_reasons')
      .delete()
      .eq('member_id', id);

    // Delete member
    const { error } = await supabase
      .from('contact_page_members')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}