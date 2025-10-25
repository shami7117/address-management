// app/public/[area_code]/page.tsx
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, Building2 } from 'lucide-react';
import { AnimatedHeader } from './components/AnimatedHeader';
import { AnimatedContactCard } from './components/AnimatedContactCard';
import { AnimatedFooter } from './components/AnimatedFooter';

// Types
interface ContactMember {
  id: string;
  name: string;
  title: string;
  role: string;
  email: string;
  phone: string;
  photo_url: string | null;
  reasons: string[];
}

interface ContactPageData {
  id: string;
  customer_name: string;
  area_code: string;
  brand_color: string;
  intro_text: string;
  logo_url: string | null;
  is_published: boolean;
  members: ContactMember[];
}

// Fetch data from API
async function getContactPageData(areaCode: string): Promise<ContactPageData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/public/contact-page/${areaCode}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching contact page:', error);
    return null;
  }
}

// Get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Main Page Component
interface PageProps {
  params: Promise<{
    area_code: string;
  }>;
}

export default async function PublicContactPage({ params }: PageProps) {
  const { area_code } = await params;
  const data = await getContactPageData(area_code);

  if (!data) {
    notFound();
  }

  const brandColor = data.brand_color || '#3b82f6';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Animated Header */}
      <AnimatedHeader
        logoUrl={data.logo_url}
        customerName={data.customer_name}
        introText={data.intro_text}
        brandColor={brandColor}
      />

      {/* Main Content */}
      <main className="w-full py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your dedicated contacts are ready to assist you
            </p>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.members.map((contact, index) => (
              <AnimatedContactCard
                key={contact.id}
                contact={contact}
                brandColor={brandColor}
                index={index}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Animated Footer */}
      <AnimatedFooter />
    </div>
  );
}

// Generate metadata
export async function generateMetadata({ params }: PageProps) {
  const { area_code } = await params;
  const data = await getContactPageData(area_code);

  if (!data) {
    return {
      title: 'Contact Page Not Found',
    };
  }

  return {
    title: `Contact ${data.customer_name} | COPARK`,
    description: data.intro_text || `Get in touch with ${data.customer_name}`,
  };
}