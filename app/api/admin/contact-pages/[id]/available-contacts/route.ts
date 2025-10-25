import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth-helpers';
import { NextRequest } from 'next/server';

// app/api/admin/contact-pages/[id]/available-contacts/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await params first
  const { id } = await params;
  
  // Await cookies and create Supabase client with SSR package
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
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
  
  const authCheck = await verifyAdmin(request);

  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    // Get all contacts
    const { data: allContacts, error: contactsError } = await supabase
      .from('contacts')
      .select('id, name, title, photo_url')
      .order('name');

    if (contactsError) throw contactsError;

    // Get contacts already on this page
    const { data: pageMembers, error: membersError } = await supabase
      .from('contact_page_members')
      .select('contact_id')
      .eq('page_id', id);

    if (membersError) throw membersError;

    // Filter out contacts already on the page
    const usedContactIds = new Set(pageMembers?.map(m => m.contact_id) || []);
    const available = (allContacts || []).filter(c => !usedContactIds.has(c.id));

    return NextResponse.json(available);
  } catch (error: any) {
            console.log("Error adding member:", error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}