
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone } from 'lucide-react';

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

interface AnimatedContactCardProps {
  contact: ContactMember;
  brandColor: string;
  index: number;
}

export function AnimatedContactCard({
  contact,
  brandColor,
  index,
}: AnimatedContactCardProps) {
  // Get initials for avatar fallback
  const initials = contact.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Lighten brand color for badge background
  const lightenColor = (color: string, percent: number) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return `#${(
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)}`;
  };

  const lightBrandColor = lightenColor(brandColor, 40);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
          >
            <Avatar className="w-24 h-24 border-4 border-white shadow-md">
              <AvatarImage src={contact.photo_url || undefined} alt={contact.name} />
              <AvatarFallback
                className="text-2xl font-bold"
                style={{ backgroundColor: lightBrandColor, color: brandColor }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
          </motion.div>

          {/* Name & Title */}
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-gray-900">{contact.name}</h3>
            <p className="text-sm text-gray-600">{contact.title}</p>
          </div>

          {/* Role Badge */}
          {contact.role && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.1 + 0.3,
                type: 'spring',
                stiffness: 200,
                damping: 10,
              }}
            >
              <Badge
                className="text-xs px-3 py-1 font-medium"
                style={{
                  backgroundColor: brandColor,
                  color: '#ffffff',
                }}
              >
                {contact.role}
              </Badge>
            </motion.div>
          )}

          {/* Contact Info */}
          <div className="space-y-2.5 w-full pt-2">
            {contact.email && (
              <motion.a
                href={`mailto:${contact.email}`}
                className="flex items-center justify-center gap-2 text-sm hover:underline transition-colors"
                style={{ color: brandColor }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="break-all">{contact.email}</span>
              </motion.a>
            )}
            {contact.phone && (
              <motion.a
                href={`tel:${contact.phone}`}
                className="flex items-center justify-center gap-2 text-sm hover:underline transition-colors"
                style={{ color: brandColor }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{contact.phone}</span>
              </motion.a>
            )}
          </div>

          {/* Contact Reasons */}
          {contact.reasons.length > 0 && (
            <div className="w-full pt-4 border-t mt-auto">
              <p className="text-xs font-semibold text-gray-700 mb-2.5">
                Contact for:
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {contact.reasons.map((reason, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.1 + 0.4 + idx * 0.05,
                      type: 'spring',
                      stiffness: 300,
                      damping: 15,
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{
                        borderColor: brandColor,
                        color: brandColor,
                      }}
                    >
                      {reason}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}