// ============================================
// components/user/AddressSearchBar.tsx
// ============================================

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface AddressSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function AddressSearchBar({ value, onChange }: AddressSearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        type="text"
        placeholder="Search addresses (supports ÆØÅ)..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}