// =============================================
// FILE: components/wallboard/WallboardHeader.tsx
// =============================================
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

interface WallboardHeaderProps {
  name: string;
  areaCode: string;
  updatedAt: Date;
}

export default function WallboardHeader({ name, areaCode, updatedAt }: WallboardHeaderProps) {
  // Convert to Copenhagen timezone
  const copenhagenTime = toZonedTime(updatedAt, 'Europe/Copenhagen');
  const formattedDate = format(copenhagenTime, 'dd.MM.yyyy HH:mm');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{name}</h1>
      <p className="mt-2 text-lg text-gray-600">Area Code: {areaCode}</p>
      <p className="mt-1 text-sm text-gray-500">Last Updated: {formattedDate}</p>
    </div>
  );
}
