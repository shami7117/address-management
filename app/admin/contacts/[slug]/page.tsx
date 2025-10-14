import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone } from 'lucide-react';

// BrandingHeader Component
interface BrandingHeaderProps {
  logoUrl?: string;
  customerName: string;
  introText?: string;
  accentColor?: string;
}

function BrandingHeader({ logoUrl, customerName, introText, accentColor }: BrandingHeaderProps) {
  if (!logoUrl && !introText) return null;

  return (
    <div className="w-full bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-4">
          {logoUrl && (
            <img
              src={logoUrl}
              alt={`${customerName} logo`}
              className="h-16 w-auto object-contain"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{customerName}</h1>
            {introText && (
              <p className="mt-2 text-lg text-gray-600 max-w-2xl">{introText}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ContactCard Component
interface Contact {
  id: string;
  name: string;
  title: string;
  role: 'sales' | 'operations' | 'day-to-day';
  email: string;
  phone: string;
  photoUrl?: string;
  reasons: string[];
}

interface ContactCardProps {
  contact: Contact;
  accentColor?: string;
}

function ContactCard({ contact, accentColor }: ContactCardProps) {
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'sales':
        return 'Sales & Contract';
      case 'operations':
        return 'Operations & Service';
      case 'day-to-day':
        return 'Day-to-Day Contact';
      default:
        return role;
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    if (accentColor) {
      return { backgroundColor: accentColor, color: '#ffffff' };
    }
    
    switch (role) {
      case 'sales':
        return {};
      case 'operations':
        return {};
      case 'day-to-day':
        return {};
      default:
        return {};
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-6 flex flex-col items-center text-center space-y-4 flex-1">
        {/* Photo */}
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          {contact.photoUrl ? (
            <img
              src={contact.photoUrl}
              alt={`${contact.name} – ${contact.title}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl font-semibold">
              {contact.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Name & Title */}
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-gray-900">{contact.name}</h3>
          <p className="text-sm text-gray-600">{contact.title}</p>
        </div>

        {/* Role Badge */}
        <Badge 
          className="text-xs px-3 py-1"
          style={getRoleBadgeStyle(contact.role)}
        >
          {getRoleLabel(contact.role)}
        </Badge>

        {/* Contact Info */}
        <div className="space-y-2 w-full">
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            <Mail className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span className="break-all">{contact.email}</span>
          </a>
          <a
            href={`tel:${contact.phone}`}
            className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            <Phone className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>{contact.phone}</span>
          </a>
        </div>

        {/* Reasons */}
        {contact.reasons.length > 0 && (
          <div className="w-full pt-4 border-t mt-auto">
            <p className="text-xs font-semibold text-gray-700 mb-2">Contact for:</p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {contact.reasons.map((reason, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {reason}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// PublicFooter Component
interface PublicFooterProps {
  lastUpdated?: string;
}

function PublicFooter({ lastUpdated }: PublicFooterProps) {
  return (
    <footer className="w-full bg-gray-50 border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">COPARK</span>
            <span>·</span>
            <span>Contact Directory</span>
          </div>
          {lastUpdated && (
            <div>Last updated: {lastUpdated}</div>
          )}
        </div>
      </div>
    </footer>
  );
}

// Main Page Component
interface PageProps {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

// Mock data - replace with actual data fetching
async function getContactData(slug: Promise<string> | string) {
  // This would be replaced with actual API call or database query
  return {
    customerName: 'Acme Corporation',
    logoUrl: 'https://lh3.googleusercontent.com/gg-dl/AJfQ9KR44yUGnGmr6T4wsQU1N5a3tlzRf48ladcHHAQj-pAxJATEMJRTdw6uzmaDqL4JFho7rwkrFnSf1jvAoKOnc5uQKiTd-sqeoSbitMirvPM9bvjHhq99MzEn5YJaMW1CzwJLtLUjWSXgnib8m0K0jni6EElPHFDehrecjZ7jI_ol_Z0=s1024-rj',
    introText: 'Your dedicated team is here to support you. Reach out anytime!',
    accentColor: '#4F46E5',
    lastUpdated: 'October 14, 2025',
    contacts: [
      {
        id: '1',
        name: 'Sarah Johnson',
        title: 'Account Executive',
        role: 'sales' as const,
        email: 'sarah.johnson@copark.com',
        phone: '+1 (555) 123-4567',
        photoUrl: 'https://i.pravatar.cc/150?img=1',
        reasons: ['Contract questions', 'Pricing', 'New services'],
      },
      {
        id: '2',
        name: 'Michael Chen',
        title: 'Operations Manager',
        role: 'operations' as const,
        email: 'michael.chen@copark.com',
        phone: '+1 (555) 234-5678',
        photoUrl: 'https://i.pravatar.cc/150?img=13',
        reasons: ['Service issues', 'Technical support', 'Escalations'],
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        title: 'Customer Success Lead',
        role: 'day-to-day' as const,
        email: 'emily.rodriguez@copark.com',
        phone: '+1 (555) 345-6789',
        photoUrl: 'https://i.pravatar.cc/150?img=5',
        reasons: ['Daily inquiries', 'General questions', 'Account updates'],
      },
      {
        id: '4',
        name: 'David Kim',
        title: 'Senior Account Manager',
        role: 'sales' as const,
        email: 'david.kim@copark.com',
        phone: '+1 (555) 456-7890',
        photoUrl: 'https://i.pravatar.cc/150?img=14',
        reasons: ['Account reviews', 'Contract renewals', 'Strategic planning'],
      },
    ],
  };
}

export default async function ContactsPage({ params, searchParams }: PageProps) {
  const data = await getContactData(params.slug);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Branding Header */}
      <BrandingHeader
        logoUrl={data.logoUrl}
        customerName={data.customerName}
        introText={data.introText}
        accentColor={data.accentColor}
      />

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                accentColor={data.accentColor}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <PublicFooter lastUpdated={data.lastUpdated} />
    </div>
  );
}