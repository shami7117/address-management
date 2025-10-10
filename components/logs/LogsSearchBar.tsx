// ============================================
// components/logs/LogsSearchBar.tsx
// ============================================

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface LogsSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function LogsSearchBar({ value, onChange }: LogsSearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        type="text"
        placeholder="Search by address, actor, or action..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
