// ============================================
// components/user/FilterTabs.tsx
// ============================================

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FilterTabsProps {
  activeTab: 'all' | 'checked' | 'unchecked';
  onTabChange: (tab: 'all' | 'checked' | 'unchecked') => void;
}

export default function FilterTabs({ activeTab, onTabChange }: FilterTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={(value:any) => onTabChange(value as any)}>
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="checked">Checked</TabsTrigger>
        <TabsTrigger value="unchecked">Unchecked</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}