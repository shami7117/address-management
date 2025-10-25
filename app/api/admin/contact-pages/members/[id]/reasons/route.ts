import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth-helpers';

// UUID validation helper
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const authCheck = await verifyAdmin(request);
  if (!authCheck.authorized) return authCheck.response;

  try {
    // Await params first
    const { id } = await params;

    // Validate member_id is a valid UUID
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: 'Invalid member ID format. Must be a valid UUID.' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { reason_ids } = body;

    // Validate all reason_ids are valid UUIDs
    if (reason_ids && reason_ids.length > 0) {
      const invalidReasons = reason_ids.filter((reasonId: string) => !isValidUUID(reasonId));
      if (invalidReasons.length > 0) {
        return NextResponse.json(
          { 
            error: 'Invalid reason ID format. All reason IDs must be valid UUIDs.',
            invalid_ids: invalidReasons
          },
          { status: 400 }
        );
      }
    }

    // Delete existing reasons by member_id
    await supabase
      .from('contact_page_member_reasons')
      .delete()
      .eq('member_id', id);

    // Insert new reasons
    if (reason_ids && reason_ids.length > 0) {
      const insertData = reason_ids.map((reason_id: string) => ({
        member_id: id,
        reason_id
      }));

      const { error: insertError } = await supabase
        .from('contact_page_member_reasons')
        .insert(insertData);

      if (insertError) throw insertError;
    }

    // Fetch and return updated reasons
    const { data: reasonsData, error: fetchError } = await supabase
      .from('contact_page_member_reasons')
      .select(`
        contact_reasons (
          id,
          label
        )
      `)
      .eq('member_id', id);

    if (fetchError) throw fetchError;

    const reasons = reasonsData.map((r: any) => ({
      id: r.contact_reasons?.id,
      label: r.contact_reasons?.label
    }));

    return NextResponse.json(reasons);
  } catch (error: any) {
    console.error('Error managing member reasons:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}