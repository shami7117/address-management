// ============================================
// components/logs/LogsFilterTabs.tsx
// ============================================

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type LogAction = 'all' | 'check' | 'uncheck' | 'edit_comment' | 'reorder';

interface LogsFilterTabsProps {
  activeTab: LogAction;
  onTabChange: (tab: LogAction) => void;
}

export default function LogsFilterTabs({ activeTab, onTabChange }: LogsFilterTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as LogAction)}>
      <TabsList className="grid w-full grid-cols-5 lg:w-auto">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="check">Check</TabsTrigger>
        <TabsTrigger value="uncheck">Uncheck</TabsTrigger>
        <TabsTrigger value="edit_comment">Edit</TabsTrigger>
        <TabsTrigger value="reorder">Reorder</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
