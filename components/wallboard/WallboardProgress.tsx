// =============================================
// FILE: components/wallboard/WallboardProgress.tsx
// =============================================
import { Progress } from '@/components/ui/progress';

interface WallboardProgressProps {
  percentage: number;
  checked: number;
  total: number;
}

export default function WallboardProgress({ percentage, checked, total }: WallboardProgressProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900">Progress</h2>
        <span className="text-2xl font-bold text-gray-900">
          {Math.round(percentage)}%
        </span>
      </div>
      
      <Progress value={percentage} className="h-3" />
      
      <p className="mt-3 text-sm text-gray-600">
        {checked} of {total} addresses completed
      </p>
    </div>
  );
}
